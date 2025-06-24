"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Home, BookOpen, Briefcase, Brain, MapPin, Users, Sparkles, GraduationCap, Heart, Target, School, Trophy, PenLine, Calculator, FlaskConical, Languages, BookText, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

// 型定義
interface QuestionBase {
  title: string;
  description?: string;
}

interface RadioOption {
  id: string;
  label: string;
}

interface RadioQuestion extends QuestionBase {
  type: "radio";
  options: RadioOption[];
}

interface CheckboxOption {
  id: string;
  label: string;
}

interface CheckboxQuestion extends QuestionBase {
  type: "checkbox";
  options: CheckboxOption[];
}

interface SubjectEvaluation {
  id: string;
  label: string;
}

interface SubjectsQuestion extends QuestionBase {
  type: "subjects";
  subjects: SubjectEvaluation[];
}

interface EnvironmentOption {
  id: string;
  label: string;
}

interface EnvironmentQuestion extends QuestionBase {
  type: "environment";
  items: EnvironmentOption[];
}

interface NumberInputQuestion extends QuestionBase {
  type: "number";
  placeholder: string;
}

interface TextareaQuestion extends QuestionBase {
  type: "textarea";
  placeholder: string;
}

// questionsDataの型を修正
interface QuestionsData {
  grade: RadioQuestion;
  interests: RadioQuestion;
  subjects: SubjectsQuestion;
  deviation: NumberInputQuestion;
  future: RadioQuestion;
  personality: RadioQuestion;
  environment: EnvironmentQuestion;
  lifestyle: RadioQuestion;
  location: RadioQuestion;
  clubActivities: CheckboxQuestion;
}

// 診断質問のデータ
const questionsData: QuestionsData = {
  grade: {
    title: "あなたの学年",
    description: "現在の学年を選んでください",
    type: "radio",
    options: [
      { id: "ms1", label: "中学1年生" },
      { id: "ms2", label: "中学2年生" },
      { id: "ms3", label: "中学3年生" },
    ],
  },
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
    title: "各教科の得意・不得意",
    description: "それぞれの教科について、あなたの状況を選んでください",
    type: "subjects",
    subjects: [
      { id: "math", label: "数学" },
      { id: "science", label: "理科" },
      { id: "english", label: "英語" },
      { id: "japanese", label: "国語" },
      { id: "socialStudies", label: "社会" },
    ],
  },
  deviation: {
    title: "現在の学力",
    description: "模試などで計測した、現在のあなたの偏差値を半角数字で入力してください。",
    type: "number",
    placeholder: "例: 65",
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
    title: "学習環境の希望",
    description: "以下の項目について、どの程度重視するか選んでください",
    type: "environment",
    items: [
      { id: "facilities", label: "充実した設備・機材" },
      { id: "dormitory", label: "寮生活の充実" },
      { id: "club", label: "部活動の充実" },
      { id: "international", label: "国際交流の機会" },
      { id: "practicalTraining", label: "企業実習・インターンシップ" },
      { id: "research", label: "研究活動の充実" },
    ],
  },
  lifestyle: {
    title: "希望する生活スタイル",
    description: "高専生活をどのように過ごしたいか選んでください",
    type: "radio",
    options: [
      { id: "balance", label: "勉強と部活動・趣味をバランスよく楽しみたい" },
      { id: "studyFocus", label: "勉強・研究に集中したい" },
      { id: "clubFocus", label: "部活動やサークル活動を頑張りたい" },
      { id: "socialLife", label: "友人との交流を大切にしたい" },
      { id: "independent", label: "自立した生活を送りたい" },
    ],
  },
  location: {
    title: "希望する場所",
    description: "どのような環境で学びたいか選んでください",
    type: "radio", 
    options: [
      { id: "bigCity", label: "大都市（東京・大阪・名古屋など）" },
      { id: "mediumCity", label: "地方都市（県庁所在地など）" },
      { id: "suburban", label: "郊外・自然豊かな環境" },
      { id: "anywhere", label: "特にこだわらない" },
      { id: "nearHome", label: "実家から通える範囲" },
    ],
  },
  clubActivities: {
    title: "興味のある部活動・課外活動",
    description: "参加したい活動を選んでください（複数選択可）",
    type: "checkbox",
    options: [
      { id: "robocon", label: "ロボコン・技術系コンテスト" },
      { id: "sports", label: "体育系部活動" },
      { id: "culture", label: "文化系部活動" },
      { id: "volunteer", label: "ボランティア活動" },
      { id: "none", label: "特に参加予定はない" },
    ],
  },
};

