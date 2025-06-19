import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

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