'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
import AccountSettingsDialog from './account-settings-dialog';

export default function Header() {
  const [user, setUser] = useState<{ username: string; email: string; profileImageUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountSettingsDialogOpen, setIsAccountSettingsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
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
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setUser(null);
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-2">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="高専マッチング ロゴ" 
              width={224}
              height={56}
              className="h-14 w-auto"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/find-kosen" className="text-sm font-medium hover:text-theme-primary">
            高専を探す
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-theme-primary">
            適性診断
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-theme-primary">
            体験談
          </Link>
          <Link href="/direct-question" className="text-sm font-medium hover:text-theme-primary">
            直接質問
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-theme-primary">
            よくある質問
          </Link>
        </nav>
        <div className="md:hidden flex items-center">
          <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="fixed bottom-0 left-0 right-0 max-h-[96%] mt-24 rounded-t-[10px] flex flex-col">
              <div className="flex-1 overflow-auto p-4">
                <nav className="flex flex-col items-start gap-4">
                  <Link
                    href="/find-kosen"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    高専を探す
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    適性診断
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    体験談
                  </Link>
                  <Link
                    href="/direct-question"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    直接質問
                  </Link>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    よくある質問
                  </Link>
                </nav>
                <div className="mt-8 flex flex-col gap-4">
                  {loading ? (
                    <div>Loading...</div>
                  ) : user ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        {user.profileImageUrl ? (
                          <Image
                            src={`/api/images/${user.profileImageUrl}`}
                            alt="プロフィール画像"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-base font-medium">{user.username}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-theme-primary text-theme-primary hover:bg-theme-primary/10 w-full"
                        onClick={() => {
                          setIsAccountSettingsDialogOpen(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        アカウント設定
                      </Button>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white w-full"
                      >
                        ログアウト
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-theme-primary text-theme-primary hover:bg-theme-primary/10 w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/login">ログイン</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="bg-theme-primary hover:bg-theme-primary/90 text-white w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/signup">新規登録</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <>
              <div className="flex items-center gap-3">
                {user.profileImageUrl ? (
                  <Image
                    src={`/api/images/${user.profileImageUrl}`}
                    alt="プロフィール画像"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-theme-primary text-theme-primary hover:bg-theme-primary/10"
                onClick={() => setIsAccountSettingsDialogOpen(true)}
              >
                アカウント設定
              </Button>
              <Button onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                ログアウト
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:flex border-theme-primary text-theme-primary hover:bg-theme-primary/10"
              >
                <Link href="/login">ログイン</Link>
              </Button>
              <Button asChild size="sm" className="bg-theme-primary hover:bg-theme-primary/90 text-white">
                <Link href="/signup">新規登録</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <AccountSettingsDialog
        isOpen={isAccountSettingsDialogOpen}
        onClose={() => setIsAccountSettingsDialogOpen(false)}
        onProfileUpdateSuccess={setUser}
      />
    </header>
  );
} 