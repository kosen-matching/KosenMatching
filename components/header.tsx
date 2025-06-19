'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AccountSettingsDialog from './account-settings-dialog';

export default function Header() {
  const [user, setUser] = useState<{ username: string; email: string; profileImageUrl?: string; role?: 'admin' | 'user' } | null>(null);
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
            <div className="relative h-14 w-56">
              <Image 
                src="/images/logo.png" 
                alt="高専マッチング ロゴ" 
                fill
                className="object-contain"
              />
            </div>
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
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-screen max-w-xs md:max-w-none p-4 bg-blue-50">
              <nav className="flex flex-col items-start gap-4">
                <DropdownMenuItem asChild>
                  <Link
                    href="/find-kosen"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    高専を探す
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    適性診断
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    体験談
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/direct-question"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    直接質問
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="#"
                    className="text-lg font-medium hover:text-theme-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    よくある質問
                  </Link>
                </DropdownMenuItem>
              </nav>
              <DropdownMenuSeparator className="my-4" />
              <div className="flex flex-col gap-4">
                {loading ? (
                  <DropdownMenuItem>Loading...</DropdownMenuItem>
                ) : user ? (
                  <>
                    <DropdownMenuItem className="flex items-center gap-3 mb-2 px-2 py-1.5 cursor-default hover:bg-transparent focus:bg-transparent active:bg-transparent focus:text-current">
                      {user.profileImageUrl ? (
                        <Image
                          key={user.profileImageUrl}
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
                        <p className="text-base font-medium hover:underline">{user.username}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
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
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
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
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="border-theme-primary text-theme-primary hover:bg-theme-primary/10 w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/login">ログイン</Link>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button
                        asChild
                        size="sm"
                        className="bg-theme-primary hover:bg-theme-primary/90 text-white w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/signup">新規登録</Link>
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 pr-2">
                  {user.profileImageUrl ? (
                    <Image
                      key={user.profileImageUrl}
                      src={`/api/images/${user.profileImageUrl}`}
                      alt="プロフィール画像"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-default focus:bg-transparent">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsAccountSettingsDialogOpen(true)}>
                  アカウント設定
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-theme-primary text-theme-primary hover:bg-theme-primary/10"
              >
                <Link href="/login">ログイン</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-theme-primary hover:bg-theme-primary/90 text-white"
              >
                <Link href="/signup">新規登録</Link>
              </Button>
            </>
          )}
        </div>
        <AccountSettingsDialog
          isOpen={isAccountSettingsDialogOpen}
          onClose={() => setIsAccountSettingsDialogOpen(false)}
          user={user}
          onUpdateProfile={(updatedUser) => setUser(updatedUser)}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
} 