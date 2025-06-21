import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      <div className="prose max-w-none">
        <p>ここにプライバシーポリシーが入ります。</p>
        {/* プライバシーポリシーの具体的な内容をここに追加 */}
      </div>
    </div>
  );
} 