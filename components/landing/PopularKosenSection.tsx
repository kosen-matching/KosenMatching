import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
// import Image from "next/image" // Imageコンポーネントは現在コメントアウトされているため、一旦含めない

const popularKosen = [
  {
    name: "東京高専",
    location: "東京都八王子市",
    fields: ["機械工学", "電気工学", "情報工学"],
    features: ["寮完備", "就職率98%"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "仙台高専",
    location: "宮城県仙台市",
    fields: ["建築工学", "マテリアル工学", "電子工学"],
    features: ["国際交流", "大学編入実績多数"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "大阪高専",
    location: "大阪府寝屋川市",
    fields: ["電子情報工学", "環境都市工学", "総合工学"],
    features: ["施設充実", "部活動が盛ん"],
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function PopularKosenSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-theme-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block">
            <Badge className="bg-theme-primary text-white px-4 py-1 text-sm">人気校</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              <span className="text-theme-primary">人気</span>の高専
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              多くの学生から支持されている高等専門学校をご紹介します
            </p>
          </div>
        </div>
        <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {popularKosen.map((school, index) => (
            <Card key={index} className="elegant-card overflow-hidden">
              {/* <Image
                src={school.image || "/placeholder.svg"}
                alt={school.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              /> */}
              <CardHeader>
                <CardTitle className="text-theme-primary">{school.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {school.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">学科</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {school.fields.map((field, i) => (
                        <Badge key={i} variant="outline" className="border-theme-secondary text-theme-secondary">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">特徴</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {school.features.map((feature, i) => (
                        <Badge key={i} className="bg-theme-accent text-theme-dark">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full border-theme-primary text-theme-primary hover:bg-theme-primary/10"
                >
                  詳細を見る
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-theme-primary text-theme-primary hover:bg-theme-primary/10">
            すべての高専を見る
          </Button>
        </div>
      </div>
    </section>
  )
} 