import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { getTopTestimonials } from "@/lib/testimonial"
import { LikeButton } from "./LikeButton"

export default async function VoiceSection() {
  const testimonials = await getTopTestimonials()

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
          {testimonials.length > 0 ? (
            testimonials.map((item) => (
              <Card key={item.id} className="elegant-shadow hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.avatar || "/placeholder-user.jpg"}
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
                  <div className="mt-4 flex justify-end">
                    <LikeButton testimonialId={item.id} likeCount={item.likeCount} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground">
              <p>現在、体験談はまだありません。</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 