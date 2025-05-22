import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input" // 一旦コメントアウト
// import { Textarea } from "@/components/ui/textarea" // 一旦コメントアウト
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" // Card関連を追加
import { ExternalLink, MessageCircle, ThumbsUp, Search } from "lucide-react" // アイコンを追加

// ダミーデータ
const dummyQuestions = [
  {
    id: 1,
    title: "〇〇高専の機械工学科の雰囲気について教えてください！",
    content: "今年受験を考えている中3です。〇〇高専の機械工学科の普段の授業の雰囲気や、先生方の特徴、男女比などを在校生の方に伺いたいです。また、課題の量や難易度についても教えていただけると嬉しいです。よろしくお願いします！",
    nickname: "高専気になるマン",
    createdAt: "2時間前",
    answersCount: 2,
    isUrgent: true,
    tags: ["機械工学科", "雰囲気", "〇〇高専"],
  },
  {
    id: 2,
    title: "高専から大学編入する際の勉強法について",
    content: "現在高専の電気情報工学科3年生です。将来は旧帝大の工学部に編入したいと考えているのですが、いつ頃からどのような勉強を始めれば良いでしょうか？おすすめの参考書や勉強スケジュールなど、経験者の方がいらっしゃいましたらアドバイスをお願いします。",
    nickname: "編入希望",
    createdAt: "1日前",
    answersCount: 5,
    isUrgent: false,
    tags: ["大学編入", "勉強法", "電気情報工学科"],
  },
  {
    id: 3,
    title: "女子でも高専の寮生活は楽しめますか？",
    content: "来年、地方の国立高専に進学予定の女子です。親元を離れて寮生活になるのですが、女子が少ない高専の寮生活はどんな感じでしょうか？不安なことや、逆に楽しかったことなど、実体験を教えていただきたいです。",
    nickname: "寮生活不安ちゃん",
    createdAt: "3日前",
    answersCount: 1,
    isUrgent: false,
    tags: ["寮生活", "女子", "学生生活"],
  },
];

export default function DirectQuestionSection() {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-slate-50"> {/* 背景色を薄いグレーに */}
      <div className="container px-4 md:px-6">
        {/* ヘッダーセクション */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-600"> {/* 文字色を青系に */}
              在校生・卒業生に聞いてみよう
            </h1>
            <p className="max-w-[700px] text-gray-600 md:text-lg"> {/* 文字色をグレー系に */}
              高専のリアルな情報や、気になる疑問を直接質問できます。
            </p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white elegant-button shrink-0"> {/* ボタンの色を変更 */}
            <MessageCircle className="mr-2 h-5 w-5" />
            質問する
          </Button>
        </div>

        {/* 検索バー (プレースホルダー) */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="キーワードで質問を検索..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>


        {/* メインコンテンツエリア - 質問リスト */}
        <div className="grid gap-6 md:gap-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold text-gray-800">新着の質問</h2>
            {/* TODO: ソート機能など */}
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
              絞り込み
            </Button>
          </div>

          {dummyQuestions.map((question) => (
            <Card key={question.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer">
                    {/* <Link href={`/direct-question/${question.id}`}> */}
                      {question.title}
                    {/* </Link> */}
                  </CardTitle>
                  {question.isUrgent && (
                    <Badge variant="destructive" className="bg-red-500 text-white">至急</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  投稿者: {question.nickname} - {question.createdAt}
                </p>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-700 line-clamp-3">
                  {question.content}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-2 py-0.5 rounded-full cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 py-3 px-5 rounded-b-lg">
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span>回答 {question.answersCount}件</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100 hover:text-blue-700">
                  回答する・詳細を見る
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* ページネーション (プレースホルダー) */}
        <div className="mt-10 flex justify-center">
          <Button variant="outline" className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-100">前へ</Button>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">次へ</Button>
        </div>

        {/* 元のフォーム (一旦コメントアウト)
        <div className="mx-auto grid max-w-3xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:max-w-4xl mt-12">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label
                htmlFor="question-title"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                質問のタイトル (任意)
              </label>
              <Input
                id="question-title"
                placeholder="例：〇〇高専の〇〇学科の雰囲気について"
                className="focus:border-theme-primary focus:ring-theme-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="question-content"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                質問内容
              </label>
              <Textarea
                id="question-content"
                placeholder="具体的な質問内容を記入してください。"
                className="min-h-[150px] focus:border-theme-primary focus:ring-theme-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="nickname"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                ニックネーム (公開されます)
              </label>
              <Input
                id="nickname"
                placeholder="こうせん太郎"
                className="focus:border-theme-primary focus:ring-theme-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                メールアドレス (回答があった場合にお知らせします。公開されません)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tarou@example.com"
                className="focus:border-theme-primary focus:ring-theme-primary/20"
              />
            </div>
            <Button type="submit" className="w-full bg-theme-primary hover:bg-theme-primary/90 text-white elegant-button">
              質問を送信する
            </Button>
          </div>
        </div>
        */}
      </div>
    </section>
  )
} 