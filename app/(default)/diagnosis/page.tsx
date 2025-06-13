"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Home, BookOpen, Briefcase, Brain, MapPin, Users, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/header"

// 型定義
interface QuestionBase {
  title: string;
  description?: string; // descriptionはオプショナルに変更
}

interface RadioOption {
  id: string;
  label: string;
}

interface RadioQuestion extends QuestionBase {
  type: "radio";
  options: RadioOption[];
}

interface SliderInfo {
  id: string;
  label: string;
  defaultValue: number;
}

interface SliderQuestion extends QuestionBase {
  type: "slider";
  sliders: SliderInfo[];
}

interface TextareaQuestion extends QuestionBase {
  type: "textarea";
  placeholder: string;
}

// questionsDataの型を修正
interface QuestionsData {
  interests: RadioQuestion;
  subjects: RadioQuestion;
  future: RadioQuestion;
  personality: RadioQuestion;
  environment: SliderQuestion;
}

// 診断質問のデータ
const questionsData: QuestionsData = {
  interests: {
    title: "興味のある分野",
    description: "最も興味を持っている分野を選んでください",
    type: "radio",
    options: [
      { id: "mechanical", label: "機械・ロボット" },
      { id: "electrical", label: "電気・電子" },
      { id: "information", label: "情報・コンピュータ" },
      { id: "chemical", label: "化学・バイオ" },
      { id: "architecture", label: "建築・土木" },
      { id: "marine", label: "商船・海洋" },
    ],
  },
  subjects: {
    title: "得意な科目",
    description: "最も得意な科目を選んでください",
    type: "radio",
    options: [
      { id: "math", label: "数学" },
      { id: "physics", label: "物理" },
      { id: "chemistry", label: "化学" },
      { id: "biology", label: "生物" },
      { id: "english", label: "英語" },
      { id: "japanese", label: "国語" },
    ],
  },
  future: {
    title: "将来やりたいこと",
    description: "将来の希望に最も近いものを選んでください",
    type: "radio",
    options: [
      { id: "engineer", label: "エンジニアとして製品開発に携わりたい" },
      { id: "researcher", label: "研究者として新しい技術を生み出したい" },
      { id: "entrepreneur", label: "起業して自分のアイデアを形にしたい" },
      { id: "global", label: "国際的な舞台で活躍したい" },
      { id: "creative", label: "ものづくりを通じて社会に貢献したい" },
      { id: "undecided", label: "まだ決めていない" },
    ],
  },
  personality: {
    title: "あなたの性格や傾向",
    description: "自分の性格や作業スタイルに最も当てはまるものを選んでください",
    type: "radio",
    options: [
      { id: "logical", label: "論理的に考えるのが好き" },
      { id: "creative", label: "創造的なアイデアを出すのが得意" },
      { id: "practical", label: "実践的な作業が好き" },
      { id: "analytical", label: "物事を分析するのが好き" },
      { id: "team", label: "チームで協力して取り組むのが好き" },
      { id: "independent", label: "自分のペースで取り組むのが好き" },
    ],
  },
  environment: {
    title: "希望する環境",
    description: "学習環境について、以下の項目の重要度を選んでください",
    type: "slider",
    sliders: [
      { id: "facilities", label: "充実した設備・機材", defaultValue: 50 },
      { id: "location", label: "都市部に近い立地", defaultValue: 50 },
      { id: "dormitory", label: "寮生活", defaultValue: 50 },
      { id: "club", label: "部活動の充実", defaultValue: 50 },
      { id: "international", label: "国際交流の機会", defaultValue: 50 },
    ],
  },
}

const freeformQuestionData: TextareaQuestion = {
  title: "自由記述",
  description:
    "あなたの興味や将来の夢、学びたいことなどを自由に記入してください。AIがあなたに合った高専を提案します。",
  type: "textarea",
  placeholder:
    "例：ロボット開発に興味があり、将来は自分でロボットを設計したいです。プログラミングも好きで、特に制御系のプログラムに関心があります。チームでものづくりをするのが好きです。",
}

