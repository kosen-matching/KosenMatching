'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ThumbsUp, ThumbsDown, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { kosenList } from '@/lib/kosen-data';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface User {
    username: string;
    profileImageUrl?: string;
}

interface Review {
  _id: string;
  kosenId: string;
  userId: string;
  user?: User; // APIから取得したユーザー情報
  year: number;
  department: string;
  title: string;
  content: string;
  rating: number;
  pros: string;
  cons: string;
  createdAt: string;
}

const kosenNameMap = kosenList.reduce((acc, kosen) => {
  acc[kosen.id] = kosen.name;
  return acc;
}, {} as Record<string, string>);

const LoadingSkeleton = () => (
    <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto max-w-4xl">
            <Card className="overflow-hidden shadow-2xl">
                 <div className="p-8 bg-gray-200 animate-pulse">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-24" />
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_,i) => <Skeleton key={i} className="h-6 w-6 rounded-full" />)}
                        </div>
                    </div>
                    <Skeleton className="h-10 w-3/4 mt-4" />
                    <div className="flex items-center mt-6">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-4 space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                </div>
                <CardContent className="p-8 bg-white">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Skeleton className="h-7 w-40" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                         <div className="space-y-4">
                            <Skeleton className="h-7 w-40" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                    <Separator className="my-8" />
                     <div>
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
)


export default function ReviewDetailPage({ params }: { params: { id: string } }) {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const fetchReview = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/reviews/${params.id}`);
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || '体験談の読み込みに失敗しました。');
          }
          const data = await res.json();
          setReview(data.data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchReview();
    }
  }, [params.id]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="container mx-auto py-10 text-center text-red-500">{error}</div>;
  if (!review) return <div className="container mx-auto py-10 text-center">体験談が見つかりませんでした。</div>;

  const kosenName = kosenNameMap[review.kosenId] || '不明な高専';
  const profileImageUrl = review.user?.profileImageUrl;
  const username = review.user?.username || '匿名ユーザー';


  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-4xl">
        <Card className="overflow-hidden shadow-2xl rounded-2xl">
          <div className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
             <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-sm bg-white/20 text-white backdrop-blur-sm border-0">{kosenName}</Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 transition-all duration-300 ${i < review.rating ? 'text-yellow-300 fill-yellow-300' : 'text-blue-300/50'}`} />
                  ))}
                </div>
            </div>
            <h1 className="text-4xl font-bold mt-4 drop-shadow-md">{review.title}</h1>
            <div className="flex items-center mt-6">
              {profileImageUrl ? (
                <Image src={profileImageUrl.startsWith('http') ? profileImageUrl : `/api/images/${profileImageUrl}`} alt={username} width={48} height={48} className="rounded-full object-cover border-2 border-white/50" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/50">
                  <UserIcon className="h-6 w-6"/>
                </div>
              )}
              <div className="ml-4">
                <p className="font-semibold text-lg">{username}</p>
                <p className="text-sm opacity-80">{review.year}年入学 / {review.department}科</p>
              </div>
            </div>
          </div>
          <CardContent className="p-8 bg-white">
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h3 className="flex items-center text-xl font-bold text-green-600"><ThumbsUp className="mr-2"/> 良かった点</h3>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200 prose max-w-none text-gray-700">
                    <p>{review.pros}</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="flex items-center text-xl font-bold text-red-600"><ThumbsDown className="mr-2"/> 微妙だった点</h3>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 prose max-w-none text-gray-700">
                    <p>{review.cons}</p>
                  </div>
               </div>
            </div>
            
            <Separator className="my-8" />

            <div>
               <h3 className="text-2xl font-bold mb-4 text-gray-800">自由記述</h3>
               <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  <p>{review.content}</p>
               </div>
            </div>

            <div className="text-right text-sm text-gray-400 mt-8">
              投稿日: {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 