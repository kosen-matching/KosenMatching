import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">利用規約</h1>
      <div className="prose max-w-none">
        <p>ここに利用規約が入ります。</p>
        {/* 利用規約の具体的な内容をここに追加 */}
      </div>
    </div>
  );
} 