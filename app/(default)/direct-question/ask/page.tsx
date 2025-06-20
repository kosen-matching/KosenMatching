"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TagInput } from "@/components/tag-input"
import { useToast } from "@/components/ui/use-toast"

const predefinedTags = [
  {
    category: "高専名",
    subcategories: [
      {
        category: "北海道地方",
        tags: ["北海道", "釧路"],
      },
      {
        category: "東北地方",
        tags: ["八戸", "一関", "仙台", "鶴岡", "福島"],
      },
      {
        category: "関東甲信越地方",
        tags: ["茨城", "小山", "群馬", "木更津", "東京", "長岡"],
      },
      {
        category: "東海北陸地方",
        tags: ["富山", "石川", "福井", "岐阜", "沼津", "豊田", "鳥羽", "鈴鹿"],
      },
      {
        category: "近畿地方",
        tags: ["舞鶴", "大阪", "和歌山", "神戸"],
      },
      {
        category: "中国地方",
        tags: ["米子", "津山", "広島", "呉", "徳山", "宇部"],
      },
      {
        category: "四国地方",
        tags: ["阿南", "香川", "新居浜", "高知"],
      },
      {
        category: "九州・沖縄地方",
        tags: ["久留米", "佐世保", "熊本", "大分", "都城", "鹿児島", "沖縄"],
      },
    ],
  },
  {
    category: "学科",
    tags: [
      "機械工学科",
      "電気情報工学科",
      "化学・生物工学科",
      "環境都市工学科",
      "建築学科",
      "情報工学科",
    ],
  },
  {
    category: "学校生活",
    tags: [
      "雰囲気",
      "寮生活",
      "学生生活",
      "テスト対策",
      "課題",
      "部活動",
    ],
  },
  {
    category: "進路",
    tags: [
      "就職",
      "大学編入",
      "高専編入",
    ],
  },
];

const EMPTY_ARRAY: string[] = [];

export default function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!content || !nickname || !email) {
      toast({
        title: "エラー",
        description: "質問内容、ニックネーム、メールアドレスは必須です。",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/direct-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, nickname, email, tags: selectedTags }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "成功",
          description: "質問が正常に投稿されました！",
        });
        setTitle("");
        setContent("");
        setNickname("");
        setEmail("");
        setSelectedTags([]);
      } else {
        toast({
          title: "エラー",
          description: result.message || "質問の投稿に失敗しました。",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("質問投稿エラー:", error);
      toast({
        title: "エラー",
        description: "ネットワークエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 md:py-12">
      <Card className="shadow-lg rounded-lg border border-gray-200 p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold text-blue-600">質問を投稿する</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center text-blue-500 text-sm font-semibold cursor-pointer hover:underline">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  <span>回答を増やすポイント</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 text-gray-700 bg-white shadow-lg rounded-lg">
                <h4 className="font-bold mb-2">回答を増やすためのヒント:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>具体的に質問内容を記述しましょう。</li>
                  <li>知りたいことを明確にしましょう。</li>
                  <li>丁寧な言葉遣いを心がけましょう。</li>
                  <li>関連するタグを設定しましょう。</li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-gray-600 mt-2">
            高専の在校生や卒業生に聞きたいことを入力してください。
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6">
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
                className="focus:border-blue-500 focus:ring-blue-500/20"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                className="min-h-[150px] focus:border-blue-500 focus:ring-blue-500/20"
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
                className="focus:border-blue-500 focus:ring-blue-500/20"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
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
                className="focus:border-blue-500 focus:ring-blue-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="tags"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                タグ (任意)
              </label>
              <TagInput
                predefinedTags={predefinedTags}
                initialSelectedTags={selectedTags}
                onChange={setSelectedTags}
              />
            </div>
          </CardContent>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => {
                setTitle("");
                setContent("");
                setNickname("");
                setEmail("");
                setSelectedTags([]);
            }} className="border-gray-300 text-gray-700 hover:bg-gray-100" type="button">キャンセル</Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white elegant-button" disabled={isSubmitting}>
              {isSubmitting ? "送信中..." : "質問を送信する"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 