import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/auth';

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