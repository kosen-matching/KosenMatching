import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: kosenId } = await params;

  if (!kosenId) {
    return NextResponse.json({ message: 'Kosen ID is required' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const kosenImagesCollection = db.collection('kosen_images');

    const approvedImages = await kosenImagesCollection.aggregate([
      {
        $match: {
          kosenId: kosenId,
          status: 'approved',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'uploaderInfo',
        },
      },
      {
        $unwind: {
          path: '$uploaderInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          fileId: 1,
          uploader: {
            username: '$uploaderInfo.username',
          },
        },
      },
    ]).toArray();

    return NextResponse.json(approvedImages, { status: 200 });

  } catch (error) {
    console.error(`Failed to fetch images for kosen ${kosenId}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 