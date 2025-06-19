'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { User, Link as LinkIcon, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

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

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryImage | null;
  onDelete?: (fileId: string) => void;
  totalImages: number;
  currentImageIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  image,
  onDelete,
  totalImages,
  currentImageIndex,
  onNext,
  onPrevious,
}: ImagePreviewModalProps) {
  if (!isOpen || !image) return null;

  const handleImageDelete = () => {
    if (image.fileId && onDelete) {
      if (confirm('本当にこの画像を削除しますか？この操作は取り消せません。')) {
        onDelete(image.fileId);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 sm:p-0">
        <div className="relative aspect-[16/9] w-full">
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            className="object-contain"
          />
           {totalImages > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
                onClick={onPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
                onClick={onNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          <div className="absolute bottom-2 right-1/2 translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1} / {totalImages}
          </div>
        </div>
        <div className="p-4 flex items-center justify-between gap-4 text-sm text-muted-foreground bg-background">
          <div className="flex flex-col gap-1 overflow-hidden">
            {image.uploaderName && (
              <p className="flex items-center gap-2 truncate">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  Posted by <strong>{image.uploaderName}</strong>
                </span>
              </p>
            )}
            {image.credit?.url && image.credit?.text && (
              <p className="flex items-center gap-2 truncate">
                <LinkIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  Source:{' '}
                  <Link href={image.credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                    {image.credit.text}
                  </Link>
                </span>
              </p>
            )}
          </div>
          {onDelete && image.fileId && (
            <Button variant="destructive" size="sm" onClick={handleImageDelete} className="flex-shrink-0">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 