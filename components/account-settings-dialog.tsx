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
import Link from 'next/link';

interface AccountSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username: string; email: string; profileImageUrl?: string; role?: 'admin' | 'user' } | null;
  onUpdateProfile: (updatedUser: { username: string; email: string; profileImageUrl?: string }) => void; // プロフィール更新成功時のコールバック
  onLogout: () => Promise<void>; // ログアウト関数を追加
}

export default function AccountSettingsDialog({ isOpen, onClose, user, onUpdateProfile, onLogout }: AccountSettingsDialogProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(''); // GridFSのファイルIDを保存
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 選択されたファイル
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null); // 選択されたファイルのプレビュー用URL
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen || !user) return; // ダイアログが閉じているかユーザー情報がない場合は何もしない

    setUsername(user.username);
    setEmail(user.email);
    setProfileImageUrl(user.profileImageUrl || '');
  }, [isOpen, user]); // isOpenとuserが変更されたら実行

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    let newProfileImageUrl = profileImageUrl;

    try {
      if (selectedFile) {
        // ファイルが選択されている場合、まずGridFSにアップロード
        const formData = new FormData();
        formData.append('profileImage', selectedFile);

        const uploadRes = await fetch('/api/account/upload-profile-image', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          toast({
            title: '画像のアップロードに失敗しました', 
            description: errorData.message || '不明なエラーが発生しました。',
            variant: 'destructive'
          });
          return;
        }
        const uploadData = await uploadRes.json();
        newProfileImageUrl = uploadData.fileId; // アップロードされたファイルのIDを取得
      } else if (profileImageUrl === '' && user?.profileImageUrl) {
        // 画像がクリアされた場合
        newProfileImageUrl = '';
      }

      const res = await fetch('/api/account/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, profileImageUrl: newProfileImageUrl }), // GridFSのファイルIDを送信
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        // ユーザー情報を更新し、親コンポーネントにも通知
        onUpdateProfile(data.user);
        setSelectedFile(null); // ファイルアップロード成功後、選択されたファイルをクリア
        setPreviewImageUrl(null); // プレビューもクリア
        setProfileImageUrl(data.user.profileImageUrl || ''); // 最新のGridFSファイルIDをセット
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
        {user ? (
          <div className="grid gap-4 py-4">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>プロフィールを更新</CardTitle>
                <CardDescription>ユーザー名、メールアドレス、プロフィール画像を変更します。</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="flex flex-col items-center gap-4 mb-4">
                    {previewImageUrl ? (
                      <img src={previewImageUrl} alt="プレビュー画像" className="w-24 h-24 rounded-full object-cover" />
                    ) : profileImageUrl ? (
                      <img src={`/api/images/${profileImageUrl}`} alt="プロフィール画像" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <Label htmlFor="profile-image-upload">プロフィール画像をアップロード</Label>
                    <Input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          setPreviewImageUrl(URL.createObjectURL(e.target.files[0])); // プレビュー用URLをセット
                        } else {
                          setSelectedFile(null);
                          setPreviewImageUrl(null);
                        }
                      }}
                    />
                    {(selectedFile || profileImageUrl) && ( // 選択中のファイルがあるか、既存の画像がある場合に表示
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewImageUrl(null); // プレビューをクリア
                          setProfileImageUrl(''); // GridFSのファイルIDをクリア (データベースから削除は別途APIが必要)
                        }}
                        className="w-full text-red-500 hover:text-red-600"
                      >
                        画像をクリア
                      </Button>
                    )}
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
                  <Button type="submit" className="w-full bg-theme-primary hover:bg-theme-primary/90">
                    プロフィールを更新
                  </Button>
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
                    <Label htmlFor="confirm-new-password">新しいパスワード（確認用）</Label>
                    <Input
                      id="confirm-new-password"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-theme-primary hover:bg-theme-primary/90">
                    パスワードを更新
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              ログアウト
            </Button>
          </div>
        ) : (
          <div className="text-center text-red-500">ユーザー情報を読み込めませんでした。ログインしてください。</div>
        )}
      </DialogContent>
    </Dialog>
  );
} 