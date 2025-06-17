import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function ContactSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t bg-theme-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block">
              <Badge className="bg-theme-primary text-white px-4 py-1 text-sm">お問い合わせ</Badge>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                <span className="text-theme-primary">お問い合わせ</span>
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                高専進学についてのご質問やサイトに関するお問い合わせはこちらから
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    お名前
                  </label>
                  <Input
                    id="name"
                    placeholder="山田 太郎"
                    className="focus:border-theme-primary focus:ring-theme-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    メールアドレス
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="example@example.com"
                    className="focus:border-theme-primary focus:ring-theme-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  お問い合わせ内容
                </label>
                <textarea
                  id="message"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="お問い合わせ内容をご記入ください"
                />
              </div>
              <Button className="bg-theme-primary hover:bg-theme-primary/90 text-white elegant-button">
                送信する
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm elegant-shadow">
              <h3 className="text-xl font-bold mb-4 text-theme-primary">よくある質問</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary text-xs font-bold">
                      Q
                    </div>
                    高専と普通の高校の違いは何ですか？
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    高専は5年制（商船高専は5年半）で、早期から専門的な技術教育を受けられます。普通科目に加えて専門科目が充実しており、実験・実習の時間も多いのが特徴です。
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary text-xs font-bold">
                      Q
                    </div>
                    高専卒業後の進路は？
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    就職する道と大学の3年次に編入学する道があります。また、高専専攻科（2年制）に進学して学士号を取得することも可能です。
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary text-xs font-bold">
                      Q
                    </div>
                    入試の難易度はどのくらいですか？
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    高専によって異なりますが、一般的に進学校レベルの学力が求められます。数学や理科の基礎学力が重視される傾向があります。
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full border-theme-primary text-theme-primary hover:bg-theme-primary/10"
                >
                  すべてのFAQを見る
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 