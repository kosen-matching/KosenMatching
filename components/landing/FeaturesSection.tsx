import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, BookOpen, Users, Award } from "lucide-react"

const featureItems = [
  {
    icon: <BookOpen className="h-8 w-8 text-theme-primary" />,
    title: "専門知識の深化",
    description: "早期からの専門教育で、深い知識と高度な技術を習得。"
  },
  {
    icon: <Users className="h-8 w-8 text-theme-primary" />,
    title: "実践的な教育",
    description: "実験・実習を重視し、社会で通用する実践力を養成。"
  },
  {
    icon: <Award className="h-8 w-8 text-theme-primary" />,
    title: "高い就職率と進学実績",
    description: "有名企業への就職や難関大学への編入など、多様な進路。"
  },
  {
    icon: <MapPin className="h-8 w-8 text-theme-primary" />,
    title: "全国に広がるネットワーク",
    description: "51の国立高専、公立・私立高専が連携し、教育の質を向上。"
  }
]

export default function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block">
            <Badge className="bg-theme-secondary text-white px-4 py-1 text-sm">高専の魅力</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              高専で<span className="text-theme-secondary">未来</span>を切り拓く
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              高専は、あなたの可能性を最大限に引き出す教育機関です。
            </p>
          </div>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-4 mt-12">
          {featureItems.map((item, index) => (
            <Card key={index} className="text-center elegant-shadow hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="justify-center items-center">
                <div className="p-3 rounded-full bg-theme-primary/10">
                  {item.icon}
                </div>
                <CardTitle className="mt-2 text-lg font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
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