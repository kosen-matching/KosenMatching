import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/lib/auth';
import { AuthenticatedUser, UserResponse } from '@/types/api';
import { 
  createApiResponse, 
  createErrorResponse, 
  handleDatabaseError, 
  setSecurityHeaders,
  validateEnvVar,
  ApiLogger 
} from '@/lib/api-utils';

/**
 * 現在のユーザー情報を取得するAPI
 * 認証されたユーザーの情報とロール（admin/user）を返します
 */
export async function GET(): Promise<NextResponse> {
  const operation = 'GET /api/auth/me';
  ApiLogger.info(operation, 'ユーザー情報取得開始');

  // 認証チェック
  const authResult = await verifyAuth();
  if (authResult instanceof NextResponse) {
    ApiLogger.warn(operation, '認証に失敗しました');
    return authResult;
  }

  // 環境変数の検証（オプショナル）
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  validateEnvVar('ADMIN_EMAIL', ADMIN_EMAIL, false);

  try {
    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    // ユーザー情報を取得（パスワードは除外）
    const user = await usersCollection.findOne(
      { _id: new ObjectId(authResult.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      ApiLogger.warn(operation, `ユーザーが見つかりません: ${authResult.userId}`);
      return createErrorResponse('ユーザーが見つかりません', 404, 'USER_NOT_FOUND');
    }

    // 管理者権限の判定（lib/auth.tsと一貫性を保つ）
    const isAdmin = ADMIN_EMAIL && user.email === ADMIN_EMAIL;

    // レスポンス用のユーザー情報を構築
    const authenticatedUser: AuthenticatedUser = {
      ...user,
      role: isAdmin ? 'admin' : 'user'
    };

    ApiLogger.success(operation, `ユーザー情報を正常に取得しました`, {
      userId: authResult.userId,
      role: authenticatedUser.role
    });

    const response = createApiResponse(
      authenticatedUser,
      'ユーザー情報を正常に取得しました'
    );

    // セキュリティヘッダーを設定
    setSecurityHeaders(response);

    return response;

  } catch (error) {
    ApiLogger.error(operation, 'ユーザー情報取得中にエラーが発生しました', error);
    return handleDatabaseError(error, operation);
  }
}

/**
 * ヘルスチェック（開発環境のみ）
 */
export async function HEAD(): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'development') {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 405 });
} 