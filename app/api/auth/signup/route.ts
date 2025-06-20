import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { User, getUsersCollection, UserType } from '@/models/User';
import { 
  createApiResponse, 
  createErrorResponse, 
  parseRequestBody, 
  handleDatabaseError,
  setSecurityHeaders,
  ApiLogger,
  validateEnvVar
} from '@/lib/api-utils';
import { ApiResponse } from '@/types/api';

const JWT_SECRET = process.env.JWT_SECRET!;

// 環境変数の検証
if (!validateEnvVar('JWT_SECRET', JWT_SECRET)) {
  throw new Error('JWT_SECRET環境変数が設定されていません');
}

// 定数定義
const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = '1d';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1日
const MAX_SIGNUP_ATTEMPTS_PER_IP = 10; // 1時間あたりのIPごとの最大登録試行回数
const SIGNUP_ATTEMPT_WINDOW = 60 * 60 * 1000; // 1時間

// 登録試行記録の型定義
interface SignupAttempt {
  attempts: number;
  firstAttempt: Date;
}

// メモリベースのレート制限（本番環境ではRedisなどを推奨）
const signupAttempts = new Map<string, SignupAttempt>();

// リクエストボディの型定義
interface SignupRequest {
  userType: UserType;
  username: string;
  email: string;
  password: string;
  kosenId?: string;
  kosenEmail?: string;
}

// レスポンスの型定義
interface SignupResponse {
  user: {
    _id: string;
    email: string;
    username: string;
    userType: UserType;
  };
}

/**
 * クライアントIPアドレスを取得
 */
async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = headersList.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  // Fallback for development/testing
  return '127.0.0.1';
}

/**
 * 登録試行制限をチェック
 */
function checkSignupRateLimit(ip: string): { blocked: boolean; message?: string } {
  const attempt = signupAttempts.get(ip);
  const now = new Date();

  if (!attempt) {
    return { blocked: false };
  }
  
  // 試行期間を過ぎていたらリセット
  if (now.getTime() - attempt.firstAttempt.getTime() > SIGNUP_ATTEMPT_WINDOW) {
    signupAttempts.delete(ip);
    return { blocked: false };
  }

  if (attempt.attempts >= MAX_SIGNUP_ATTEMPTS_PER_IP) {
    return { blocked: true, message: '短時間に多くの登録試行がありました。しばらくしてからもう一度お試しください。' };
  }

  return { blocked: false };
}

/**
 * 登録試行を記録
 */
function recordSignupAttempt(ip: string): void {
  const now = new Date();
  const attempt = signupAttempts.get(ip);

  if (attempt && now.getTime() - attempt.firstAttempt.getTime() <= SIGNUP_ATTEMPT_WINDOW) {
    attempt.attempts++;
  } else {
    // 新しい試行期間
    signupAttempts.set(ip, {
      attempts: 1,
      firstAttempt: now,
    });
  }
}

/**
 * メールアドレスの形式を検証
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * パスワードの強度を検証
 * @returns {object} { isValid: boolean, strength: 'weak' | 'medium' | 'strong', message?: string }
 * 強度基準：
 * - weak: 12文字未満、または文字種が2種類以下
 * - medium: 12文字以上かつ、大文字・小文字・数字・特殊文字のうち3種類以上を使用
 * - strong: 16文字以上かつ、4種類すべてを使用
 */
