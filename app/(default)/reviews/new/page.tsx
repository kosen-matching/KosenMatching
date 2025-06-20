'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kosenList } from '@/lib/kosen-data';
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  kosenId: z.string({ required_error: "高専を選択してください。" }),
  year: z.coerce.number().min(1962, "正しい入学年度を入力してください。").max(new Date().getFullYear()),
  department: z.string({ required_error: "学科を選択してください。" }),
  title: z.string().min(5, "タイトルは5文字以上で入力してください。").max(100),
  rating: z.number().min(1, "評価は必須です。").max(5),
  pros: z.string().min(10, "良かった点は10文字以上で入力してください。").max(1000),
  cons: z.string().min(10, "微妙だった点は10文字以上で入力してください。").max(1000),
  content: z.string().min(20, "本文は20文字以上で入力してください。").max(5000),
});

const departments = ['情報', '機械', '電気', '物質', '建築', 'その他'];

export default function NewReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentRating, setCurrentRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      pros: "",
      cons: "",
      content: "",
      rating: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast({
          title: "投稿完了",
          description: "体験談を投稿しました。ご協力ありがとうございます！",
        });
        router.push('/reviews');
      } else {
        const errorData = await res.json();
        toast({
          title: "エラー",
          description: errorData.error || "投稿に失敗しました。時間をおいて再度お試しください。",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "サーバーに接続できませんでした。ネットワーク環境をご確認ください。",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">
          体験談を投稿する
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">あなたの高専での経験を後輩たちに伝えよう！</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8 border rounded-lg shadow-lg bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="kosenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>高専名</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="高専を選択" /></SelectTrigger></FormControl>
                    <SelectContent>{kosenList.map(k => <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>入学年度</FormLabel>
                  <FormControl><Input type="number" placeholder="例: 2020" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>学科</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="学科を選択" /></SelectTrigger></FormControl>
                    <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タイトル</FormLabel>
                <FormControl><Input placeholder="体験談のタイトル（例：私の高専生活とプログラミング）" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>総合評価</FormLabel>
                <FormControl>
                   <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`cursor-pointer w-8 h-8 transition-colors ${
                            currentRating >= star || field.value >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          onMouseEnter={() => setCurrentRating(star)}
                          onMouseLeave={() => setCurrentRating(0)}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                    <Input type="hidden" {...field} />
                   </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>良かった点</FormLabel>
                <FormControl><Textarea placeholder="高専生活で特に良かったと感じたことを具体的に書いてください。" {...field} rows={5} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <FormField
            control={form.control}
            name="cons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>微妙だった点</FormLabel>
                <FormControl><Textarea placeholder="改善してほしい点や、合わないと感じたことなどを正直に書いてください。" {...field} rows={5}/></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>自由記述欄</FormLabel>
                <FormControl><Textarea placeholder="その他、後輩に伝えたいこと、アドバイスなど自由にお書きください。" {...field} rows={8} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50">
            {isSubmitting ? '投稿中...' : '投稿する'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 