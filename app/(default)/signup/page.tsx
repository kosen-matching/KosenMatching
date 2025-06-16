'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff } from 'lucide-react';
import { kosenList } from '../../../lib/kosen-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  userType: z.enum(['student', 'alumnus', 'examinee'], {
    required_error: "在校生、卒業生、受験生のいずれかを選択してください。",
  }),
  username: z.string().min(2, { message: 'ユーザー名は2文字以上で入力してください。' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
  password: z.string().min(6, { message: 'パスワードは6文字以上で入力してください。' }),
  kosenEmail: z.string().email({ message: '有効な高専メールアドレスを入力してください。' }).optional().or(z.literal('')),
  kosenId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.userType === 'student' || data.userType === 'alumnus') {
    if (!data.kosenId || data.kosenId.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['kosenId'],
        message: '高専を選択してください。',
      });
    }
  }
  if (data.userType === 'student') {
    if (!data.kosenEmail || data.kosenEmail.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['kosenEmail'],
        message: '高専のメールアドレスを入力してください。',
      });
    }
  }
});

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      kosenId: '',
      kosenEmail: '',
    },
  });

  const userType = form.watch('userType');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);

    const processedValues = { ...values };
    if (processedValues.userType !== 'student') {
      processedValues.kosenEmail = undefined;
    }
    if (processedValues.userType === 'examinee') {
      processedValues.kosenId = undefined;
    }

    try {
      console.log('Sending signup data:', processedValues);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedValues),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }

      window.location.href = '/'; // Redirect to home page with a hard refresh
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">アカウントを作成</CardTitle>
          <CardDescription>以下の詳細を入力して開始してください</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>在校生か卒業生か受験生かを選択してください</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">在校生</SelectItem>
                        <SelectItem value="alumnus">卒業生</SelectItem>
                        <SelectItem value="examinee">受験生</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(userType === 'student' || userType === 'alumnus') && (
                 <FormField
                  control={form.control}
                  name="kosenId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>高専名</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="高専を選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {kosenList.map((kosen) => (
                            <SelectItem key={kosen.id} value={kosen.id}>
                              {kosen.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ユーザー名</FormLabel>
                    <FormControl>
                      <Input placeholder="あなたのユーザー名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {userType === 'student' && (
                <FormField
                  control={form.control}
                  name="kosenEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>高専のメールアドレス</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@student.kosen.ac.jp" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{userType === 'student' ? '個人用メールアドレス' : 'メールアドレス'}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'アカウント作成中...' : 'アカウントを作成'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
           <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              すでにアカウントをお持ちの場合は{' '}
              <a href="/login" className="font-medium text-primary hover:underline">
                ログイン
              </a>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
} 