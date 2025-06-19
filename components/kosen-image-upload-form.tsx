'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';

interface ImageUploadFormProps {
  kosenId: string;
  user: { username: string; email: string; role?: 'admin' | 'user' } | null;
}

export function ImageUploadForm({ kosenId, user }: ImageUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // You can add file size/type validation here
      setSelectedFile(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast({
        title: 'ファイルが選択されていません',
        description: 'アップロードする画像を選択してください。',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('kosenImage', selectedFile);
    formData.append('kosenId', kosenId);

    try {
      const res = await fetch('/api/kosen/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast({
          title: 'アップロード成功',
          description: '画像が投稿されました。管理者の承認をお待ちください。',
        });
        setSelectedFile(null);
        setPreviewImageUrl(null);
      } else {
        const errorData = await res.json();
        toast({
          title: 'アップロードに失敗しました',
          description: errorData.message || '不明なエラーが発生しました。',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'アップロード中にエラーが発生しました',
        description: 'ネットワーク接続を確認するか、後で再試行してください。',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <LogIn className="h-6 w-6" />
                    ログインが必要です
                </CardTitle>
                <CardDescription>画像を投稿するには、ログインまたは新規登録をしてください。</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/login">ログインページへ</Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="kosen-image-upload">画像ファイル</Label>
        <Input
          id="kosen-image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <p className="text-sm text-muted-foreground mt-1">PNG, JPG, GIFなどの画像ファイルを選択してください。</p>
      </div>
      {previewImageUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">プレビュー:</p>
          <img src={previewImageUrl} alt="プレビュー画像" className="max-w-xs rounded-md" />
        </div>
      )}
      <Button type="submit" disabled={isUploading || !selectedFile} className="w-full">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            アップロード中...
          </>
        ) : (
          'この画像を投稿する'
        )}
      </Button>
    </form>
  );
} 