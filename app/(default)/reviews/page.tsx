'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquarePlus, Search, RotateCcw, SlidersHorizontal, ChevronDown, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { kosenList } from '@/lib/kosen-data';
import Image from 'next/image';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Review {
  _id: string;
  kosenId: string;
  username: string;
  profileImageUrl?: string;
  year: number;
  department: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
}

const kosenNameMap = kosenList.reduce((acc, kosen) => {
  acc[kosen.id] = kosen.name;
  return acc;
}, {} as Record<string, string>);

const departments = ['情報', '機械', '電気', '物質', '建築', 'その他'];

const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [kosen, setKosen] = useState(searchParams.get('kosenId') || '');
  const [department, setDepartment] = useState(searchParams.get('department') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  }, [searchParams]);

  const handleSearch = () => {
    let query = '';
    query = createQueryString('kosenId', kosen);
    const finalParams = new URLSearchParams(query);
    if(department) finalParams.set('department', department);
    if(minRating) finalParams.set('rating', minRating);

    router.push(`/reviews?${finalParams.toString()}`);
    setIsOpen(false); // 検索実行後に閉じる
  };

  const handleReset = () => {
    router.push('/reviews');
  };
  
  // フィルターが適用されているかどうかの判定
  const hasActiveFilters = kosen || department || minRating;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-8"
    >
      <div className="flex justify-end">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mb-4 border-gray-300 text-gray-700 hover:bg-gray-100">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
             {hasActiveFilters ? '絞り込み中' : '絞り込み'}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Card className="p-6 bg-slate-50 border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">高専</label>
              <Select value={kosen} onValueChange={setKosen}>
                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="すべての高専" /></SelectTrigger>
                <SelectContent>{kosenList.map(k => <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">学科</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="すべての学科" /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">評価</label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="評価を選択" /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(r => (
                    <SelectItem key={r} value={String(r)}>
                      <div className="flex items-center">{r} <Star className="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" /> 以上</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="w-full bg-blue-500 hover:bg-blue-600"><Search className="h-4 w-4 mr-2"/>検索</Button>
              <Button onClick={handleReset} variant="outline" className="bg-white"><RotateCcw className="h-4 w-4 mr-2"/>リセット</Button>
            </div>
          </div>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ReportMenu = ({ reviewId }: { reviewId: string }) => {
  const { toast } = useToast();

  const handleReport = async () => {
    if (!confirm('この体験談を不適切なコンテンツとして通報します。よろしいですか？')) {
      return;
    }

    try {
      const res = await fetch(`/api/reviews/${reviewId}/report`, {
        method: 'POST',
      });
      
      const data = await res.json();

      if (res.ok) {
        toast({
          title: "通報が完了しました",
          description: "ご協力ありがとうございます。管理者が内容を確認します。",
        });
      } else {
        toast({
          title: "エラー",
          description: data.error || "通報に失敗しました。",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "通報中に予期せぬエラーが発生しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleReport}>
          通報する
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ReviewCard = ({ review }: { review: Review }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col rounded-lg border border-gray-200">
    <CardHeader className="relative">
      <div className="absolute top-2 right-2">
        <ReportMenu reviewId={review._id} />
      </div>
      <div className="flex justify-between items-start">
        <div className="pr-8">
           <CardTitle className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer">
            <Link href={`/reviews/${review._id}`} className="stretched-link">
              {review.title}
            </Link>
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-1">
            {kosenNameMap[review.kosenId] || '不明'} / {review.department}科 / {review.year}年入学
          </CardDescription>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold flex-shrink-0">
          {review.rating.toFixed(1)}
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col">
       <div className="flex items-center mb-4">
        {review.profileImageUrl ? (
          <Image src={review.profileImageUrl.startsWith('http') ? review.profileImageUrl : `/api/images/${review.profileImageUrl}`} alt={review.username} width={40} height={40} className="rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            {review.username.charAt(0)}
          </div>
        )}
        <p className="ml-3 font-semibold text-gray-700">{review.username}</p>
      </div>
      <p className="text-gray-600 line-clamp-3 flex-grow">{review.content}</p>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card className="shadow-md rounded-lg border border-gray-200">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-16 w-full" />
    </CardContent>
  </Card>
)

const ReviewsPageContent = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        const res = await fetch(`/api/reviews?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [searchParams]);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
           <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-blue-600">
                高専体験談
              </h1>
              <p className="max-w-[700px] text-gray-600 md:text-lg">
                先輩たちのリアルな声を見てみよう。
              </p>
           </div>
          <Link href="/reviews/new" passHref>
            <Button className="bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg hover:shadow-xl transition-shadow shrink-0">
              <MessageSquarePlus className="mr-2 h-5 w-5" />
              体験談を投稿する
            </Button>
          </Link>
        </div>

        <SearchFilters />
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => <ReviewCard key={review._id} review={review} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border">
            <h3 className="text-2xl font-semibold text-gray-700">体験談がまだありません</h3>
            <p className="text-gray-500 mt-2">検索条件を変えるか、最初の体験談を投稿してみませんか？</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={
      <section className="w-full py-8 md:py-12 lg:py-16 bg-slate-50">
        <div className="container px-4 md:px-6 text-center">読み込み中...</div>
      </section>
    }>
      <ReviewsPageContent />
      <Toaster />
    </Suspense>
  );
} 