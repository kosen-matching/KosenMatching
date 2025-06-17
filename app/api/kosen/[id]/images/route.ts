import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const kosenId = params.id;

  if (!kosenId) {
    return NextResponse.json({ message: 'Kosen ID is required' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const kosenImagesCollection = db.collection('kosen_images');

    const approvedImages = await kosenImagesCollection.find(
      { kosenId: kosenId, status: 'approved' },
      { projection: { fileId: 1, _id: 1 } } // Only need the fileId
    ).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(approvedImages, { status: 200 });

  } catch (error) {
    console.error(`Failed to fetch images for kosen ${kosenId}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 