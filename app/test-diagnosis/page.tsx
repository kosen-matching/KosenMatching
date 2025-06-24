"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestDiagnosisPage() {
  const [inputText, setInputText] = useState("ロボット開発に興味があります。");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: {}, // 自由記述テキストを使うため、answersは空で渡します
          freeformText: inputText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'APIリクエストに失敗しました');
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-6">診断APIテストページ</h1>
      <Card>
        <CardHeader>
          <CardTitle>リクエスト</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="freeform" className="block text-sm font-medium text-gray-700 mb-2">
              自由記述テキスト
            </label>
            <Textarea
              id="freeform"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              placeholder="ここにテストしたいテキストを入力..."
            />
          </div>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "送信中..." : "APIを呼び出す"}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>レスポンス (成功)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mt-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">レスポンス (エラー)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 