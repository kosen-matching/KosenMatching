import Link from "next/link"
// import Image from "next/image" // Imageコンポーネントは元々コメントアウトされていたため、一旦含めない

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container flex flex-col gap-6 py-8 md:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-12">
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              {/* <Image src=\"/images/logo.png\" alt=\"高専マッチング\" width={150} height={40} className=\"h-8 w-auto\" /> */}
            </div>
            <p className="text-sm text-muted-foreground">
              あなたに合った高等専門学校を見つけるためのマッチングサイト。
              <br />
              未来のエンジニアを応援します。
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-theme-primary">サイト情報</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-primary">
                    ホーム
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-primary">
                    高専を探す
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-primary">
                    適性診断
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-primary">
                    体験談
                  </Link>
                </li>
                <li>
                  <Link href="/direct-question" className="text-muted-foreground hover:text-theme-primary">
                    直接質問
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-theme-secondary">リソース</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-secondary">
                    よくある質問
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-secondary">
                    高専入試情報
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-secondary">
                    進路相談
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-secondary">
                    オープンキャンパス情報
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-theme-accent">お問い合わせ</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-accent">
                    お問い合わせフォーム
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-theme-accent">
                    運営会社
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-theme-accent">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-theme-accent">
                    利用規約
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} 高専マッチング. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 