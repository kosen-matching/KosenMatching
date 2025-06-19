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

        const totalUsers = await usersCollection.countDocuments();
        
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const newUsersToday = await usersCollection.countDocuments({
            createdAt: { $gte: startOfToday }
        });

        // "今日のアクセス数"は定義が曖昧なため、ここでは"今日の新規登録者数"を返します。
        // もし特定のログやセッション情報を元にしたアクセス数が必要な場合は、別途実装が必要です。
        return NextResponse.json({
            totalUsers,
            todayAccesses: newUsersToday, // Note: This is new users today
        }, { status: 200 });

    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
} 