function validatePassword(password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; message?: string } {
    const minLength = 12;
    if (password.length < minLength) {
        return { isValid: false, strength: 'weak', message: `パスワードは最低${minLength}文字以上である必要があります。` };
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const conditionsMet = [hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length;

    if (conditionsMet < 3) {
        return { isValid: false, strength: 'weak', message: 'パスワードには、大文字、小文字、数字、特殊文字のうち少なくとも3種類以上を含める必要があります。' };
    }

    if (password.length >= 16 && conditionsMet >= 4) {
        return { isValid: true, strength: 'strong' };
    }

    // 12文字以上、3種類以上を満たしていればmedium
    return { isValid: true, strength: 'medium' };
}

/**
 * ユーザー名の妥当性を検証
 */
function isValidUsername(username: string): boolean {
  // 3-20文字、英数字とアンダースコアのみ
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * 高専のメールアドレスかどうかを検証
 */
function isKosenEmail(email: string): boolean {
  // 高専のドメインパターン（例: ac.jp で終わる）
  return /\.ac\.jp$/.test(email);
}

/**
 * リクエストボディを検証
 */
function validateSignupRequest(body: any): { isValid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'リクエスト形式が正しくありません' };
  }

  const { userType, username, email, password, kosenId, kosenEmail } = body;

  // 必須フィールドのチェック
  if (!userType || !username || !email || !password) {
    return { isValid: false, error: 'ユーザータイプ、ユーザー名、メールアドレス、パスワードは必須です' };
  }

  // ユーザータイプの検証
  if (!['student', 'alumnus', 'examinee'].includes(userType)) {
    return { isValid: false, error: '無効なユーザータイプです' };
  }

  // 学生の場合の必須フィールドチェック
  if (userType === 'student' && (!kosenId || !kosenEmail)) {
    return { isValid: false, error: '学生の場合、高専IDと高専メールアドレスは必須です' };
  }

  // 卒業生の場合の必須フィールドチェック
  if (userType === 'alumnus' && !kosenId) {
    return { isValid: false, error: '卒業生の場合、高専IDは必須です' };
  }

  // フィールドの妥当性チェック
  if (!isValidEmail(email)) {
    return { isValid: false, error: 'メールアドレスの形式が正しくありません' };
  }

  if (!isValidUsername(username)) {
    return { isValid: false, error: 'ユーザー名は3-20文字の英数字とアンダースコアのみ使用できます' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return { isValid: false, error: passwordValidation.message };
  }

  // 高専メールアドレスの検証
  if (kosenEmail && !isValidEmail(kosenEmail)) {
    return { isValid: false, error: '高専メールアドレスの形式が正しくありません' };
  }

  if (kosenEmail && !isKosenEmail(kosenEmail)) {
    return { isValid: false, error: '有効な高専のメールアドレスを使用してください（.ac.jpドメイン）' };
  }

  return { isValid: true };
}

export async function POST(req: Request): Promise<NextResponse> {
  const ip = await getClientIP();

  // レート制限チェック
  const rateLimit = checkSignupRateLimit(ip);
  if (rateLimit.blocked) {
    ApiLogger.warn('signup', `レートリミット超過: ${ip}`);
    return createErrorResponse(rateLimit.message!, 429, 'RATE_LIMIT_EXCEEDED');
  }
  recordSignupAttempt(ip); // 処理の開始時に試行を記録

  ApiLogger.info('signup', 'ユーザー登録処理を開始', { ip });

  try {
    // リクエストボディの解析
    const body = await parseRequestBody<SignupRequest>(req);
    if (body instanceof NextResponse) {
      return body; // エラーレスポンスの場合
    }

    // リクエストの検証
    const validation = validateSignupRequest(body);
    if (!validation.isValid) {
      ApiLogger.warn('signup', `バリデーションエラー: ${validation.error}`);
      return createErrorResponse(validation.error!, 400, 'VALIDATION_ERROR');
    }

    const { userType, username, email, password, kosenId, kosenEmail } = body;

    // データベース接続
    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    // 既存ユーザーの重複チェック
    const existingUsers = await Promise.all([
      usersCollection.findOne({ email }),
      usersCollection.findOne({ username }),
      kosenEmail ? usersCollection.findOne({ kosenEmail }) : null
    ]);

    const [existingUserByEmail, existingUserByUsername, existingUserByKosenEmail] = existingUsers;

    if (existingUserByEmail) {
      ApiLogger.warn('signup', `メールアドレスが既に使用されています: ${email}`);
      return createErrorResponse('このメールアドレスは既に使用されています', 409, 'EMAIL_EXISTS');
    }

    if (existingUserByUsername) {
      ApiLogger.warn('signup', `ユーザー名が既に使用されています: ${username}`);
      return createErrorResponse('このユーザー名は既に使用されています', 409, 'USERNAME_EXISTS');
    }

    if (existingUserByKosenEmail) {
      ApiLogger.warn('signup', `高専メールアドレスが既に使用されています: ${kosenEmail}`);
      return createErrorResponse('この高専メールアドレスは既に使用されています', 409, 'KOSEN_EMAIL_EXISTS');
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 新規ユーザーの作成
    const newUser: Omit<User, '_id'> = {
      userType,
      username,
      email,
      password: hashedPassword,
      kosenId,
      kosenEmail,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // JWTトークンの生成
    const token = jwt.sign(
      { userId: result.insertedId.toString() }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    // レスポンス用のユーザー情報（パスワードを除外）
    const responseUser: SignupResponse['user'] = {
      _id: result.insertedId.toString(),
      email,
      username,
      userType,
    };

    // レスポンス作成
    const response = createApiResponse(
      { user: responseUser },
      'ユーザー登録が完了しました',
      201
    );

    // セキュリティヘッダーの設定
    setSecurityHeaders(response);

    // JWTクッキーの設定
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    ApiLogger.success('signup', `ユーザー登録完了: ${username} (${email})`);
    return response;

  } catch (error) {
    ApiLogger.error('signup', 'ユーザー登録中にエラーが発生', { ip, error });
    return handleDatabaseError(error, 'signup');
  }
} 