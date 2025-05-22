import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-2">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="高専マッチング ロゴ" 
              width={224}
              height={56}
              className="h-14 w-auto"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-theme-primary">
            ホーム
          </Link>
          <Link href="/find-kosen" className="text-sm font-medium hover:text-theme-primary">
            高専を探す
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-theme-primary">
            適性診断
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-theme-primary">
            体験談
          </Link>
          <Link href="/collect-info" className="text-sm font-medium hover:text-theme-primary">
            情報収集
          </Link>
          <Link href="/direct-question" className="text-sm font-medium hover:text-theme-primary">
            直接質問
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-theme-primary">
            よくある質問
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-theme-primary text-theme-primary hover:bg-theme-primary/10"
          >
            ログイン
          </Button>
          <Button size="sm" className="bg-theme-primary hover:bg-theme-primary/90 text-white">
            新規登録
          </Button>
        </div>
      </div>
    </header>
  );
} 