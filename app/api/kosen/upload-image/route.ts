import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

interface DecodedToken {
  userId: string;
}

// This is necessary for formidable to work in Next.js API routes, 
// though we are using formData directly here.
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  // 1. Authenticate user
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

  try {
    const db = await getDb();
    const bucket = new GridFSBucket(db, { bucketName: 'kosen_images' });

    const data = await req.formData();
    const file = data.get('kosenImage') as File | null;
    const kosenId = data.get('kosenId') as string | null;

    if (!file || !kosenId) {
      return NextResponse.json({ message: 'ファイルと高専IDを提供してください' }, { status: 400 });
    }

    const filename = file.name;
    const mimeType = file.type;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const readable = Readable.from(fileBuffer);
    
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { originalName: filename, mimeType: mimeType },
    });
    
    await new Promise((resolve, reject) => {
      readable.pipe(uploadStream)
        .on('finish', () => resolve(uploadStream.id))
        .on('error', (err) => {
            console.error('GridFS upload stream error:', err);
            reject(err);
        });
    });

    // 2. Create a record in kosen_images collection
    const kosenImagesCollection = db.collection('kosen_images');
    const result = await kosenImagesCollection.insertOne({
      kosenId: kosenId,
      fileId: uploadStream.id,
      userId: new ObjectId(decoded.userId),
      status: 'pending',
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      message: "画像が正常にアップロードされ、承認待ちです。",
      documentId: result.insertedId 
    }, { status: 200 });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ message: 'ファイルのアップロードに失敗しました' }, { status: 500 });
  }
} 