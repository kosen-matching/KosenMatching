import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUsersCollection } from '@/models/User';
import { ObjectId, GridFSBucket } from 'mongodb';
import { verifyAuth } from '@/lib/auth';

export async function PUT(req: Request) {
  const authResult = await verifyAuth();
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const userId = new ObjectId(authResult.userId);

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