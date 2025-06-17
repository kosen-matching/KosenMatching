import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GridFSBucket, GridFSFile } from 'mongodb';
import { Readable } from 'stream';

// formidableがNext.jsのAPIルートで動作するために必要
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: 'profile_images' });

    const data = await req.formData();
    const file = data.get('profileImage') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'ファイルが提供されていません' }, { status: 400 });
    }

    const filename = file.name;
    const mimeType = file.type;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const readable = Readable.from(fileBuffer);
    
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { originalName: filename, mimeType: mimeType },
    });
    
    // ストリームをパイプして、Promiseで完了を待つ
    await new Promise((resolve, reject) => {
      readable.pipe(uploadStream)
        .on('finish', () => resolve(uploadStream.id))
        .on('error', (err) => {
            console.error('GridFS upload stream error:', err);
            reject(err);
        });
    });

    return NextResponse.json({ fileId: uploadStream.id.toString() }, { status: 200 });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ message: 'ファイルのアップロードに失敗しました' }, { status: 500 });
  }
}