// 診断結果のサンプルデータ
const sampleResults = [
  {
    id: 1,
    name: "東京高専",
    department: "情報工学科",
    matchRate: 95,
    location: "東京都八王子市",
    features: ["情報系に強い", "就職率98%", "都心からアクセス良好"],
    description:
      "あなたの情報技術への興味と論理的思考力が、東京高専の情報工学科と高いマッチ率を示しています。プログラミングやシステム開発に関する実践的なカリキュラムが充実しており、将来のIT業界でのキャリアに最適です。",
    image: "/placeholder.svg?height=200&width=300",
    color: "theme-primary",
  },
  {
    id: 2,
    name: "仙台高専",
    department: "知能エレクトロニクス工学科",
    matchRate: 87,
    location: "宮城県仙台市",
    features: ["電子工学に強み", "研究設備充実", "寮完備"],
    description:
      "電気・電子分野への興味と分析的な思考スタイルが、仙台高専の知能エレクトロニクス工学科と高いマッチ率を示しています。電子回路設計やAI技術の応用など、最先端の技術を学ぶ環境が整っています。",
    image: "/placeholder.svg?height=200&width=300",
    color: "theme-secondary",
  },
  {
    id: 3,
    name: "大阪高専",
    department: "機械工学科",
    matchRate: 82,
    location: "大阪府寝屋川市",
    features: ["実習設備が充実", "ロボコン実績多数", "企業連携が強い"],
    description:
      "機械・ロボットへの興味と実践的な作業スタイルが、大阪高専の機械工学科と高いマッチ率を示しています。ものづくりを通じた実践的な学びが特徴で、将来のエンジニアとしての基礎力を養うことができます。",
    image: "/placeholder.svg?height=200&width=300",
    color: "theme-accent",
  },
]

