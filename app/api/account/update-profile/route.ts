import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { ObjectId, GridFSBucket } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: '認証されていません' }, { status: 401 });
  }

  let userId: ObjectId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    userId = new ObjectId(decoded.userId);
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.json({ message: '無効なトークンです' }, { status: 401 });
  }

  try {
    const db = await getDb();
    const usersCollection = getUsersCollection(db);
    const bucket = new GridFSBucket(db, { bucketName: 'profile_images' });

    const body = await req.json();
    const { username, email, profileImageUrl } = body;

    // Validate input
    if (!username || !email) {
      return NextResponse.json({ message: 'ユーザー名とメールアドレスは必須です' }, { status: 400 });
    }

    // Find the current user
    const currentUser = await usersCollection.findOne({ _id: userId });
    if (!currentUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // 新しい画像がアップロードされ、古い画像が存在する場合、古い画像をGridFSから削除
    const oldProfileImageUrl = currentUser.profileImageUrl;
    if (oldProfileImageUrl && oldProfileImageUrl !== profileImageUrl) {
      try {
        await bucket.delete(new ObjectId(oldProfileImageUrl));
      } catch (error) {
        // Log error but don't block the profile update
        console.error(`Failed to delete old profile image ${oldProfileImageUrl} from GridFS:`, error);
      }
    }

    // Check if new username or email already exists for other users
    if (username !== currentUser.username) {
      const existingUserByUsername = await usersCollection.findOne({ username });
      if (existingUserByUsername) {
        return NextResponse.json({ message: 'このユーザー名は既に使用されています' }, { status: 409 });
      }
    }

    if (email !== currentUser.email) {
      const existingUserByEmail = await usersCollection.findOne({ email });
      if (existingUserByEmail) {
        return NextResponse.json({ message: 'このメールアドレスは既に使用されています' }, { status: 409 });
      }
    }

    // Update user profile
    const updateData: { username: string; email: string; profileImageUrl?: string } = {
      username,
      email,
    };
    if (profileImageUrl !== undefined) {
      updateData.profileImageUrl = profileImageUrl;
    }

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.modifiedCount === 0 && result.matchedCount > 0) {
      // フロントエンドから常に同じデータが送られてくる場合でも成功とみなす
       const updatedUser = await usersCollection.findOne(
        { _id: userId },
        { projection: { password: 0 } } // Exclude password
      );
       return NextResponse.json({ message: 'プロフィールは最新です', user: updatedUser }, { status: 200 });
    }
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: '更新する情報がありません、またはユーザーが見つかりません' }, { status: 400 });
    }

    const updatedUser = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } } // Exclude password
    );

    return NextResponse.json({ message: 'プロフィールが正常に更新されました', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'サーバー内部エラーが発生しました' }, { status: 500 });
  }
} 