"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiLogger = void 0;
exports.createApiResponse = createApiResponse;
exports.createErrorResponse = createErrorResponse;
exports.validateEnvVar = validateEnvVar;
exports.isValidObjectId = isValidObjectId;
exports.parseRequestBody = parseRequestBody;
exports.handleDatabaseError = handleDatabaseError;
exports.setSecurityHeaders = setSecurityHeaders;
const server_1 = require("next/server");
/**
 * 標準化されたAPIレスポンスを生成
 */
function createApiResponse(data, message, status = 200) {
    return server_1.NextResponse.json({
        success: status >= 200 && status < 300,
        message,
        data,
    }, { status });
}
/**
 * 標準化されたエラーレスポンスを生成
 */
function createErrorResponse(message, status = 500, code, details) {
    return server_1.NextResponse.json({
        success: false,
        message,
        error: code,
        ...(details && { details }),
    }, { status });
}
/**
 * 環境変数の検証とログ出力
 */
function validateEnvVar(name, value, isRequired = true) {
    if (!value && isRequired) {
        console.error(`❌ 必須の環境変数 ${name} が設定されていません`);
        return false;
    }
    if (!value && !isRequired) {
        console.warn(`⚠️ オプショナルな環境変数 ${name} が設定されていません`);
    }
    return true;
}
/**
 * ObjectIDの妥当性を検証
 */
function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}
/**
 * リクエストボディのJSONパースとエラーハンドリング
 */
async function parseRequestBody(request) {
    try {
        return await request.json();
    }
    catch (error) {
        console.error('Invalid JSON in request body:', error);
        return createErrorResponse('Invalid JSON format', 400, 'INVALID_JSON');
    }
}
/**
 * データベース操作の共通エラーハンドリング
 */
function handleDatabaseError(error, operation) {
    console.error(`Database error during ${operation}:`, error);
    if (error instanceof Error) {
        // MongoDB特有のエラーをチェック
        if (error.message.includes('duplicate key')) {
            return createErrorResponse('データが既に存在します', 409, 'DUPLICATE_KEY');
        }
        if (error.message.includes('invalid ObjectId')) {
            return createErrorResponse('無効なIDが指定されました', 400, 'INVALID_ID');
        }
    }
    return createErrorResponse('データベースエラーが発生しました', 500, 'DATABASE_ERROR');
}
/**
 * セキュリティヘッダーを設定
 */
function setSecurityHeaders(response) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}
/**
 * ログの標準化
 */
class ApiLogger {
    static info(operation, message, meta) {
        console.log(`ℹ️ [${operation}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
    static warn(operation, message, meta) {
        console.warn(`⚠️ [${operation}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
    static error(operation, message, error) {
        console.error(`❌ [${operation}] ${message}`, error);
    }
    static success(operation, message, meta) {
        console.log(`✅ [${operation}] ${message}`, meta ? JSON.stringify(meta) : '');
    }
}
exports.ApiLogger = ApiLogger;
