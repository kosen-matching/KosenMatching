import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUsersCollection, User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET環境変数が設定されていません');
}

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const MAX_LOGIN_ATTEMPTS = 5; // 最大ログイン試行回数
const LOCKOUT_TIME = 15 * 60 * 1000; // 15分間のロックアウト時間

// リクエストボディの型定義
interface LoginRequest {
  email: string;
  password: string;
}

// ログイン試行記録の型定義
interface LoginAttempt {
  ip: string;
  email: string;
  attempts: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

// レスポンスの型定義
interface LoginResponse {
  message: string;
  user?: {
    _id: string;
    email: string;
    username: string;
    userType: string;
  };
}

// メモリベースのレート制限（本番環境ではRedisなどを推奨）
const loginAttempts = new Map<string, LoginAttempt>();

/**
 * メールアドレスの形式を検証
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * パスワードの要件を検証
 */
function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}

/**
 * リクエストボディを検証
 */
function validateLoginRequest(body: any): { isValid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Invalid request format' };
  }

  const { email, password } = body;

  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'メールアドレスとパスワードを入力してください' };
  }

  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'メールアドレスとパスワードを入力してください' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'メールアドレスの形式が正しくありません' };
  }

  if (!isValidPassword(password)) {
    return { isValid: false, error: 'パスワードの形式が正しくありません' };
  }

  return { isValid: true };
}

/**
 * クライアントIPアドレスを取得
 */
async function getClientIP(request: Request): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const realIP = headersList.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

/**
 * ログイン試行制限をチェック
 */
function checkRateLimit(ip: string, email: string): { blocked: boolean; remainingTime?: number } {
  const key = `${ip}:${email}`;
  const attempt = loginAttempts.get(key);

  if (!attempt) {
    return { blocked: false };
  }

  const now = new Date();

  // ロックアウト時間を過ぎている場合はリセット
  if (attempt.lockedUntil && now > attempt.lockedUntil) {
    loginAttempts.delete(key);
    return { blocked: false };
  }

  // ロックアウト中の場合
  if (attempt.lockedUntil && now <= attempt.lockedUntil) {
    const remainingTime = Math.ceil((attempt.lockedUntil.getTime() - now.getTime()) / 1000);
    return { blocked: true, remainingTime };
  }

  // 試行回数が上限に達している場合
  if (attempt.attempts >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = new Date(now.getTime() + LOCKOUT_TIME);
    loginAttempts.set(key, attempt);
    return { blocked: true, remainingTime: Math.ceil(LOCKOUT_TIME / 1000) };
  }

  return { blocked: false };
}

/**
 * ログイン試行を記録
 */
function recordLoginAttempt(ip: string, email: string, success: boolean): void {
  const key = `${ip}:${email}`;
  const now = new Date();

  if (success) {
    // 成功時は記録を削除
    loginAttempts.delete(key);
    return;
  }

  const attempt = loginAttempts.get(key);
  if (attempt) {
    attempt.attempts += 1;
    attempt.lastAttempt = now;
  } else {
    loginAttempts.set(key, {
      ip,
      email,
      attempts: 1,
      lastAttempt: now
    });
  }
}

/**
 * セキュリティヘッダーを設定
 */
function setSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export async function POST(req: Request) {
  const ip = await getClientIP(req);
  
  try {
    // リクエストボディの解析
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON format' } as LoginResponse,
        { status: 400 }
      );
    }

    // バリデーション
    const validation = validateLoginRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { message: validation.error! } as LoginResponse,
        { status: 400 }
      );
    }

    const { email, password } = body as LoginRequest;

    // レート制限チェック
    const rateLimit = checkRateLimit(ip, email);
    if (rateLimit.blocked) {
      return NextResponse.json(
        { 
          message: `ログイン試行回数が上限に達しました。${Math.ceil((rateLimit.remainingTime || 0) / 60)}分後に再試行してください。` 
        } as LoginResponse,
        { status: 429 }
      );
    }

    // データベース接続
    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    // ユーザー検索
    const user = await usersCollection.findOne({ email });

    // パスワード検証（ユーザーが存在しない場合でも同じ処理時間を確保）
    const isPasswordMatch = user && user.password 
      ? await bcrypt.compare(password, user.password)
      : await bcrypt.compare(password, '$2b$10$dummy.hash.for.timing.attack.protection');

    // 認証失敗の処理
    if (!user || !isPasswordMatch) {
      recordLoginAttempt(ip, email, false);
      return NextResponse.json(
        { message: 'メールアドレスまたはパスワードが正しくありません' } as LoginResponse,
        { status: 401 }
      );
    }

    // 認証成功の処理
    recordLoginAttempt(ip, email, true);

    // JWTトークン生成
    const token = jwt.sign(
      { 
        userId: user._id?.toString(), 
        email: user.email, 
        username: user.username,
        userType: user.userType
      },
      JWT_SECRET,
      { expiresIn: MAX_AGE }
    );

    // セキュアクッキーの設定
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: MAX_AGE,
      path: '/',
    });

    // レスポンス生成
    const response = NextResponse.json({
      message: 'ログインしました',
      user: {
        _id: user._id?.toString() || '',
        email: user.email,
        username: user.username,
        userType: user.userType,
      }
    } as LoginResponse, { status: 200 });

    // セキュリティヘッダーとクッキーを設定
    setSecurityHeaders(response);
    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    // エラーログ（本番環境では適切なログ出力を推奨）
    console.error('Login error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。しばらく後にお試しください。' } as LoginResponse,
      { status: 500 }
    );
  }
} 