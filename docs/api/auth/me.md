# GET /api/auth/me

現在認証されているユーザーの情報を取得するAPIエンドポイントです。

## 概要

このエンドポイントは、JWTトークンを使用してユーザーを認証し、そのユーザーの詳細情報と権限（ロール）を返します。

## 認証

このエンドポイントは認証が必要です。リクエストにはHTTPOnlyクッキーとして`token`が含まれている必要があります。

## HTTPメソッド

```
GET /api/auth/me
```

## リクエスト

### Headers

```
Cookie: token=<JWT_TOKEN>
```

### Body

このエンドポイントはリクエストボディを必要としません。

## レスポンス

### 成功時 (200 OK)

```json
{
  "success": true,
  "message": "ユーザー情報を正常に取得しました",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "sampleuser",
    "userType": "student",
    "kosenId": "tokyo-kosen",
    "kosenEmail": "user@tokyo-kosen.ac.jp",
    "profileImageUrl": "60a7b9c8d5f5e2001f4d8b9a",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "role": "user"
  }
}
```

### エラーレスポンス

#### 401 Unauthorized - 認証に失敗

```json
{
  "message": "Not authenticated"
}
```

#### 404 Not Found - ユーザーが見つからない

```json
{
  "success": false,
  "message": "ユーザーが見つかりません",
  "error": "USER_NOT_FOUND"
}
```

#### 500 Internal Server Error - サーバーエラー

```json
{
  "success": false,
  "message": "データベースエラーが発生しました",
  "error": "DATABASE_ERROR"
}
```

## データ構造

### AuthenticatedUser

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `_id` | string | ユーザーのID |
| `email` | string | ユーザーのメールアドレス |
| `username` | string | ユーザー名 |
| `userType` | "student" \| "alumnus" \| "examinee" | ユーザーの種別 |
| `kosenId` | string? | 高専のID（該当する場合） |
| `kosenEmail` | string? | 高専のメールアドレス（該当する場合） |
| `profileImageUrl` | string? | プロフィール画像のID |
| `createdAt` | Date | アカウント作成日時 |
| `role` | "admin" \| "user" | ユーザーの権限ロール |

## 権限管理

- **一般ユーザー**: `role: "user"` が設定されます
- **管理者**: 環境変数`ADMIN_EMAIL`で指定されたメールアドレスのユーザーに`role: "admin"`が設定されます

## セキュリティ

このエンドポイントは以下のセキュリティヘッダーを設定します：

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`

## ログ出力

このAPIは以下の情報をログに出力します：

- リクエスト開始時のログ
- 認証失敗時の警告
- 成功時のユーザーID、ロール情報
- エラー発生時の詳細情報

## 使用例

### JavaScript/TypeScript (fetch)

```typescript
async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include', // クッキーを含める
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data; // AuthenticatedUser
  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    throw error;
  }
}
```

### React Hook例

```typescript
import { useEffect, useState } from 'react';

interface AuthenticatedUser {
  _id: string;
  email: string;
  username: string;
  userType: 'student' | 'alumnus' | 'examinee';
  role: 'admin' | 'user';
  // ... other fields
}

export function useCurrentUser() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}
```

## 関連エンドポイント

- `POST /api/auth/login` - ユーザーログイン
- `POST /api/auth/logout` - ユーザーログアウト
- `POST /api/auth/signup` - ユーザー登録
- `PUT /api/account/update-profile` - プロフィール更新 