import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { IDirectQuestion } from '@/lib/models/directQuestion.model';
// import { isAdmin } from '@/lib/auth'; // Assuming an auth check utility

export async function GET(request: Request) {
  try {
    // const user = await isAdmin();
    // if (!user) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    
    const db = await getDb();

    const pendingQuestions = await db.collection<IDirectQuestion>('direct_questions')
      .find({ status: 'pending' })
      .sort({ createdAt: 'asc' })
      .toArray();

    return NextResponse.json(pendingQuestions);

  } catch (error) {
    console.error('Error fetching pending questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to fetch pending questions', error: errorMessage }, { status: 500 });
  }
} 