import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth'; // Assuming `auth` function exists and returns session
import { getUsersCollection } from '@/models/User';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAuth(); // Use the existing auth function to get session
    if (authResult instanceof NextResponse) {
      return authResult; // Unauthorized or Forbidden
    }

    // authResult is DecodedToken here
    const userId = authResult.userId; // Assuming userId is available in DecodedToken

    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { showModeratorWelcome: false } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Moderator welcome flag cleared successfully' });
  } catch (error) {
    console.error('Error clearing moderator welcome flag:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
