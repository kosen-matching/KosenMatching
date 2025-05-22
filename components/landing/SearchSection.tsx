import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SearchSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block">
            <Badge className="bg-theme-primary text-white px-4 py-1 text-sm">簡単検索</Badge>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              あなたに合った<span className="text-theme-primary">高専</span>を見つける
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              興味のある分野、地域、特色から理想の高専を探しましょう
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-8">
          <div className="rounded-lg border bg-card p-6 shadow-sm elegant-shadow">
            <Tabs defaultValue="interest" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger
                  value="interest"
                  className="data-[state=active]:bg-theme-primary data-[state=active]:text-white"
                >
                  興味・分野
                </TabsTrigger>
                <TabsTrigger
                  value="region"
                  className="data-[state=active]:bg-theme-primary data-[state=active]:text-white"
                >
                  地域
                </TabsTrigger>
                <TabsTrigger
                  value="feature"
                  className="data-[state=active]:bg-theme-primary data-[state=active]:text-white"
                >
                  特徴
                </TabsTrigger>
              </TabsList>
              <TabsContent value="interest" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="field"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      興味のある分野
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary/20">
                      <option value="">選択してください</option>
                      <option value="mechanical">機械工学</option>
                      <option value="electrical">電気・電子工学</option>
                      <option value="information">情報工学</option>
                      <option value="chemical">化学・生物工学</option>
                      <option value="architecture">建築・土木工学</option>
                      <option value="marine">商船・海洋工学</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="level"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      得意科目
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary/20">
                      <option value="">選択してください</option>
                      <option value="math">数学</option>
                      <option value="physics">物理</option>
                      <option value="chemistry">化学</option>
                      <option value="biology">生物</option>
                      <option value="english">英語</option>
                      <option value="japanese">国語</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full bg-theme-primary hover:bg-theme-primary/90 text-white">
                  この条件で検索
                </Button>
              </TabsContent>
              <TabsContent value="region" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="region"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      地域
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary/20">
                      <option value="">選択してください</option>
                      <option value="hokkaido">北海道</option>
                      <option value="tohoku">東北</option>
                      <option value="kanto">関東</option>
                      <option value="chubu">中部</option>
                      <option value="kansai">関西</option>
                      <option value="chugoku">中国</option>
                      <option value="shikoku">四国</option>
                      <option value="kyushu">九州・沖縄</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="distance"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      通学時間
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary/20">
                      <option value="">選択してください</option>
                      <option value="30min">30分以内</option>
                      <option value="60min">1時間以内</option>
                      <option value="90min">1時間30分以内</option>
                      <option value="any">寮生活希望</option>
                    </select>
                  </div>
                </div>
                <Button className="w-full bg-theme-primary hover:bg-theme-primary/90 text-white">
                  この条件で検索
                </Button>
              </TabsContent>
              <TabsContent value="feature" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      特徴（複数選択可）
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          id="dorm"
                          className="h-4 w-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary/20"
                        />
                        <label htmlFor="dorm" className="text-sm">
                          寮完備
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          id="international"
                          className="h-4 w-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary/20"
                        />
                        <label htmlFor="international" className="text-sm">
                          国際交流が盛ん
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          id="club"
                          className="h-4 w-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary/20"
                        />
                        <label htmlFor="club" className="text-sm">
                          部活動が充実
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          id="employment"
                          className="h-4 w-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary/20"
                        />
                        <label htmlFor="employment" className="text-sm">
                          就職率が高い
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          id="university"
                          className="h-4 w-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary/20"
                        />
                        <label htmlFor="university" className="text-sm">
                          大学編入実績が豊富
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          id="facility"
                          className="h-4 w-4 rounded border-gray-300 text-theme-primary focus:ring-theme-primary/20"
                        />
                        <label htmlFor="facility" className="text-sm">
                          施設・設備が充実
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-theme-primary hover:bg-theme-primary/90 text-white">
                  この条件で検索
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
} 