const freeformQuestionData: TextareaQuestion = {
  title: "自由記述",
  description:
    "あなたの興味や将来の夢、学びたいこと、現在の学力（偏差値）などを自由に記入してください。AIがあなたに合った高専を提案します。",
  type: "textarea",
  placeholder:
    "例：ロボット開発に興味があり、将来は自分でロボットを設計したいです。プログラミングも好きで、特に制御系のプログラムに関心があります。チームでものづくりをするのが好きです。模試の偏差値は65です。",
}

const subjectIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-6 w-6 text-orange-500" />,
  science: <FlaskConical className="h-6 w-6 text-green-500" />,
  english: <Languages className="h-6 w-6 text-blue-500" />,
  japanese: <BookText className="h-6 w-6 text-red-500" />,
  socialStudies: <Globe className="h-6 w-6 text-purple-500" />,
};

// 診断結果の型定義 (APIのレスポンスに合わせる)
interface DiagnosisResult {
  id: string;
  name: string;
  location: string;
  departments?: string[];
  description?: string;
  imageUrl?: string;
  matchRate: number;
  matchReason: string;
}

export default function DiagnosisPage() {
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [freeformText, setFreeformText] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<DiagnosisResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("structured")
  const [currentStep, setCurrentStep] = useState(0)
  const [analyzingStep, setAnalyzingStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    if (isAnalyzing) {
      // アイコン切り替え用タイマー
      interval = setInterval(() => {
        setAnalyzingStep(prev => prev + 1)
      }, 500)

      // プログレスバー用タイマー
      setProgress(10)
      progressInterval = setInterval(() => {
        setProgress(p => {
          if (p >= 90) {
            return p
          }
          return p + Math.random() * 10
        })
      }, 300)

    } else {
      setAnalyzingStep(0)
      setProgress(0)
    }

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [isAnalyzing])

  const structuredQuestionKeys = Object.keys(questionsData) as (keyof QuestionsData)[];

  const handleRadioChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value })
    const questionIndex = structuredQuestionKeys.indexOf(questionId as keyof QuestionsData);
    if (questionIndex !== -1 && questionIndex >= currentStep) {
      setCurrentStep(questionIndex + 1);
    }
  }

  const handleSubjectChange = (questionId: string, subjectId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: { ...(answers[questionId] || {}), [subjectId]: value },
    })
    const questionIndex = structuredQuestionKeys.indexOf(questionId as keyof QuestionsData);
    if (questionIndex !== -1 && questionIndex >= currentStep) {
      setCurrentStep(questionIndex + 1);
    }
  }

  const handleCheckboxChange = (questionId: string, optionId: string, checked: boolean) => {
    const currentAnswersForQuestion = (answers[questionId] as string[] | undefined) || [];
    let newAnswersForQuestion: string[];

    if (checked) {
      newAnswersForQuestion = [...currentAnswersForQuestion, optionId];
    } else {
      newAnswersForQuestion = currentAnswersForQuestion.filter(id => id !== optionId);
    }
    
    setAnswers({ ...answers, [questionId]: newAnswersForQuestion });
  };

  const handleEnvironmentChange = (questionId: string, itemId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: { ...(answers[questionId] || {}), [itemId]: value },
    })
    const questionIndex = structuredQuestionKeys.indexOf(questionId as keyof QuestionsData);
    if (questionIndex !== -1 && questionIndex >= currentStep) {
      setCurrentStep(questionIndex + 1);
    }
  }

  const handleNumberChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  }

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFreeformText(e.target.value)
  }

  const handleSubmit = async () => {
    setIsAnalyzing(true)
    setError(null)

    const payload = {
      answers,
      freeformText,
      grade: answers.grade,
    }

    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('診断に失敗しました。しばらくしてからもう一度お試しください。')
      }

      const data = await response.json()
      setResults(data)
      setShowResults(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setFreeformText("")
    setShowResults(false)
    setResults([])
    setError(null)
    setActiveTab("structured")
    setCurrentStep(0)
  }

  const isSubmitDisabled = () => {
    if (activeTab === "structured") {
      return !answers.grade || !answers.interests || !answers.future
    } else {
      return freeformText.length < 20
    }
  }

  const renderStructuredQuestions = () => {
    return (
      <div className="space-y-10">
        {(Object.entries(questionsData) as [keyof QuestionsData, RadioQuestion | SubjectsQuestion | EnvironmentQuestion | CheckboxQuestion | NumberInputQuestion][]).map(([id, question], index) => {
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <Card className="shadow-lg border-gray-200 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                  <div className="flex items-center gap-3">
                    {id === "grade" && <GraduationCap className="h-6 w-6 text-pink-600" />}
                    {id === "interests" && <Heart className="h-6 w-6 text-blue-600" />}
                    {id === "subjects" && <BookOpen className="h-6 w-6 text-purple-600" />}
                    {id === "deviation" && <PenLine className="h-6 w-6 text-cyan-600" />}
                    {id === "future" && <Target className="h-6 w-6 text-green-600" />}
                    {id === "personality" && <Brain className="h-6 w-6 text-red-600" />}
                    {id === "environment" && <School className="h-6 w-6 text-indigo-600" />}
                    {id === "lifestyle" && <Users className="h-6 w-6 text-orange-600" />}
                    {id === "location" && <MapPin className="h-6 w-6 text-teal-600" />}
                    {id === "clubActivities" && <Trophy className="h-6 w-6 text-yellow-600" />}
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
                          className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:border-blue-500/80 ${answers[id] === option.id ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50" : "border-gray-300"}`}
                        >
                          <RadioGroupItem value={option.id} id={`${id}-${option.id}`} className="h-5 w-5 border-gray-400 text-blue-600 focus:ring-blue-500/50" />
                          <span className="font-medium text-gray-700">{option.label}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "subjects" && (
                    <div className="space-y-6">
                      {question.subjects.map((subject) => (
                        <div key={subject.id} className="space-y-3">
                          <div className="flex justify-between items-center mb-2">
                             <div className="flex items-center gap-3">
                                {subjectIcons[subject.id]}
                                <Label className="text-base font-semibold text-gray-800 dark:text-slate-200">{subject.label}</Label>
                            </div>
                          </div>
                          <RadioGroup
                            value={answers[id]?.[subject.id] || ""}
                            onValueChange={(value) => handleSubjectChange(id, subject.id, value)}
                            className="grid grid-cols-3 gap-3"
                          >
                            <Label
                              htmlFor={`${id}-${subject.id}-good`}
                              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                                answers[id]?.[subject.id] === "good" 
                                  ? "border-green-500 bg-green-50 text-green-700" 
                                  : "border-gray-300 hover:border-green-400"
                              }`}
                            >
                              <RadioGroupItem value="good" id={`${id}-${subject.id}-good`} className="sr-only" />
                              <span className="text-sm font-medium">得意</span>
                            </Label>
                            <Label
                              htmlFor={`${id}-${subject.id}-normal`}
                              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                                answers[id]?.[subject.id] === "normal" 
                                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                                  : "border-gray-300 hover:border-blue-400"
                              }`}
                            >
                              <RadioGroupItem value="normal" id={`${id}-${subject.id}-normal`} className="sr-only" />
                              <span className="text-sm font-medium">普通</span>
                            </Label>
                            <Label
                              htmlFor={`${id}-${subject.id}-weak`}
                              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                                answers[id]?.[subject.id] === "weak" 
                                  ? "border-orange-500 bg-orange-50 text-orange-700" 
                                  : "border-gray-300 hover:border-orange-400"
                              }`}
                            >
                              <RadioGroupItem value="weak" id={`${id}-${subject.id}-weak`} className="sr-only" />
                              <span className="text-sm font-medium">苦手</span>
                            </Label>
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "checkbox" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option) => (
                        <Label
                          key={option.id}
                          htmlFor={`${id}-${option.id}`}
                          className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:border-blue-500/80 ${
                            (answers[id] || []).includes(option.id) ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50" : "border-gray-300"
                          }`}
                        >
                          <Checkbox
                            id={`${id}-${option.id}`}
                            checked={(answers[id] || []).includes(option.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(id, option.id, !!checked)}
                            className="h-5 w-5 border-gray-400 text-blue-600 focus:ring-blue-500/50"
                          />
                          <span className="font-medium text-gray-700">{option.label}</span>
                        </Label>
                      ))}
                    </div>
                  )}

                  {question.type === "environment" && (
                    <div className="space-y-6">
                      {question.items.map((item) => (
                        <div key={item.id} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label className="text-base font-medium text-gray-700">{item.label}</Label>
                          </div>
                          <RadioGroup
                            value={answers[id]?.[item.id] || ""}
                            onValueChange={(value) => handleEnvironmentChange(id, item.id, value)}
                            className="grid grid-cols-4 gap-3"
                          >
                            <Label
                              htmlFor={`${id}-${item.id}-very`}
                              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                                answers[id]?.[item.id] === "very" 
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                                  : "border-gray-300 hover:border-indigo-400"
                              }`}
                            >
                              <RadioGroupItem value="very" id={`${id}-${item.id}-very`} className="sr-only" />
                              <span className="text-sm font-medium">とても重視</span>
                            </Label>
                            <Label
                              htmlFor={`${id}-${item.id}-somewhat`}
                              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                                answers[id]?.[item.id] === "somewhat" 
                                  ? "border-blue-500 bg-blue-50 text-blue-700" 
                                  : "border-gray-300 hover:border-blue-400"
                              }`}
                            >
                              <RadioGroupItem value="somewhat" id={`${id}-${item.id}-somewhat`} className="sr-only" />
                              <span className="text-sm font-medium">やや重視</span>
                            </Label>
                            <Label
                              htmlFor={`${id}-${item.id}-neutral`}
                              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                                answers[id]?.[item.id] === "neutral" 
                                  ? "border-gray-500 bg-gray-100 text-gray-700" 
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <RadioGroupItem value="neutral" id={`${id}-${item.id}-neutral`} className="sr-only" />
                              <span className="text-sm font-medium">どちらでも</span>
                            </Label>
                            <Label
                              htmlFor={`${id}-${item.id}-not`}
                              className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                                answers[id]?.[item.id] === "not" 
                                  ? "border-gray-400 bg-gray-50 text-gray-600" 
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <RadioGroupItem value="not" id={`${id}-${item.id}-not`} className="sr-only" />
                              <span className="text-sm font-medium">重視しない</span>
                            </Label>
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "number" && (
                     <Input
                        type="number"
                        placeholder={question.placeholder}
                        value={answers[id] || ""}
                        onChange={(e) => handleNumberChange(id, e.target.value)}
                        className="max-w-xs text-base p-4"
                      />
                  )}
                </CardContent>
                {id !== structuredQuestionKeys[structuredQuestionKeys.length - 1] && <Separator className="my-0" />}
              </Card>
            </motion.div>
          )
        })}
      </div>
    )
  }

  const renderFreeformQuestion = () => {
    const question = freeformQuestionData
    return (
      <Card className="shadow-lg border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 p-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
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
            className="resize-none rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500/50 text-base p-4"
          />
          <p className="text-xs text-gray-500 mt-2 text-right">{freeformText.length} / 500 文字 (20文字以上で診断可能)</p>
        </CardContent>
      </Card>
    )
  }

  const renderResults = () => {
    if (error) {
      return (
        <div className="text-center space-y-4 p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700">エラーが発生しました</h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={handleRestart} className="bg-red-600 hover:bg-red-700 text-white">もう一度試す</Button>
        </div>
      )
    }

    if (results.length === 0) {
      return (
        <div className="text-center space-y-4 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="text-2xl font-bold text-yellow-800">診断結果が見つかりませんでした</h2>
          <p className="text-yellow-700">条件に合う高専が見つからなかったようです。回答を変えてもう一度お試しください。</p>
          <Button onClick={handleRestart} className="bg-yellow-600 hover:bg-yellow-700 text-white">もう一度診断する</Button>
        </div>
      )
    }

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
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            >
              <Card 
                className={`shadow-xl border rounded-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm ${
                  index === 0 
                    ? `border-blue-500 ring-2 ring-blue-500/30 dark:border-sky-500 dark:ring-sky-500/30` 
                    : `border-gray-200 dark:border-slate-700`
                }`}>
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg z-10">
                    <Sparkles className="inline-block h-4 w-4 mr-1.5 -mt-0.5" /> 最適なマッチ
                  </div>
                )}
                <CardContent className="p-6 md:p-8 relative">
                  {index === 0 && <div className="h-4"></div>}
                  <div className="grid md:grid-cols-[200px_1fr] gap-6 items-start">
                    <div className="relative w-full aspect-video md:aspect-auto md:h-full rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={result.imageUrl || "/placeholder.svg"}
                        alt={result.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <CardTitle className={`text-2xl font-bold tracking-tight ${
                            index === 0 ? 'text-blue-600 dark:text-sky-400' : 'text-gray-800 dark:text-white'
                          }`}>{result.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 dark:text-slate-400">
                            <MapPin className="h-4 w-4" /> {result.location}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-center text-center pt-2 sm:pt-0">
                          <div className="relative w-20 h-20">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <path
                                className={`stroke-current ${
                                  index === 0 ? 'text-blue-500/20 dark:text-sky-400/20' : 'text-gray-300/50 dark:text-slate-600'
                                }`}                              
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                strokeWidth="3"
                              />
                              <path
                                className={`stroke-current ${
                                  index === 0 ? 'text-blue-600 dark:text-sky-400' : 'text-gray-500 dark:text-slate-400'
                                }`}
                                strokeDasharray={`${result.matchRate}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xl font-bold ${
                                index === 0 ? 'text-blue-600 dark:text-sky-400' : 'text-gray-700 dark:text-slate-200'
                              }`}>{result.matchRate}<span className="text-xs">%</span></span>
                            </div>
                          </div>
                          <p className="text-xs font-medium mt-1 text-gray-500 dark:text-slate-400">マッチ度</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className={`font-semibold text-lg ${
                          index === 0 ? 'text-blue-600 dark:text-sky-400' : 'text-gray-700 dark:text-slate-200'
                        }`}>{result.departments?.join(', ') || '学科情報なし'}</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">{result.matchReason}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">この高専の概要</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">{result.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-gray-50/50 dark:bg-slate-800/30 border-t dark:border-slate-700/50 rounded-b-2xl">
                  <Button
                    asChild
                    size="lg"
                    className={`w-full font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-2 group ${
                      index === 0 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40' 
                        : 'bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-600 hover:border-gray-400'
                    }`}
                    variant={index === 0 ? "default" : "outline"}
                  >
                    <Link href={`/find-kosen/${result.id}`}>
                      詳細を見る <ArrowRight className={`ml-2 h-5 w-5 ${
                        index === 0 ? 'group-hover:translate-x-1' : 'group-hover:translate-x-0.5'
                      } transition-transform duration-200`} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
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
              className="font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/80 flex items-center gap-2 group"
            >
              <ArrowRight className="mr-2 h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" /> もう一度診断する
            </Button>
            <Button asChild size="lg" className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-700/90 hover:to-gray-900/90 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg hover:shadow-gray-700/30 transition-all duration-300 ease-in-out flex items-center gap-2 group">
              <Link href="/">トップページに戻る <Home className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" /></Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const progressValue = activeTab === "structured" ? (currentStep / structuredQuestionKeys.length) * 100 : (freeformText.length > 0 ? 100 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-sky-900">
      <main className="container py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={showResults ? "results" : isAnalyzing ? "analyzing" : "questions"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {!showResults && !isAnalyzing ? (
              <Card className="shadow-xl border-gray-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md dark:bg-slate-800/80 dark:border-slate-700">
                <CardHeader className="border-b border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 text-sm font-semibold rounded-full shadow-md">無料診断</Badge>
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
                        className="py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md transition-all duration-200 ease-in-out dark:text-slate-300 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white"
                      >
                        選択式診断
                      </TabsTrigger>
                      <TabsTrigger
                        value="freeform"
                        className="py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md rounded-md transition-all duration-200 ease-in-out dark:text-slate-300 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white"
                      >
                        AI自由記述診断
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="mb-6 px-1">
                      <Progress value={progressValue} className="w-full h-2.5 bg-gray-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 transition-all duration-300 ease-in-out rounded-full" />
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
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2 group"
                  >
                    診断結果を見る <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </CardFooter>
              </Card>
            ) : isAnalyzing ? (
              <Card className="text-center p-8 md:p-12 shadow-xl border-gray-200 rounded-2xl bg-white/80 backdrop-blur-md dark:bg-slate-800/80 dark:border-slate-700">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative w-24 h-24">
                    <AnimatePresence>
                      <motion.div
                        key={analyzingStep % 6} // アイコンを切り替えるキー
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {[
                          <BookOpen key="book" className="h-12 w-12 text-blue-600" />,
                          <PenLine key="deviation" className="h-12 w-12 text-cyan-600" />,
                          <Brain key="brain" className="h-12 w-12 text-purple-600" />,
                          <Target key="target" className="h-12 w-12 text-green-600" />,
                          <Users key="users" className="h-12 w-12 text-orange-600" />,
                          <MapPin key="map" className="h-12 w-12 text-teal-600" />,
                        ][analyzingStep % 6]}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <CardTitle className="text-2xl font-semibold text-blue-600 dark:text-sky-400">AIが診断中...</CardTitle>
                  <CardDescription className="text-base text-gray-600 dark:text-slate-300 max-w-sm">
                    あなたの回答を丁寧に分析し、あなたにピッタリの高専を見つけるお手伝いをしています。もう少々お待ちください。
                  </CardDescription>
                  <Progress value={progress} className="w-full max-w-xs h-2 mt-2 bg-gray-200 dark:bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600 rounded-full transition-all duration-300" />
                </div>
              </Card>
            ) : (
              renderResults()
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
