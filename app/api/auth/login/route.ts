import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET環境変数が設定されていません');
}

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password || '');

    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: MAX_AGE }
    );

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: MAX_AGE,
      path: '/',
    });

    const response = NextResponse.json({ message: 'Logged in successfully', user: {
      _id: user._id,
      email: user.email,
      username: user.username,
    } }, { status: 200 });
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
} 