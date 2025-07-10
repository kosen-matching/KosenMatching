import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';
import { getUsersCollection } from '@/models/User';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyAdmin();
    if (authResult instanceof NextResponse) {
      return authResult; // Unauthorized or Forbidden
    }

    const { userId, newRole } = await req.json();
    console.log(`[API] Received request to update user role: userId=${userId}, newRole=${newRole}`);

    if (!userId || !newRole) {
      return NextResponse.json({ message: 'User ID and new role are required' }, { status: 400 });
    }

    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    const updateFields: { userType: string; showModeratorWelcome?: boolean } = { userType: newRole };

    if (newRole === 'moderator') {
      updateFields.showModeratorWelcome = true;
    } else if (newRole !== 'moderator') {
      updateFields.showModeratorWelcome = false;
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    console.log(`[API] Update result: matchedCount=${result.matchedCount}, modifiedCount=${result.modifiedCount}`);

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
