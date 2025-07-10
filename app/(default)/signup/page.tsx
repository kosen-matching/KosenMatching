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
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

const formSchema = z.object({
  userType: z.enum(['student', 'alumnus', 'examinee'], {
    required_error: "在校生、卒業生、受験生のいずれかを選択してください。",
  }),
  username: z.string().min(2, { message: 'ユーザー名は2文字以上で入力してください。' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }),
  password: z.string().min(6, { message: 'パスワードは6文字以上で入力してください。' }),
  passwordConfirmation: z.string(),
  kosenEmail: z.string().refine(email => {
    if (!email) return true; // Optional, so empty is allowed
    return z.string().email().safeParse(email).success && email.match(/@(?:.+\.)?kosen-ac\.jp$/);
  }, {
    message: '有効な高専メールアドレスを入力してください。(@kosen-ac.jpドメインが必要です)',
  }).optional().or(z.literal('')),
  kosenId: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "利用規約とプライバシーポリシーに同意してください。",
  }),
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
    if (!data.kosenEmail || !data.kosenEmail.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['kosenEmail'],
        message: '高専のメールアドレスを入力してください。',
      });
    }
  }
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      path: ['passwordConfirmation'],
      message: "パスワードが一致しません。",
      code: z.ZodIssueCode.custom
    });
  }
});

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) {
    score = 1;
    const variations = {
      digits: /\d/.test(password),
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      nonAlphanumeric: /[^a-zA-Z0-9]/.test(password),
    };
    const variationCount = Object.values(variations).filter(Boolean).length;
    score += Math.min(variationCount, 4);
  } else if (password.length > 0) {
    return 1;
  }
  
  if (password.length >= 8 && score >= 4) return 4;
  if (password.length >= 8 && score >= 3) return 3;
  if (password.length >= 8 && score >= 2) return 2;
  return score > 0 ? 1 : 0;
};

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
  if (!password) return null;

  const strength = calculatePasswordStrength(password);
  
  const strengthLabels = ['弱すぎます', '弱い', '普通', '強い', 'とても強い'];
  const strengthColors = [
    'bg-gray-400',       // 0 - no bar or very tiny
    'bg-red-500',       // 1
    'bg-yellow-500',    // 2
    'bg-blue-500',      // 3
    'bg-green-500'      // 4
  ];
   const textColors = [
    'text-gray-500',      // 0
    'text-red-500',       // 1
    'text-yellow-500',    // 2
    'text-blue-500',      // 3
    'text-green-500'      // 4
  ];

  const widthPercentage = strength * 25;

  return (
    <div className="mt-2 space-y-1">
      <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${strengthColors[strength]}`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
      <p className={`text-xs text-right transition-colors duration-300 ${textColors[strength]}`}>
        パスワード強度: {strengthLabels[strength]}
      </p>
    </div>
  );
};

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
      passwordConfirmation: '',
      kosenId: '',
      kosenEmail: '',
      termsAccepted: false,
    },
  });

  const userType = form.watch('userType');
  const password = form.watch('password');

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

              {userType && (
                <div className="space-y-4 pt-4">
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
                        <PasswordStrengthIndicator password={password} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>パスワード（確認用）</FormLabel>
                        <FormControl>
                          <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                           <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>
                            <Link href="/terms" target="_blank" className="underline hover:text-primary">利用規約</Link>
                            と
                            <Link href="/privacy" target="_blank" className="underline hover:text-primary">プライバシーポリシー</Link>
                            に同意します
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'アカウント作成中...' : 'アカウントを作成'}
                  </Button>
                </div>
              )}
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