"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = verifyAuth;
exports.verifyAdmin = verifyAdmin;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET環境変数が設定されていません');
}
/**
 * 認証トークンを検証し、デコードされたトークン情報を返します
 * @returns デコードされたトークン、または認証エラーのレスポンス
 */
async function verifyAuth() {
    const cookieStore = await (0, headers_1.cookies)();
    const token = cookieStore.get('token')?.value;
    if (!token) {
        return server_1.NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return server_1.NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
        return server_1.NextResponse.json({ message: 'Authentication error' }, { status: 500 });
    }
}
/**
 * 管理者権限を検証します
 * @returns デコードされたトークン、または認証・権限エラーのレスポンス
 */
async function verifyAdmin() {
    const authResult = await verifyAuth();
    if (authResult instanceof server_1.NextResponse) {
        return authResult;
    }
    if (!ADMIN_EMAIL) {
        console.error("ADMIN_EMAIL環境変数が設定されていません");
        return server_1.NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }
    if (authResult.email !== ADMIN_EMAIL) {
        return server_1.NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    return authResult;
}
