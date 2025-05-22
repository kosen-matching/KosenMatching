import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award } from "lucide-react"

const meritItems = [
  {
    icon: <BookOpen className="h-6 w-6 text-theme-primary" />,
    bgColor: "bg-theme-primary/10",
    title: "早期の専門教育",
    description: "中学卒業後すぐに専門分野の学習を始められるため、より深い知識と技術を身につけることができます。"
  },
  {
    icon: <Users className="h-6 w-6 text-theme-secondary" />,
    bgColor: "bg-theme-secondary/10",
    title: "少人数教育",
    description: "クラスの人数が少なく、教員との距離が近いため、きめ細かな指導を受けることができます。"
  },
  {
    icon: <Award className="h-6 w-6 text-theme-accent" />,
    bgColor: "bg-theme-accent/10",
    title: "高い就職率",
    description: "実践的な技術を持った人材として企業から高く評価され、多くの高専生が一流企業に就職しています。"
  }
]

export default function MeritSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block">
            <Badge className="bg-theme-primary text-white px-4 py-1 text-sm">メリット</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              高専進学の<span className="text-theme-primary">メリット</span>
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              高等専門学校ならではの魅力をご紹介します
            </p>
          </div>
        </div>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {meritItems.map((item, index) => (
            <Card key={index} className="elegant-card">
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mb-2`}>
                  {item.icon}
                </div>
                <CardTitle className={`text-${item.icon.props.className.includes('text-theme-primary') ? 'theme-primary' : item.icon.props.className.includes('text-theme-secondary') ? 'theme-secondary' : 'theme-accent'}`}>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 