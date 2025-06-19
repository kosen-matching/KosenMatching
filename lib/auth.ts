import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET環境変数が設定されていません');
}

export interface DecodedToken {
  userId: string;
  email?: string;
  username?: string;
  iat: number;
  exp: number;
}

/**
 * 認証トークンを検証し、デコードされたトークン情報を返します
 * @returns デコードされたトークン、または認証エラーのレスポンス
 */
export async function verifyAuth(): Promise<NextResponse | DecodedToken> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Authentication error' }, { status: 500 });
  }
}

/**
 * 管理者権限を検証します
 * @returns デコードされたトークン、または認証・権限エラーのレスポンス
 */
export async function verifyAdmin(): Promise<NextResponse | DecodedToken> {
  const authResult = await verifyAuth();
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL環境変数が設定されていません");
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  if (authResult.email !== ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return authResult;
} 