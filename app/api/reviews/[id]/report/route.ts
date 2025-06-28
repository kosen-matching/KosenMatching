import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getToken } from 'next-auth/jwt';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.sub) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id: reviewId } = params;
  if (!ObjectId.isValid(reviewId)) {
    return NextResponse.json({ success: false, error: 'Invalid review ID' }, { status: 400 });
  }

  const reporterUserId = new ObjectId(token.sub);

  try {
    const db = await getDb();
    
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(reviewId) });
    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    const existingReport = await db.collection('reports').findOne({
      reviewId: new ObjectId(reviewId),
      reporterUserId,
    });

    if (existingReport) {
      return NextResponse.json({ success: false, error: 'You have already reported this review' }, { status: 409 });
    }

    await db.collection('reports').insertOne({
      reviewId: new ObjectId(reviewId),
      reporterUserId,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Review reported successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server Error', details: error.message }, { status: 500 });
  }
} 