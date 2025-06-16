import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { getDb } from '@/lib/db';
import { GridFSBucket, ObjectId, GridFSFile } from 'mongodb';

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

    const form = new IncomingForm();

    return new Promise((resolve, reject) => {
      form.parse(req as any, async (err, fields, files) => {
        if (err) {
          console.error('Formidable error:', err);
          return resolve(NextResponse.json({ message: 'ファイルの解析中にエラーが発生しました' }, { status: 500 }));
        }

        const file = files.profileImage?.[0];

        if (!file) {
          return resolve(NextResponse.json({ message: 'ファイルが提供されていません' }, { status: 400 }));
        }

        const filePath = file.filepath;
        const filename = file.originalFilename || file.newFilename;

        const uploadStream = bucket.openUploadStream(filename, {
          metadata: { originalName: filename, mimeType: file.mimetype },
        });

        try {
          const fileBuffer = await fs.readFile(filePath);
          uploadStream.write(fileBuffer);
          uploadStream.end();

          uploadStream.on('finish', async (uploadedFile: GridFSFile) => {
            // アップロード成功後、一時ファイルを削除
            await fs.unlink(filePath);
            return resolve(NextResponse.json({ fileId: uploadedFile._id.toString() }, { status: 200 }));
          });

          uploadStream.on('error', async (uploadError) => {
            console.error('GridFS upload error:', uploadError);
            await fs.unlink(filePath); // エラー時も一時ファイルを削除
            return resolve(NextResponse.json({ message: 'ファイルのアップロードに失敗しました' }, { status: 500 }));
          });
        } catch (readError) {
          console.error('File read error:', readError);
          // 一時ファイルが存在する場合は削除を試みる
          try { await fs.unlink(filePath); } catch (unlinkError) { console.error('Failed to delete temp file:', unlinkError); }
          return resolve(NextResponse.json({ message: 'ファイルを読み込めませんでした' }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ message: 'サーバー内部エラーが発生しました' }, { status: 500 });
  }
}