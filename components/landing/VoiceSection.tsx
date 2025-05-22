import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const voiceItems = [
  {
    avatar: "/placeholder-user.jpg",
    name: "田中 みのる",
    role: "情報工学科 3年",
    title: "「実践的な学びが魅力。将来はAIエンジニアに！」",
    comment: "高専では1年生からプログラミングを学べるので、自分のアイデアを形にする力が身につきました。ロボコンにも挑戦し、チームで目標を達成する喜びを知りました。"
  },
  {
    avatar: "/placeholder-user.jpg",
    name: "佐藤 あかり",
    role: "電気電子工学科 卒業生 (現・大手メーカー勤務)",
    title: "「高専での経験が、今の仕事に直結しています」",
    comment: "実験や研究で培った問題解決能力は、現在の製品開発業務に不可欠です。高専卒という学歴は、技術職としての信頼にも繋がっています。"
  },
  {
    avatar: "/placeholder-user.jpg",
    name: "鈴木 一郎",
    role: "機械工学科 5年",
    title: "「海外インターンシップで視野が広がった」",
    comment: "高専のプログラムで海外の企業で研修を経験しました。異文化に触れ、グローバルな視点を持つことの重要性を学びました。卒業後は海外で活躍したいです。"
  }
]

export default function VoiceSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block">
            <Badge className="bg-theme-primary text-white px-4 py-1 text-sm">在校生・卒業生の声</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              高専で<span className="text-theme-primary">夢</span>を叶えた先輩たち
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              実際に高専で学んだ先輩たちのリアルな声をお届けします。
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          {voiceItems.map((item, index) => (
            <Card key={index} className="elegant-shadow hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                    <CardDescription>{item.role}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.comment}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 