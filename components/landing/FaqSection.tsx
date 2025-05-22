import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const faqItems = [
  {
    question: "高専とは何ですか？",
    answer: "高等専門学校（高専）は、中学校卒業後の15歳から5年間（商船学科は5年6ヶ月）の一貫教育により、実践的な技術者を養成する高等教育機関です。"
  },
  {
    question: "高専の入試は難しいですか？",
    answer: "高専の入試は、学校や学科によって難易度が異なります。一般的には、普通高校の進学校と同程度の学力が求められることが多いです。過去問対策や塾の利用も有効です。"
  },
  {
    question: "高専卒業後の進路は？",
    answer: "高専卒業生の多くは、企業へ就職し技術者として活躍します。求人倍率が非常に高く、就職に強いのが特徴です。また、大学3年次への編入や専攻科への進学という道もあります。"
  },
  {
    question: "学費はどのくらいかかりますか？",
    answer: "国立高専の場合、入学金・授業料は比較的安価に設定されています。年間授業料は約23万円程度です。ただし、別途教科書代や諸経費が必要となります。"
  }
]

export default function FaqSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block">
            <Badge className="bg-theme-secondary text-white px-4 py-1 text-sm">よくある質問</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              高専に関する<span className="text-theme-secondary">疑問</span>を解消
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              入学前の不安や疑問はここで解決しましょう。
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl w-full mt-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`} className="border rounded-lg bg-white elegant-shadow">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
} 