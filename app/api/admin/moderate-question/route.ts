import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
// import { isAdmin } from '@/lib/auth';

export async function PUT(request: Request) {
  try {
    // const user = await isAdmin();
    // if (!user) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { questionId, status } = await request.json();

    if (!questionId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const db = await getDb();

    const updateData: { $set: { status: 'approved' | 'rejected', approvedAt?: Date } } = {
      $set: {
        status,
      }
    };

    if (status === 'approved') {
      updateData.$set.approvedAt = new Date();
    }

    const result = await db.collection('direct_questions').updateOne(
      { _id: new ObjectId(questionId) },
      updateData
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    // Here you could trigger a notification email to the user who asked.

    return NextResponse.json({ message: 'Question status updated successfully' });

  } catch (error) {
    console.error('Error moderating question:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to moderate question', error: errorMessage }, { status: 500 });
  }
} 