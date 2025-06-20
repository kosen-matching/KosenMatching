import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
    }

    const review = await db.collection('reviews').findOne({ _id: new ObjectId(params.id) });

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    // ユーザー情報を取得して結合する
    if (review.userId && ObjectId.isValid(review.userId)) {
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(review.userId) },
            { projection: { username: 1, profileImageUrl: 1 } }
        );
        if (user) {
            review.user = user;
        }
    }


    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
} 