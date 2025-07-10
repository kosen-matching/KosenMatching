"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input" // 一旦コメントアウト
// import { Textarea } from "@/components/ui/textarea" // 一旦コメントアウト
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card" // Card関連を追加
import { ExternalLink, MessageCircle, ThumbsUp, Search, AlertTriangle, Loader2 } from "lucide-react" // アイコンを追加
import Link from "next/link" // Linkコンポーネントを追加
// import { IDirectQuestion } from "@/lib/models/directQuestion.model"; // Don't import server-side types

// Client-side type for a question. Dates and ObjectIds are strings after JSON serialization.
interface Question {
  _id: string;
  title: string;
  content: string;
  nickname: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  // answersCount is not yet implemented in the backend model
  answersCount?: number; 
}

export default function DirectQuestionSection() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/direct-question');
        if (!res.ok) {
          throw new Error('質問の読み込みに失敗しました。');
        }
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <Link href="/direct-question/ask" passHref>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white elegant-button shrink-0"> {/* ボタンの色を変更 */}
              <MessageCircle className="mr-2 h-5 w-5" />
              質問する
            </Button>
          </Link>
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

          {loading && (
            <div className="flex items-center justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-3 text-gray-600">質問を読み込んでいます...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
          )}

          {!loading && !error && questions.length === 0 && (
             <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">まだ質問がありません</h2>
                <p className="mt-1 text-muted-foreground">最初の質問を投稿してみましょう！</p>
              </div>
          )}

          {!loading && !error && questions.map((question) => (
            <Card key={question._id} className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer">
                    {/* <Link href={`/direct-question/${question._id}`}> */}
                      {question.title}
                    {/* </Link> */}
                  </CardTitle>
                </div>
                <p className="text-xs text-gray-500">
                  投稿者: {question.nickname} - {formatDate(question.createdAt)}
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
                  
                    {/* TODO: Implement answer count. */}
                    <span>回答 {question.answersCount || 0}件</span>
                  
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
      </div>
    </section>
  )
} 