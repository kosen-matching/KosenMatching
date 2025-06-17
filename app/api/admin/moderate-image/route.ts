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

export async function PUT(req: NextRequest) {
    const adminCheckResult = await verifyAdmin();
    if (adminCheckResult instanceof NextResponse) {
        return adminCheckResult;
    }

    try {
        const body = await req.json();
        const { imageId, status } = body;

        if (!imageId || !status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ message: 'Image ID and a valid status (approved, rejected) are required' }, { status: 400 });
        }

        const db = await getDb();
        const kosenImagesCollection = db.collection('kosen_images');

        const result = await kosenImagesCollection.updateOne(
            { _id: new ObjectId(imageId) },
            { $set: { status: status } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Image not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Image status updated to ${status}`}, { status: 200 });

    } catch (error) {
        console.error("Failed to moderate image:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
} 