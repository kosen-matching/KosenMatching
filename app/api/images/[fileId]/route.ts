import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GridFSBucket, ObjectId, GridFSFile, WithId } from 'mongodb';
import { verifyAdmin } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;

  if (!fileId) {
    return NextResponse.json({ message: 'ファイルIDが提供されていません' }, { status: 400 });
  }

  try {
    const db = await getDb();
    
    let file: (GridFSFile & WithId<GridFSFile>) | null = null;
    let bucket: GridFSBucket | null = null;

    let _id: ObjectId;
    try {
      _id = new ObjectId(fileId);
    } catch (error) {
      return NextResponse.json({ message: '無効なファイルIDです' }, { status: 400 });
    }

    // Try finding the file in 'profile_images' bucket first
    const profileBucket = new GridFSBucket(db, { bucketName: 'profile_images' });
    const profileFile = await profileBucket.find({ _id }).limit(1).next();

    if (profileFile) {
        file = profileFile;
        bucket = profileBucket;
    } else {
        // If not found, try finding in 'kosen_images' bucket
        const kosenBucket = new GridFSBucket(db, { bucketName: 'kosen_images' });
        const kosenFile = await kosenBucket.find({ _id }).limit(1).next();
        if (kosenFile) {
            file = kosenFile;
            bucket = kosenBucket;
        }
    }

    if (!file || !bucket) {
      return NextResponse.json({ message: 'ファイルが見つかりません' }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(_id);

    // ストリームをReadableStreamに変換してNextResponseで返す
    const stream = new ReadableStream({
      async start(controller) {
        downloadStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });
        downloadStream.on('end', () => {
          controller.close();
        });
        downloadStream.on('error', (err) => {
          console.error('Download stream error:', err);
          controller.error(err);
        });
      },
    });

    const headers = new Headers();
    headers.set('Content-Type', file.metadata?.mimeType || 'application/octet-stream');
    headers.set('Content-Length', file.length.toString());
    headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // キャッシュ設定

    return new NextResponse(stream, { status: 200, headers });
  } catch (error) {
    console.error('Get image API error:', error);
    return NextResponse.json({ message: 'サーバー内部エラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;

  // 1. Authenticate and authorize admin
  const adminCheckResult = await verifyAdmin();
  if (adminCheckResult instanceof NextResponse) {
    return adminCheckResult;
  }

  // 2. Proceed with deletion
  if (!fileId) {
    return NextResponse.json({ message: 'ファイルIDが提供されていません' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const kosenImagesCollection = db.collection('kosen_images');
    const bucket = new GridFSBucket(db, { bucketName: 'kosen_images' });

    let _id: ObjectId;
    try {
      _id = new ObjectId(fileId);
    } catch (error) {
      return NextResponse.json({ message: '無効なファイルIDです' }, { status: 400 });
    }

    // Check if the image metadata exists in kosen_images
    const imageDoc = await kosenImagesCollection.findOne({ fileId: _id });
    if (!imageDoc) {
      return NextResponse.json({ message: '画像レコードが見つかりません' }, { status: 404 });
    }

    // Delete from GridFS
    await bucket.delete(_id);
    
    // Delete from kosen_images collection
    await kosenImagesCollection.deleteOne({ fileId: _id });

    return NextResponse.json({ message: '画像が正常に削除されました' }, { status: 200 });

  } catch (error) {
    console.error('Delete image API error:', error);
    if (error instanceof Error && error.message.includes('File not found')) {
      // If file is not in GridFS, but doc might exist. Still try to clean up.
       const kosenImagesCollection = (await getDb()).collection('kosen_images');
       await kosenImagesCollection.deleteOne({ fileId: new ObjectId(fileId) });
       return NextResponse.json({ message: '画像が正常に削除されました (GridFSにファイル無し)' }, { status: 200 });
    }
    return NextResponse.json({ message: 'サーバー内部エラーが発生しました' }, { status: 500 });
  }
} 