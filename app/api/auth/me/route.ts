import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { ObjectId } from 'mongodb';
import { verifyAuth } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function GET() {
  const authResult = await verifyAuth();
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const db = await getDb();
    const usersCollection = getUsersCollection(db);

    const user = await usersCollection.findOne(
      { _id: new ObjectId(authResult.userId) },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Add role information based on admin email check
    const userWithRole = {
      ...user,
      role: ADMIN_EMAIL && user.email === ADMIN_EMAIL ? 'admin' : 'user'
    };

    return NextResponse.json({ user: userWithRole }, { status: 200 });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
} 