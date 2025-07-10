'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeOverlay({ isOpen, onClose }: WelcomeOverlayProps) {
  const clearFlag = async () => {
    try {
      await fetch('/api/user/clear-moderator-welcome', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to clear moderator welcome flag:', error);
    }
  };

  const handleContinue = () => {
    clearFlag();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleContinue()}>
      <DialogContent 
        className="sm:max-w-md text-center" 
        onPointerDownOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            モデレーター昇格おめでとうございます！
          </DialogTitle>
          <DialogDescription className="text-md text-muted-foreground pt-2">
            コミュニティの発展へのご協力に心より感謝いたします。あなたの力で、このコミュニティをさらに素晴らしい場所にしていきましょう。
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-4">
          (このメッセージは初回ログイン時のみ表示されます)
        </p>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleContinue} size="lg">
            続ける
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 