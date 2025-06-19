import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { verifyAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const adminCheckResult = await verifyAdmin();
    if (adminCheckResult instanceof NextResponse) {
        return adminCheckResult;
    }

    try {
        const db = await getDb();
        const usersCollection = getUsersCollection(db);

        const users = await usersCollection.find({}, {
            projection: {
                password: 0, // パスワードは除外する
                'profileImage.data': 0 // 画像データそのものは除外
            }
        }).sort({ createdAt: -1 }).toArray();

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
} 