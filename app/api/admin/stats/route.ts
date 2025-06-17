import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';

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