import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

interface DecodedToken {
  userId: string;
  email: string;
}

async function verifyAdmin(): Promise<NextResponse | DecodedToken> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
        decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    
    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL environment variable is not set.");
        return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    if (decoded.email !== ADMIN_EMAIL) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    return decoded;
}

export async function PUT(req: NextRequest) {
    const adminCheckResult = await verifyAdmin();
    if (adminCheckResult instanceof NextResponse) {
        return adminCheckResult;
    }

    try {
        const body = await req.json();
        const { userId, status } = body;

        if (!userId || !status || !['active', 'banned'].includes(status)) {
            return NextResponse.json({ message: 'User ID and a valid status (active, banned) are required' }, { status: 400 });
        }

        if (adminCheckResult.userId === userId) {
            return NextResponse.json({ message: 'Admins cannot change their own status' }, { status: 403 });
        }

        const db = await getDb();
        const usersCollection = getUsersCollection(db);

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { status: status } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `User status updated to ${status}`}, { status: 200 });

    } catch (error) {
        console.error("Failed to update user status:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
} 