export default function DiagnosisPage() {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [freeformText, setFreeformText] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("structured")
  const [currentStep, setCurrentStep] = useState(0)

  const structuredQuestionKeys = Object.keys(questionsData) as (keyof QuestionsData)[];

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value })
    const questionIndex = structuredQuestionKeys.indexOf(questionId as keyof QuestionsData);
    if (questionIndex !== -1 && questionIndex >= currentStep) {
      setCurrentStep(questionIndex + 1);
    }
  }

  const handleSliderChange = (questionId: string, sliderId: string, value: number[]) => {
    setAnswers({
      ...answers,
      [questionId]: { ...(answers[questionId] || {}), [sliderId]: value[0] },
    })
    const questionIndex = structuredQuestionKeys.indexOf(questionId as keyof QuestionsData);
    if (questionIndex !== -1 && questionIndex >= currentStep) {
      setCurrentStep(questionIndex + 1);
    }
  }

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFreeformText(e.target.value)
  }

  const handleSubmit = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const handleRestart = () => {
    setAnswers({})
    setFreeformText("")
    setShowResults(false)
    setActiveTab("structured")
    setCurrentStep(0)
  }

  const isSubmitDisabled = () => {
    if (activeTab === "structured") {
      return !answers.interests || !answers.subjects
    } else {
      return freeformText.length < 20
    }
  }

  const renderStructuredQuestions = () => {
    return (
      <div className="space-y-10">
        {(Object.entries(questionsData) as [keyof QuestionsData, RadioQuestion | SliderQuestion][]).map(([id, question]) => {
          return (
            <Card key={id} className="shadow-lg border-gray-200 rounded-xl overflow-hidden">
              <CardHeader className="bg-gray-50 p-6">
                <div className="flex items-center gap-3">
                  {id === "interests" && <BookOpen className="h-6 w-6 text-theme-primary" />}
                  {id === "subjects" && <Brain className="h-6 w-6 text-theme-secondary" />}
                  {id === "future" && <Briefcase className="h-6 w-6 text-theme-accent" />}
                  {id === "personality" && <Users className="h-6 w-6 text-theme-primary" />}
                  {id === "environment" && <MapPin className="h-6 w-6 text-theme-secondary" />}
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-800">{question.title}</CardTitle>
                    {question.description && <CardDescription className="text-sm text-gray-600 mt-1">{question.description}</CardDescription>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {question.type === "radio" && (
                  <RadioGroup
                    value={answers[id] || ""}
                    onValueChange={(value) => handleRadioChange(id, value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {question.options.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={`${id}-${option.id}`}
                        className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:border-theme-primary/80 ${answers[id] === option.id ? "border-theme-primary ring-2 ring-theme-primary/50 bg-theme-primary/5" : "border-gray-300"}`}
                      >
                        <RadioGroupItem value={option.id} id={`${id}-${option.id}`} className="h-5 w-5 border-gray-400 text-theme-primary focus:ring-theme-primary/50" />
                        <span className="font-medium text-gray-700">{option.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "slider" && (
                  <div className="space-y-6">
                    {question.sliders.map((slider) => (
                      <div key={slider.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={slider.id} className="text-base font-medium text-gray-700">{slider.label}</Label>
                          <span className="text-sm font-semibold text-theme-primary bg-theme-primary/10 px-2 py-1 rounded-md">
                            {answers[id]?.[slider.id] || slider.defaultValue}%
                          </span>
                        </div>
                        <Slider
                          id={slider.id}
                          defaultValue={[slider.defaultValue]}
                          max={100}
                          step={1}
                          onValueChange={(value) => handleSliderChange(id, slider.id, value)}
                          className="[&>span:first-child]:h-2 [&>span:first-child]:bg-gray-200 [&_[role=slider]]:bg-theme-primary [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-md [&_[role=slider]]:focus-visible:ring-2 [&_[role=slider]]:focus-visible:ring-theme-primary/50"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>あまり重視しない</span>
                          <span>非常に重視する</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {id !== "environment" && <Separator className="my-0" />}
            </Card>
          )
        })}
      </div>
    )
  }

  const renderFreeformQuestion = () => {
    const question = freeformQuestionData
    return (
      <Card className="shadow-lg border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-theme-accent" />
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">{question.title}</CardTitle>
              {question.description && <CardDescription className="text-sm text-gray-600 mt-1">{question.description}</CardDescription>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            value={freeformText}
            onChange={handleFreeformChange}
            placeholder={question.placeholder}
            rows={8}
            className="resize-none rounded-lg border-gray-300 focus:border-theme-accent focus:ring-theme-accent/50 text-base p-4"
          />
          <p className="text-xs text-gray-500 mt-2 text-right">{freeformText.length} / 500 文字 (20文字以上で診断可能)</p>
        </CardContent>
      </Card>
    )
  }

  const renderResults = () => {
    let recommendedSchool = sampleResults[0]
    if (answers.interests === "information" || answers.subjects === "math") {
      recommendedSchool = sampleResults.find(school => school.name.includes("東京")) || sampleResults[0]
    } else if (answers.interests === "electrical" || answers.subjects === "physics") {
      recommendedSchool = sampleResults.find(school => school.name.includes("仙台")) || sampleResults[1]
    } else if (answers.interests === "mechanical" || answers.personality === "practical") {
      recommendedSchool = sampleResults.find(school => school.name.includes("大阪")) || sampleResults[2]
    }

    if (freeformText.includes("ロボット") && questionsData.interests) {
      const mechanicalInterest = questionsData.interests.options.find(opt => opt.id === 'mechanical');
      if (mechanicalInterest && answers.interests !== 'mechanical') {
        if (recommendedSchool.name !== "大阪高専") {
          // Consider Osaka Kosen as a secondary recommendation
        }
      }
    }

    const sortedResults = [...sampleResults].sort((a, b) => b.matchRate - a.matchRate);

    return (
      <div className="space-y-10">
        <div className="text-center space-y-3 pt-4">
          <div className="inline-block">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-base font-semibold rounded-full shadow-lg">診断完了！</Badge>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-white">あなたの診断結果</h2>
          <p className="text-lg text-gray-600 dark:text-slate-300 max-w-xl mx-auto">
            {activeTab === "structured"
              ? "あなたの回答に基づいて、AIが以下の高専・学科を推薦します。"
              : "あなたの記述をAIが分析し、以下の高専・学科を推薦します。"}
          </p>
        </div>

        <div className="space-y-8">
          {sortedResults.map((result, index) => (
            <Card 
              key={result.id} 
              className={`shadow-xl border rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm ${index === 0 ? `border-theme-primary ring-2 ring-theme-primary/30 dark:border-sky-500 dark:ring-sky-500/30` : `border-gray-200 dark:border-slate-700`}`}>
              {index === 0 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-theme-primary to-theme-secondary text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10">
                  <Sparkles className="inline-block h-4 w-4 mr-1.5 -mt-0.5" /> 最適なマッチ
                </div>
              )}
              <CardContent className="p-6 md:p-8 relative">
                {index === 0 && <div className="h-4"></div>}
                <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
                  <div className="relative w-full h-48 md:h-full rounded-lg overflow-hidden shadow-md aspect-square md:aspect-auto">
                    <Image
                      src={result.image || "/placeholder.svg"}
                      alt={result.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div>
                        <CardTitle className={`text-2xl font-bold tracking-tight ${index === 0 ? (result.color === 'theme-primary' ? 'text-theme-primary dark:text-sky-400' : result.color === 'theme-secondary' ? 'text-theme-secondary dark:text-amber-400' : 'text-theme-accent dark:text-pink-400') : 'text-gray-800 dark:text-white'}`}>{result.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 dark:text-slate-400">
                          <MapPin className="h-4 w-4" /> {result.location}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-center text-center pt-2 sm:pt-0">
                        <div className="relative w-20 h-20">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              className={`stroke-current ${index === 0 ? (result.color === 'theme-primary' ? 'text-theme-primary/20 dark:text-sky-400/20' : result.color === 'theme-secondary' ? 'text-theme-secondary/20 dark:text-amber-400/20' : 'text-theme-accent/20 dark:text-pink-400/20') : 'text-gray-300/50 dark:text-slate-600'}`}                              
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              strokeWidth="3"
                            />
                            <path
                              className={`stroke-current ${index === 0 ? (result.color === 'theme-primary' ? 'text-theme-primary dark:text-sky-400' : result.color === 'theme-secondary' ? 'text-theme-secondary dark:text-amber-400' : 'text-theme-accent dark:text-pink-400') : 'text-gray-500 dark:text-slate-400'}`}
                              strokeDasharray={`${result.matchRate}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xl font-bold ${index === 0 ? (result.color === 'theme-primary' ? 'text-theme-primary dark:text-sky-400' : result.color === 'theme-secondary' ? 'text-theme-secondary dark:text-amber-400' : 'text-theme-accent dark:text-pink-400') : 'text-gray-700 dark:text-slate-200'}`}>{result.matchRate}<span className="text-xs">%</span></span>
                          </div>
                        </div>
                        <p className="text-xs font-medium mt-1 text-gray-500 dark:text-slate-400">マッチ度</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className={`font-semibold text-lg ${index === 0 ? (result.color === 'theme-primary' ? 'text-theme-primary dark:text-sky-400' : result.color === 'theme-secondary' ? 'text-theme-secondary dark:text-amber-400' : 'text-theme-accent dark:text-pink-400') : 'text-gray-700 dark:text-slate-200'}`}>{result.department}</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">{result.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">この高専の特徴</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className={`border-gray-300 text-gray-600 dark:border-slate-600 dark:text-slate-300 ${index === 0 ? (result.color === 'theme-primary' ? '!border-theme-primary/70 !text-theme-primary dark:!border-sky-500/70 dark:!text-sky-400' : result.color === 'theme-secondary' ? '!border-theme-secondary/70 !text-theme-secondary dark:!border-amber-500/70 dark:!text-amber-400' : '!border-theme-accent/70 !text-theme-accent dark:!border-pink-500/70 dark:!text-pink-400') : '' }`}>
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50/50 dark:bg-slate-800/30 border-t dark:border-slate-700/50 rounded-b-2xl">
                <Button
                  size="lg"
                  className={`w-full font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-2 group ${index === 0 ? 'bg-gradient-to-r from-theme-primary to-theme-secondary hover:from-theme-primary/90 hover:to-theme-secondary/90 text-white' : 'bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600'}`}
                  variant={index === 0 ? "default" : "outline"}
                >
                  詳細を見る <ArrowRight className={`ml-2 h-5 w-5 ${index === 0 ? 'group-hover:translate-x-1' : 'group-hover:translate-x-0.5'} transition-transform duration-200`} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-10">
          <Card className="bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-700/50 p-6 rounded-xl shadow-md">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 text-sky-500 dark:text-sky-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg text-sky-700 dark:text-sky-300 mb-1.5">診断結果の活用について</h3>
                <p className="text-sm text-sky-600 dark:text-sky-300/80 leading-relaxed">
                  この診断結果は、あなたの回答とAIの分析に基づいた参考情報です。最適な進路選択のためには、オープンキャンパスへの参加や学校の先生・先輩からの情報収集も非常に重要です。様々な角度から情報を集め、あなたにとって最良の選択をしてください。
                </p>
              </div>
            </div>
          </Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              onClick={handleRestart}
              variant="outline"
              size="lg"
              className="font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 group"
            >
              <ArrowRight className="mr-2 h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" /> もう一度診断する
            </Button>
            <Button asChild size="lg" className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-700/90 hover:to-gray-800/90 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-2 group">
              <Link href="/">トップページに戻る <Home className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" /></Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const progressValue = activeTab === "structured" ? (currentStep / structuredQuestionKeys.length) * 100 : (freeformText.length > 0 ? 100 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-sky-100 dark:from-slate-900 dark:to-sky-900">
      <Header />

      <main className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {!showResults && !isAnalyzing ? (
            <Card className="shadow-xl border-gray-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md dark:bg-slate-800/80 dark:border-slate-700">
              <CardHeader className="border-b border-gray-200 dark:border-slate-700 p-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Badge className="bg-theme-primary text-white px-4 py-1.5 text-sm font-semibold rounded-full shadow-md">無料診断</Badge>
                  <CardTitle className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">高専適性診断</CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-slate-300 max-w-md">
                    あなたの興味や適性に合った高専を見つけるための診断です。以下の質問に答えてください。
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setCurrentStep(0); }} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-slate-700 rounded-lg p-1 shadow-inner">
                    <TabsTrigger
                      value="structured"
                      className="py-2.5 text-sm font-medium data-[state=active]:bg-theme-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all duration-200 ease-in-out dark:text-slate-300 dark:data-[state=active]:text-white"
                    >
                      選択式診断
                    </TabsTrigger>
                    <TabsTrigger
                      value="freeform"
                      className="py-2.5 text-sm font-medium data-[state=active]:bg-theme-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all duration-200 ease-in-out dark:text-slate-300 dark:data-[state=active]:text-white"
                    >
                      AI自由記述診断
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="mb-6 px-1">
                    <Progress value={progressValue} className="w-full h-2.5 bg-gray-200 dark:bg-slate-700 [&>div]:bg-theme-primary transition-all duration-300 ease-in-out rounded-full" />
                    {activeTab === "structured" && (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1.5 text-right">ステップ {currentStep > structuredQuestionKeys.length ? structuredQuestionKeys.length : currentStep} / {structuredQuestionKeys.length}</p>
                    )}
                  </div>

                  <TabsContent value="structured" className="space-y-4">
                    {renderStructuredQuestions()}
                  </TabsContent>
                  <TabsContent value="freeform" className="space-y-4">
                    {renderFreeformQuestion()}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end p-6 bg-gray-50 dark:bg-slate-800/50 border-t dark:border-slate-700 rounded-b-2xl">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled()}
                  size="lg"
                  className="bg-gradient-to-r from-theme-primary to-theme-secondary hover:from-theme-primary/90 hover:to-theme-secondary/90 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
                >
                  診断結果を見る <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardFooter>
            </Card>
          ) : isAnalyzing ? (
            <Card className="text-center p-8 md:p-12 shadow-xl border-gray-200 rounded-2xl bg-white/80 backdrop-blur-md dark:bg-slate-800/80 dark:border-slate-700">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-theme-primary/20 rounded-full"></div>
                  <div className="absolute inset-2 border-4 border-t-theme-primary border-r-theme-primary/50 border-b-theme-primary/30 border-l-transparent rounded-full animate-spin"></div>
                  <Brain className="absolute inset-0 m-auto h-10 w-10 text-theme-primary opacity-80" />
                </div>
                <CardTitle className="text-2xl font-semibold text-theme-primary dark:text-sky-400">AIが診断中...</CardTitle>
                <CardDescription className="text-base text-gray-600 dark:text-slate-300 max-w-sm">
                  あなたの回答を丁寧に分析し、あなたにピッタリの高専を見つけるお手伝いをしています。もう少々お待ちください。
                </CardDescription>
                <Progress value={80} className="w-full max-w-xs h-2 mt-2 bg-gray-200 dark:bg-slate-700 [&>div]:bg-theme-primary rounded-full animate-pulse" />
              </div>
            </Card>
          ) : (
            renderResults()
          )}
        </div>
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Image src="/images/logo.png" alt="高専マッチング" width={120} height={30} className="h-7 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} 高専マッチング. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
