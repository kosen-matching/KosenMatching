/**
 * API共通の型定義
 */

import { User } from '@/models/User';

// 標準化されたAPIレスポンス形式
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 認証されたユーザー情報（roleを含む）
export interface AuthenticatedUser extends Omit<User, 'password'> {
  role: 'admin' | 'user';
}

// エラーレスポンスの型
export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}

// ユーザー情報レスポンス
export interface UserResponse extends ApiResponse<AuthenticatedUser> {} 