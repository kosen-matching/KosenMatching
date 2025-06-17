import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';
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


export async function GET(req: NextRequest) {
    const adminCheckResult = await verifyAdmin();
    if (adminCheckResult instanceof NextResponse) {
        return adminCheckResult;
    }

    try {
        const db = await getDb();
        const kosenImagesCollection = db.collection('kosen_images');

        const pendingImages = await kosenImagesCollection.aggregate([
            { $match: { status: 'pending' } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'uploader'
                }
            },
            { $unwind: '$uploader' },
            {
                $project: {
                    kosenId: 1,
                    fileId: 1,
                    createdAt: 1,
                    status: 1,
                    'uploader.username': 1,
                    'uploader.email': 1,
                }
            },
            { $sort: { createdAt: -1 } }
        ]).toArray();

        return NextResponse.json(pendingImages, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch pending images:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
} 