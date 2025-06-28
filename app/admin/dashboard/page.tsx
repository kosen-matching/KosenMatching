'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Users, UserPlus, ShieldOff, HelpCircle, Mail, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { kosenList } from '@/lib/kosen-data'; // 高専名を取得するためにインポート
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ユーザー情報の型定義
interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  status?: 'active' | 'banned';
  profileImageUrl?: string;
  userType: 'student' | 'alumnus' | 'examinee' | 'moderator' | 'admin'; // Add userType
}

// 統計情報の型定義
interface Stats {
  totalUsers: number;
  todayAccesses: number; // Note: This is new users today
}

// 承認待ち画像の型定義
interface PendingImage {
  _id: string;
  kosenId: string;
  fileId: string;
  createdAt: string;
  uploader: {
    username: string;
    email: string;
  };
}

// Direct Question client-side type
interface DirectQuestion {
    _id: string;
    title: string;
    content: string;
    nickname: string;
    email: string;
    tags: string[];
    createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<DirectQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, statsRes, imagesRes, questionsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
        fetch('/api/admin/pending-images'),
        fetch('/api/admin/direct-questions'),
      ]);

      const usersData = usersRes.ok ? await usersRes.json() : null;
      const statsData = statsRes.ok ? await statsRes.json() : null;
      const imagesData = imagesRes.ok ? await imagesRes.json() : null;
      const questionsData = questionsRes.ok ? await questionsRes.json() : null;
      
      if (!usersRes.ok || !statsRes.ok || !imagesRes.ok || !questionsRes.ok) {
        const errorData = usersData || statsData || imagesData || questionsData;
        throw new Error(errorData?.message || 'Failed to fetch data');
      }

      setUsers(usersData);
      setStats(statsData);
      setPendingImages(imagesData);
      setPendingQuestions(questionsData);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error fetching data',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);
  
  const handleUpdateUserStatus = async (userId: string, status: 'active' | 'banned') => {
    try {
      const res = await fetch('/api/admin/update-user-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user status');
      }
      
      toast({
        title: 'Success',
        description: `User has been ${status}.`,
        variant: status === 'banned' ? 'destructive' : 'default',
      });
      
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user._id === userId ? { ...user, status } : user
        )
      );
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: User['userType']) => {
    console.log(`[Frontend] Attempting to update user role: userId=${userId}, newRole=${newRole}`);
    try {
      const res = await fetch('/api/admin/update-user-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }
      
      console.log(`[Frontend] API call successful. New role: ${newRole}`);

      toast({
        title: 'Success',
        description: `User role updated to ${newRole}.`,
      });
      
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user._id === userId ? { ...user, userType: newRole } : user
        )
      );
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleModerateImage = async (imageId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/moderate-image', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      toast({
        title: 'Success',
        description: `Image has been ${status}.`,
        variant: status === 'approved' ? 'default' : 'destructive',
      });
      
      setPendingImages(currentImages => currentImages.filter(image => image._id !== imageId));

    } catch (err: any) {
      toast({
        title: 'Moderation Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleModerateQuestion = async (questionId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/moderate-question', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update question status');
      }
      
      toast({
        title: 'Success',
        description: `Question has been ${status}.`,
      });
      
      setPendingQuestions(currentQuestions => currentQuestions.filter(q => q._id !== questionId));

    } catch (err: any) {
      toast({
        title: 'Moderation Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const getKosenName = (kosenId: string) => {
    const kosen = kosenList.find(k => k.id === kosenId);
    return kosen ? kosen.name : 'Unknown Kosen';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">データを取得中...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="container mx-auto py-10">
            <Card className="bg-destructive/10 border-destructive mb-6">
                <CardHeader className="flex flex-row items-center gap-4">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <div>
                        <CardTitle>Error</CardTitle>
                        <CardDescription className="text-destructive">{error}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">管理者ダッシュボード</h1>
      <p className="text-muted-foreground mb-6">サイトの統計情報を確認し、ユーザーや画像を管理します。</p>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総アカウント数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">登録されている総ユーザー数</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日の新規登録</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.todayAccesses}</div>
               <p className="text-xs text-muted-foreground">本日登録したユーザー数</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="user-management">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-management">ユーザー管理</TabsTrigger>
          <TabsTrigger value="image-moderation">
            画像承認
            {pendingImages.length > 0 && (
              <Badge className="ml-2">{pendingImages.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="question-moderation">
            質問管理
            {pendingQuestions.length > 0 && (
              <Badge className="ml-2">{pendingQuestions.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle>ユーザー管理</CardTitle>
              <CardDescription>登録ユーザーの一覧です。ここからユーザーの利用停止（Ban）操作ができます。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                  <Input
                      placeholder="ユーザー名またはEmailで検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                  />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ユーザー</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>登録日</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>ロール</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={
                                  user.profileImageUrl
                                    ? `/api/images/${user.profileImageUrl}`
                                    : undefined
                                }
                                alt={user.username}
                              />
                              <AvatarFallback>
                                {user.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {user.username}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === 'banned' ? 'destructive' : 'default'
                            }
                          >
                            {user.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            onValueChange={(value: User['userType']) =>
                              handleUpdateUserRole(user._id, value)
                            }
                            value={user.userType}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="alumnus">Alumnus</SelectItem>
                              <SelectItem value="examinee">Examinee</SelectItem>
                              <SelectItem value="moderator">
                                Moderator
                              </SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant={
                                  user.status === 'banned'
                                    ? 'outline'
                                    : 'destructive'
                                }
                                size="sm"
                              >
                                {user.status === 'banned' ? (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                ) : (
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                )}
                                {user.status === 'banned' ? 'Unban' : 'Ban'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  本当に実行しますか？
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  ユーザー「{user.username}
                                  」のステータスを「
                                  {user.status === 'banned' ? 'active' : 'banned'}
                                  」に変更します。
                                  {user.status !== 'banned' &&
                                    ' Banされたユーザーはログインできなくなります。'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleUpdateUserStatus(
                                      user._id,
                                      user.status === 'banned'
                                        ? 'active'
                                        : 'banned'
                                    )
                                  }
                                  className={
                                    user.status === 'banned'
                                      ? ''
                                      : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                  }
                                >
                                  実行
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        ユーザーが見つかりません。
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="image-moderation">
           {pendingImages.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h2 className="mt-4 text-xl font-semibold">承認待ちはありません</h2>
                    <p className="mt-1 text-muted-foreground">現在、承認待ちの画像はありません。</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingImages.map((image) => (
                  <Card key={image._id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg">{getKosenName(image.kosenId)}</CardTitle>
                      <CardDescription>
                        Uploaded by: {image.uploader.username} ({image.uploader.email}) <br />
                        On: {new Date(image.createdAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                       <a href={`/api/images/${image.fileId}`} target="_blank" rel="noopener noreferrer">
                         <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                            <Image 
                                src={`/api/images/${image.fileId}`}
                                alt={`Uploaded image for ${image.kosenId}`}
                                fill
                                className="object-cover"
                                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }}
                            />
                         </div>
                       </a>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleModerateImage(image._id, 'rejected')}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                      <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleModerateImage(image._id, 'approved')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
        </TabsContent>
        <TabsContent value="question-moderation">
           {pendingQuestions.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <h2 className="mt-4 text-xl font-semibold">承認待ちの質問はありません</h2>
                    <p className="mt-1 text-muted-foreground">現在、承認待ちの質問はありません。</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {pendingQuestions.map((question) => (
                  <AccordionItem value={question._id} key={question._id} className="border rounded-lg bg-white shadow-sm">
                    <AccordionTrigger className="p-4 hover:no-underline">
                      <div className="flex flex-col items-start text-left">
                          <p className="font-semibold text-base text-gray-800">{question.title || "（タイトルなし）"}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>投稿者: {question.nickname}</span>
                              <span>{new Date(question.createdAt).toLocaleString('ja-JP')}</span>
                          </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                        {question.content}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{question.email}（通知用・非公開）</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {question.tags.map(tag => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleModerateQuestion(question._id, 'rejected')}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleModerateQuestion(question._id, 'approved')}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 