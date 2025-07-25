'use client'; // 検索機能のためにClient Componentにする

import { useState, useEffect } from 'react'; // React Hooksをインポート
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Inputコンポーネントをインポート
import Link from "next/link";
import Image from 'next/image'; // Imageコンポーネントをインポート
import { MapPin, ExternalLink, BookOpen, Search, Info } from "lucide-react"; // アイコン追加
import { kosenList } from "@/lib/kosen-data";
import { Kosen } from "@/types/kosen"; // kosenList と Kosen をインポート (kosenListFull -> kosenList, KosenData -> Kosen)

export default function FindKosenPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKosenList, setFilteredKosenList] = useState<Kosen[]>(kosenList);

  useEffect(() => {
    const results = kosenList.filter(
      (kosen: Kosen) =>
        kosen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kosen.yomi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kosen.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kosen.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kosen.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredKosenList(results);
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <main className="flex-1 py-10 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              全国の高専を探す
            </h1>
            <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
              あなたの未来を切り拓く、日本全国の高等専門学校を見つけよう。
            </p>
          </div>

          {/* 検索入力フィールド */} 
          <div className="mb-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="高専名、所在地（例：函館、東京）で検索..."
                className="w-full pl-10 pr-4 py-2 text-base rounded-lg border border-input bg-background shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredKosenList.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {filteredKosenList.map((kosen) => (
                <Card key={kosen.id} className="flex flex-col elegant-card hover:shadow-lg transition-shadow w-full overflow-hidden">
                  {kosen.imageUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={kosen.imageUrl}
                        alt={`${kosen.name}の画像`}
                        fill
                        className="object-cover"
                      />
                      {kosen.imageCreditText && kosen.imageCreditUrl && (
                        <a 
                          href={kosen.imageCreditUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded transition-colors hover:bg-opacity-80"
                          onClick={(e) => e.stopPropagation()} // カードクリックの伝播を停止
                        >
                          {kosen.imageCreditText}
                        </a>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{kosen.name} <span className="text-base font-medium text-muted-foreground">({kosen.type})</span></CardTitle>
                    <CardDescription className="flex items-center pt-1 text-base">
                      <MapPin className="mr-1.5 h-5 w-5 text-muted-foreground" />
                      {kosen.region} - {kosen.campus}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4"> {/* space-yを追加 */} 
                    {/* 特色・概要 */}
                    {kosen.description && (
                      <div>
                        <h4 className="text-md font-semibold mb-1 text-foreground">特色・概要</h4>
                        <p className="text-base text-muted-foreground whitespace-pre-wrap">{kosen.description}</p>
                      </div>
                    )}

                    {/* 設置学科 */}
                    {kosen.departments && kosen.departments.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold mb-1 text-foreground">主な設置学科</h4>
                        <ul className="list-disc list-inside pl-1 space-y-0.5">
                          {kosen.departments.map((dept: string, index: number) => ( // 引数に型注釈
                            <li key={index} className="text-base text-muted-foreground">{dept}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!kosen.description && !kosen.departments && (
                      <p className="text-base text-muted-foreground">
                        詳細情報 (学科、特色など) は現在準備中です。
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2 pt-4"> {/* フッターのレイアウト調整 */}
                    <Button asChild size="sm" className="w-full sm:w-auto elegant-button order-2 sm:order-1"> 
                      <Link href={`/find-kosen/${kosen.id}`}>
                        <span className="flex items-center justify-center"> {/* Linkの子を単一のspanでラップ */} 
                          詳細を見る
                          <Info className="ml-1.5 h-4 w-4" /> 
                        </span>
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="w-full sm:w-auto elegant-button-outline order-1 sm:order-2"> 
                      <Link href={kosen.website} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center justify-center"> {/* Linkの子を単一のspanでラップ */} 
                          公式サイトへ
                          <ExternalLink className="ml-1.5 h-4 w-4" />
                        </span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                {searchTerm ? `「${searchTerm}」に一致する高専は見つかりませんでした。` : "高専情報が見つかりませんでした。"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm ? "検索キーワードを変えて再度お試しください。" : "現在準備中です。しばらくお待ちください。"}
              </p>
            </div>
          )}
        </div>
      </main>
      {/* フッターが必要な場合はここに検討 */}
    </div>
  );
} 