'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AccountSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdateSuccess: (user: { username: string; email: string; profileImageUrl?: string }) => void; // プロフィール更新成功時のコールバック
}

export default function AccountSettingsDialog({ isOpen, onClose, onProfileUpdateSuccess }: AccountSettingsDialogProps) {
  const [user, setUser] = useState<{ username: string; email: string; profileImageUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return; // ダイアログが閉じている場合はフェッチしない

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setUsername(data.user.username);
          setEmail(data.user.email);
          setProfileImageUrl(data.user.profileImageUrl || '');
        } else {
          setUser(null);
          // ダイアログ表示中に認証切れの場合、ログインページへリダイレクト
          router.push('/login');
          onClose(); // ダイアログを閉じる
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
        router.push('/login');
        onClose(); // ダイアログを閉じる
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen, router, onClose]); // isOpenが変更されたら再度フェッチ

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/account/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, profileImageUrl }),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        onProfileUpdateSuccess(data.user); // 更新成功をヘッダーに通知
        toast({
          title: 'プロフィールを更新しました', 
          description: 'ユーザー名、メールアドレス、プロフィール画像が更新されました。'
        });
      } else {
        const errorData = await res.json();
        toast({
          title: 'プロフィールの更新に失敗しました', 
          description: errorData.message || '不明なエラーが発生しました。',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'プロフィールの更新に失敗しました', 
        description: 'ネットワークエラーまたはサーバーエラー。',
        variant: 'destructive'
      });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'パスワードが一致しません', 
        description: '新しいパスワードと確認用パスワードが一致しません。',
        variant: 'destructive'
      });
      return;
    }

    try {
      const res = await fetch('/api/account/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
      });

      if (res.ok) {
        toast({
          title: 'パスワードを更新しました', 
          description: 'パスワードが正常に更新されました。'
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        const errorData = await res.json();
        toast({
          title: 'パスワードの更新に失敗しました', 
          description: errorData.message || '不明なエラーが発生しました。',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'パスワードの更新に失敗しました', 
        description: 'ネットワークエラーまたはサーバーエラー。',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>アカウント設定</DialogTitle>
          <DialogDescription>
            プロフィール情報とパスワードを更新できます。
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-48">Loading...</div>
        ) : !user ? (
          <div className="text-center text-red-500">ユーザー情報を読み込めませんでした。ログインしてください。</div>
        ) : (
          <div className="grid gap-4 py-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>プロフィールを更新</CardTitle>
                <CardDescription>ユーザー名、メールアドレス、プロフィール画像を変更します。</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="flex flex-col items-center gap-4 mb-4">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="プロフィール画像" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}
                    <Label htmlFor="profile-image-url">プロフィール画像URL</Label>
                    <Input
                      id="profile-image-url"
                      type="url"
                      value={profileImageUrl}
                      onChange={(e) => setProfileImageUrl(e.target.value)}
                      placeholder="https://example.com/your-image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">ユーザー名</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">プロフィールを更新</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>パスワードを更新</CardTitle>
                <CardDescription>現在のパスワードと新しいパスワードを入力してください。</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">現在のパスワード</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">新しいパスワード</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-new-password">新しいパスワード（確認）</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">パスワードを更新</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 