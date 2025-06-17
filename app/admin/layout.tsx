import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import Header from '@/components/header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

interface DecodedToken {
  userId: string;
  email: string;
}

// Helper component for displaying debug info
const DebugInfo = ({ title, message, details }: { title: string; message: string; details?: any }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="p-8 bg-red-100 border border-red-400 rounded-lg text-red-700 max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="mb-2">{message}</p>
          {details && (
            <pre className="p-4 bg-gray-800 text-white rounded-md text-sm overflow-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          )}
          <p className="mt-4 text-sm text-gray-600">
            これは `app/admin/layout.tsx` に表示される一時的なデバッグメッセージです。本番環境に展開する前に削除してください。
          </p>
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!ADMIN_EMAIL) {
    console.error("ADMIN_EMAIL environment variable is not set.");
    notFound(); // Treat as 404 for security
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    notFound(); // Not authenticated, treat as 404
  }

  let decoded: DecodedToken;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch (error) {
    console.error("Invalid token for admin access:", error);
    notFound(); // Invalid token, treat as 404
  }

  if (decoded.email !== ADMIN_EMAIL) {
    notFound(); // Not an admin, treat as 404
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
} 