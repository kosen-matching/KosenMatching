import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

// レスポンスの型定義
interface LogoutResponse {
  message: string;
}

/**
 * クライアントIPアドレスを取得
 */
async function getClientIP(): Promise<string> {
  try {
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
  } catch {
    return 'unknown';
  }
}

/**
 * トークンからユーザー情報を取得
 */
async function getUserFromToken(): Promise<{ userId?: string; email?: string } | null> {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    
    if (!cookieHeader) {
      return null;
    }

    // クッキーからトークンを抽出
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return null;
    }

    const token = tokenMatch[1];
    
    // JWTトークンの検証
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email
    };
  } catch {
    // トークンが無効または期限切れの場合
    return null;
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
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}

/**
 * セキュアクッキーの削除
 */
function createLogoutCookie(): string {
  return serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // クッキーを即座に期限切れにする
    path: '/',
  });
}

export async function POST(req: Request) {
  const ip = await getClientIP();
  
  try {
    // 現在のユーザー情報を取得（ログ用）
    const userInfo = await getUserFromToken();
    
    // セキュアクッキーの削除
    const logoutCookie = createLogoutCookie();

    // レスポンス生成
    const response = NextResponse.json({
      message: 'ログアウトしました'
    } as LogoutResponse, { status: 200 });

    // セキュリティヘッダーとクッキー削除を設定
    setSecurityHeaders(response);
    response.headers.set('Set-Cookie', logoutCookie);

    // セキュリティログ出力
    console.log('User logout:', {
      userId: userInfo?.userId || 'unknown',
      email: userInfo?.email || 'unknown',
      ip,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || 'unknown'
    });

    return response;

  } catch (error) {
    // エラーログ出力
    console.error('Logout error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip,
      timestamp: new Date().toISOString()
    });

    // エラーが発生してもログアウト処理は継続
    const logoutCookie = createLogoutCookie();
    const response = NextResponse.json({
      message: 'ログアウトしました'
    } as LogoutResponse, { status: 200 });

    setSecurityHeaders(response);
    response.headers.set('Set-Cookie', logoutCookie);

    return response;
  }
}

// GETメソッドでのアクセスを拒否
export async function GET() {
  return NextResponse.json({
    message: 'Method not allowed'
  } as LogoutResponse, { status: 405 });
} 