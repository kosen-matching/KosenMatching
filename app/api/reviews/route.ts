import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

// 体験談一覧取得
export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    
    const kosenId = searchParams.get('kosenId');
    const department = searchParams.get('department');
    const year = searchParams.get('year');
    const rating = searchParams.get('rating');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    const filter: any = {};
    if (kosenId) filter.kosenId = kosenId;
    if (department) filter.department = department;
    if (year) filter.year = parseInt(year, 10);
    if (rating) filter.rating = { $gte: Number(rating) };

    const reviews = await db.collection('reviews')
      .find(filter)
      .sort({ [sortBy]: order })
      .toArray();

    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
}

// 新規体験談投稿
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const body = await req.json();
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(token.sub) });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const reviewData = {
      ...body,
      userId: new ObjectId(user._id),
      username: user.username,
      profileImageUrl: user.profileImageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // データのバリデーションをここで行うこともできる

    const result = await db.collection('reviews').insertOne(reviewData);
    const newReview = { _id: result.insertedId, ...reviewData };

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error: any) {
    // Zodなどを使ったバリデーションエラーハンドリングがより堅牢
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
} 