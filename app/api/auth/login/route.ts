import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // ユーザーが見つからない場合も、セキュリティのために一般的なエラーメッセージを返す
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // パスワードフィールドを削除したユーザーオブジェクトを返す
    const userObject = user.toObject();
    delete userObject.password;

    // 実際のアプリケーションでは、ここでセッション/JWTを作成します
    return NextResponse.json({ user: userObject }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
} 