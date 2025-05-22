import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-theme-primary text-white">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            あなたの未来を、高専で見つけよう。
          </h2>
          <p className="mx-auto max-w-[600px] text-theme-primary-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            今すぐ適性診断を試して、あなたにぴったりの高専を見つけましょう。エンジニアへの道はここから始まります。
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
          <Button
            className="bg-white text-theme-primary hover:bg-gray-100 elegant-button w-full flex items-center gap-2"
            asChild
            size="lg"
          >
            <Link href="/diagnosis">
              今すぐ診断を始める <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <p className="text-xs text-theme-primary-foreground/80">
            診断は無料です。 <Link href="/privacy" className="underline underline-offset-2">プライバシーポリシー</Link>
          </p>
        </div>
      </div>
    </section>
  )
} 