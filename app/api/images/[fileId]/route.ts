import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GridFSBucket, ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
  const fileId = params.fileId;

  if (!fileId) {
    return NextResponse.json({ message: 'ファイルIDが提供されていません' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: 'profile_images' });

    let _id: ObjectId;
    try {
      _id = new ObjectId(fileId);
    } catch (error) {
      return NextResponse.json({ message: '無効なファイルIDです' }, { status: 400 });
    }

    const files = await bucket.find({ _id }).toArray();
    const file = files[0];

    if (!file) {
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