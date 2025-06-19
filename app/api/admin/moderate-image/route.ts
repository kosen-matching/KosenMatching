import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { verifyAdmin } from '@/lib/auth';

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