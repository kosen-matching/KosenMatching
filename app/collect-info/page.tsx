import CollectInfoForm from '@/components/collect-info-form';
import Header from "@/components/header";

export default function CollectInfoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-8">
              高専情報収集フォーム
            </h1>
            <CollectInfoForm />
          </div>
        </div>
      </main>
    </div>
  );
} 