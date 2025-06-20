import { NextResponse } from 'next/server';
import { ApiResponse, ApiError } from '@/types/api';

/**
 * 標準化されたAPIレスポンスを生成
 */
export function createApiResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: status >= 200 && status < 300,
    message,
    data,
  }, { status });
}

/**
 * 標準化されたエラーレスポンスを生成
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: string
): NextResponse<ApiResponse> {
  return NextResponse.json({
    success: false,
    message,
    error: code,
    ...(details && { details }),
  }, { status });
}

/**
 * 環境変数の検証とログ出力
 */
export function validateEnvVar(
  name: string,
  value: string | undefined,
  isRequired: boolean = true
): boolean {
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
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * リクエストボディのJSONパースとエラーハンドリング
 */
export async function parseRequestBody<T>(request: Request): Promise<T | NextResponse> {
  try {
    return await request.json();
  } catch (error) {
    console.error('Invalid JSON in request body:', error);
    return createErrorResponse('Invalid JSON format', 400, 'INVALID_JSON');
  }
}

/**
 * データベース操作の共通エラーハンドリング
 */
export function handleDatabaseError(error: unknown, operation: string): NextResponse {
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
export function setSecurityHeaders(response: NextResponse): void {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}

/**
 * ログの標準化
 */
export class ApiLogger {
  static info(operation: string, message: string, meta?: any): void {
    console.log(`ℹ️ [${operation}] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  static warn(operation: string, message: string, meta?: any): void {
    console.warn(`⚠️ [${operation}] ${message}`, meta ? JSON.stringify(meta) : '');
  }

  static error(operation: string, message: string, error?: any): void {
    console.error(`❌ [${operation}] ${message}`, error);
  }

  static success(operation: string, message: string, meta?: any): void {
    console.log(`✅ [${operation}] ${message}`, meta ? JSON.stringify(meta) : '');
  }
} 