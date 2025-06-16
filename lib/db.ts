import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'match'; // データベース名

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Next.js の開発モードでは HMR により複数回実行される可能性があるため、
// グローバル変数を使って接続をキャッシュする
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
    console.log("Development: Initializing MongoDB connection...");
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
    console.log("Production: Initializing MongoDB connection...");
  }
}

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
     // このパスは通常通らないはずだが、念のため
     throw new Error("MongoDB client promise not initialized!");
  }
  try {
    const connectedClient = await clientPromise;
    // console.log("MongoDB connection retrieved."); // ログが多すぎる場合はコメントアウト
    return connectedClient.db(dbName);
  } catch (error) {
    console.error("Failed to get MongoDB connection:", error);
    // エラー発生時に再接続を試みるようにPromiseをリセットするなどの処理も考慮できる
    clientPromise = null; // 次回再初期化を試みる
    throw error;
  }
}