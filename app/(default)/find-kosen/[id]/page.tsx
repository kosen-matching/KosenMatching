'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ExternalLink, BookOpen, Info, Users, BarChart, MessageSquare, ImageOff, ShieldCheck, Camera, LogIn, GalleryHorizontal, ChevronLeft, ChevronRight, Trash2, Edit } from "lucide-react";
import { ImageUploadForm } from '@/components/kosen-image-upload-form';
import { Skeleton } from '@/components/ui/skeleton';
import { ImagePreviewModal } from '@/components/image-preview-modal';
import { useToast } from '@/components/ui/use-toast';
import { kosenList } from '@/lib/kosen-data';
import { Kosen } from '@/types/kosen';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ApprovedImage {
  _id: string;
  fileId: string;
  uploader?: {
    username: string;
  };
}

interface GalleryImage {
  src: string;
  alt: string;
  fileId?: string;
  uploaderName?: string;
  credit?: {
    text: string;
    url: string;
  };
}

const findKosenById = (id: string): Kosen | undefined => {
    return kosenList.find(k => k.id === id);
};

export default function KosenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const kosenId = params?.id as string;
  const kosen = findKosenById(kosenId);

  const [user, setUser] = useState<{ username: string; email: string; role?: 'admin' | 'user' } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [approvedImages, setApprovedImages] = useState<ApprovedImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableKosen, setEditableKosen] = useState<Kosen | null>(null);

  const galleryImages: GalleryImage[] = useMemo(() => {
    const images: GalleryImage[] = [];
    if (kosen?.imageUrl) {
      images.push({
        src: kosen.imageUrl,
        alt: `${kosen.name} 公式イメージ画像`,
        uploaderName: kosen.imageCreditText ? undefined : '公式',
        credit: kosen.imageCreditText && kosen.imageCreditUrl 
          ? { text: kosen.imageCreditText, url: kosen.imageCreditUrl } 
          : undefined,
      });
    }
    approvedImages.forEach(img => {
      images.push({
        src: `/api/images/${img.fileId}`,
        alt: `${kosen?.name}の投稿画像`,
        fileId: img.fileId,
        uploaderName: img.uploader?.username || '匿名ユーザー',
      });
    });
    return images;
  }, [kosen, approvedImages]);

  useEffect(() => {
    setMainImageIndex(0);

    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchApprovedImages = async () => {
      if (!kosenId) return;
      setLoadingImages(true);
      try {
        const res = await fetch(`/api/kosen/${kosenId}/images`);
        if (res.ok) {
          const data = await res.json();
          setApprovedImages(data);
        }
      } catch (error) {
        console.error('Failed to fetch approved images:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchUser();
    fetchApprovedImages();
  }, [kosenId]);

  useEffect(() => {
    if (kosen) {
      setEditableKosen(kosen);
    }
  }, [kosen]);

  const handleUpdateKosen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editableKosen) return;

    try {
      const res = await fetch(`/api/kosen/${kosenId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableKosen),
      });

      if (res.ok) {
        toast({
          title: '成功',
          description: '高専情報が更新されました。（現在は静的データのため永続化されません）',
        });
        setIsEditModalOpen(false);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || '更新に失敗しました。');
      }
    } catch (error: any) {
      toast({
        title: 'エラー',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async (fileId: string) => {
    if (!user || user.role !== 'admin') {
      toast({
        title: '権限がありません',
        description: '画像の削除は管理者のみ可能です。',
        variant: 'destructive',
      });
      return;
    }

    if (confirm('本当にこの画像を削除しますか？この操作は取り消せません。')) {
        try {
        const res = await fetch(`/api/images/${fileId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            toast({
            title: '成功',
            description: '画像が正常に削除されました。',
            });
            setApprovedImages(prev => prev.filter(img => img.fileId !== fileId));
            setIsPreviewOpen(false);
            setSelectedImage(null);
            setMainImageIndex(0);
        } else {
            const errorData = await res.json();
            throw new Error(errorData.message || '削除に失敗しました。');
        }
        } catch (error: any) {
        toast({
            title: 'エラー',
            description: error.message,
            variant: 'destructive',
        });
        }
    }
  };

  const handlePreviousImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };

  const handleModalNext = () => {
    const currentIndex = galleryImages.findIndex(img => img.src === selectedImage?.src);
    if (currentIndex > -1) {
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex]);
    }
  };

  const handleModalPrevious = () => {
    const currentIndex = galleryImages.findIndex(img => img.src === selectedImage?.src);
    if (currentIndex > -1) {
      const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex]);
    }
  };

  const openPreview = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsPreviewOpen(true);
  };

  if (!kosen) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
        <main className="flex-1 container mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-2xl font-bold">高専情報が見つかりません</h1>
          <p className="mt-2 text-muted-foreground">指定されたIDの高専は存在しないか、情報がありません。</p>
          <Button
            className="mt-6"
            onClick={() => router.push('/find-kosen')}
          >
            高専一覧へ戻る
          </Button>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-muted/40">
        <main className="flex-1 py-10 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
              <div className="md:col-span-2">
                <Card className="overflow-hidden elegant-card group">
                  {galleryImages.length > 0 ? (
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        key={galleryImages[mainImageIndex].src}
                        src={galleryImages[mainImageIndex].src}
                        alt={galleryImages[mainImageIndex].alt}
                        fill
                        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 cursor-pointer"
                        onClick={() => openPreview(galleryImages[mainImageIndex])}
                      />
                      {galleryImages.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
                            onClick={handlePreviousImage}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
                            onClick={handleNextImage}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </Button>
                        </>
                      )}
                       <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {mainImageIndex + 1} / {galleryImages.length}
                      </div>
                      {user?.role === 'admin' && galleryImages[mainImageIndex].fileId && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-9 w-9 opacity-80 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            if(galleryImages[mainImageIndex].fileId) {
                                handleDeleteImage(galleryImages[mainImageIndex].fileId!);
                            }
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-muted flex flex-col items-center justify-center">
                      <ImageOff className="h-16 w-16 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">画像はありません</p>
                    </div>
                  )}
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <CardTitle className="text-xl font-semibold">{kosen.name}</CardTitle>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kosen.type === '国立' ? 'bg-blue-100 text-blue-800' : kosen.type === '公立' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                        <ShieldCheck className="mr-1 h-3.5 w-3.5" /> 
                        {kosen.type}
                      </span>
                    </div>
                    <CardDescription className="flex items-center pt-1 text-sm">
                      <MapPin className="mr-1.5 h-4 w-4 text-muted-foreground" />
                      {kosen.location}
                    </CardDescription>
                  </CardHeader>
                  {user?.role === 'admin' && (
                    <CardFooter className="p-4 bg-muted/50">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          setEditableKosen(kosen);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        高専情報を編集する
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>

              <div className="md:col-span-3">
                 <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4 elegant-tabs-list">
                    <TabsTrigger value="overview"><Info className="mr-1.5 h-4 w-4" />概要</TabsTrigger>
                    <TabsTrigger value="departments"><BookOpen className="mr-1.5 h-4 w-4" />学科情報</TabsTrigger>
                    <TabsTrigger value="gallery"><GalleryHorizontal className="mr-1.5 h-4 w-4" />ギャラリー</TabsTrigger>
                    <TabsTrigger value="qna"><MessageSquare className="mr-1.5 h-4 w-4" />Q&A</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>高専の概要</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{kosen.description}</p>
                        <div className="flex justify-between items-center">
                            <a href={kosen.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center">
                                <ExternalLink className="mr-1 h-4 w-4" />
                                公式サイトを見る
                            </a>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="departments">
                    <Card>
                      <CardHeader>
                        <CardTitle>設置学科</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            {kosen.departments?.map((dept, index) => <li key={index}>{dept}</li>)}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                   <TabsContent value="gallery">
                    <Card>
                       <CardHeader>
                        <CardTitle>ギャラリー</CardTitle>
                        <CardDescription>
                          この高専の公式画像や、ユーザーから投稿された写真を見ることができます。
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingImages ? (
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Skeleton key={i} className="aspect-square w-full" />
                            ))}
                          </div>
                        ) : galleryImages.length > 0 ? (
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {galleryImages.map((img, index) => (
                              <div
                                key={index}
                                className="relative aspect-square cursor-pointer group"
                                onClick={() => openPreview(img)}
                              >
                                <Image
                                  src={img.src}
                                  alt={img.alt}
                                  fill
                                  className="object-cover rounded-md transition-opacity group-hover:opacity-75"
                                />
                                {user?.role === 'admin' && img.fileId && (
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteImage(img.fileId!);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <ImageOff className="mx-auto h-12 w-12 mb-2" />
                            <p>まだ画像がありません。</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>画像を投稿して共有する</CardTitle>
                        <CardDescription>この高専の写真や動画を投稿して、みんなに魅力を伝えましょう。</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingUser ? <Skeleton className="h-24 w-full" /> : <ImageUploadForm kosenId={kosen.id} user={user} />}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="qna">
                    <Card>
                      <CardHeader>
                        <CardTitle>Q&A</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Q&A機能は現在準備中です。</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
      {selectedImage && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          image={selectedImage}
          onDelete={user?.role === 'admin' && selectedImage.fileId ? handleDeleteImage : undefined}
          totalImages={galleryImages.length}
          currentImageIndex={galleryImages.findIndex(img => img.src === selectedImage.src)}
          onNext={handleModalNext}
          onPrevious={handleModalPrevious}
        />
      )}

      {editableKosen && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>高専情報の編集</DialogTitle>
              <DialogDescription>
                {kosen.name}の情報を編集します。変更は現在の表示にのみ反映されます。
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateKosen}>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">学校名</Label>
                  <Input id="name" value={editableKosen.name} onChange={(e) => setEditableKosen({...editableKosen, name: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">所在地</Label>
                  <Input id="location" value={editableKosen.location} onChange={(e) => setEditableKosen({...editableKosen, location: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right">ウェブサイト</Label>
                  <Input id="website" value={editableKosen.website} onChange={(e) => setEditableKosen({...editableKosen, website: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">説明</Label>
                  <Textarea id="description" value={editableKosen.description || ''} onChange={(e) => setEditableKosen({...editableKosen, description: e.target.value})} className="col-span-3" rows={5} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">画像URL</Label>
                  <Input id="imageUrl" value={editableKosen.imageUrl || ''} onChange={(e) => setEditableKosen({...editableKosen, imageUrl: e.target.value})} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departments" className="text-right">学科</Label>
                  <Textarea id="departments" value={editableKosen.departments?.join(', ') || ''} onChange={(e) => setEditableKosen({...editableKosen, departments: e.target.value.split(',').map(s => s.trim())})} className="col-span-3" rows={3} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">キャンセル</Button>
                </DialogClose>
                <Button type="submit">更新</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}