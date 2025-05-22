import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
// import Image from "next/image" // Imageコンポーネントは現在コメントアウトされているため、一旦含めない

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-subtle-gradient">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                あなたに<span className="text-theme-primary">最適</span>な高専を
                <span className="text-theme-secondary">見つけよう</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                興味・適性・地域から、あなたにぴったりの高等専門学校をマッチング。未来のエンジニアへの第一歩を踏み出しましょう。
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                className="bg-theme-primary hover:bg-theme-primary/90 text-white elegant-button flex items-center gap-2"
                asChild
              >
                <Link href="/diagnosis">
                  診断を始める <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-theme-primary text-theme-primary hover:bg-theme-primary/10"
              >
                高専一覧を見る
              </Button>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            {/* <Image
              src="/placeholder.svg?height=400&width=500"
              width={500}
              height={400}
              alt="高専の学生たち"
              className="rounded-lg object-cover elegant-shadow"
            /> */}
          </div>
        </div>
      </div>
    </section>
  )
} 