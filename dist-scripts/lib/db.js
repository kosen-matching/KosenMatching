"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const mongodb_1 = require("mongodb");
const uri = process.env.MONGODB_URI;
const dbName = 'match'; // データベース名
if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
let client = null;
let clientPromise = null;
if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new mongodb_1.MongoClient(uri);
        global._mongoClientPromise = client.connect();
        console.log("Development: Initializing MongoDB connection...");
    }
    clientPromise = global._mongoClientPromise;
}
else {
    if (!clientPromise) {
        client = new mongodb_1.MongoClient(uri);
        clientPromise = client.connect();
        console.log("Production: Initializing MongoDB connection...");
    }
}
async function getDb() {
    if (!clientPromise) {
        // このパスは通常通らないはずだが、念のため
        throw new Error("MongoDB client promise not initialized!");
    }
    try {
        const connectedClient = await clientPromise;
        // console.log("MongoDB connection retrieved."); // ログが多すぎる場合はコメントアウト
        return connectedClient.db(dbName);
    }
    catch (error) {
        console.error("Failed to get MongoDB connection:", error);
        // エラー発生時に再接続を試みるようにPromiseをリセットするなどの処理も考慮できる
        clientPromise = null; // 次回再初期化を試みる
        throw error;
    }
}
