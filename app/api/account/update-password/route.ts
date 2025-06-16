import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: '認証されていません' }, { status: 401 });
  }

  let userId: ObjectId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    userId = new ObjectId(decoded.userId);
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.json({ message: '無効なトークンです' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: '現在のパスワードと新しいパスワードは必須です' }, { status: 400 });
    }

    // Find the current user
    const currentUser = await usersCollection.findOne({ _id: userId });
    if (!currentUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // Verify current password
    if (!currentUser.password) {
        return NextResponse.json({ message: 'パスワードが設定されていません' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: '現在のパスワードが正しくありません' }, { status: 401 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: { password: hashedNewPassword } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'パスワードを更新できませんでした' }, { status: 500 });
    }

    return NextResponse.json({ message: 'パスワードが正常に更新されました' }, { status: 200 });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json({ message: 'サーバー内部エラーが発生しました' }, { status: 500 });
  }
} 