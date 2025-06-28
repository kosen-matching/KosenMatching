'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, LogIn, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AccountSettingsDialog from './account-settings-dialog';
import WelcomeOverlay from './WelcomeOverlay';

export default function Header() {
  const [user, setUser] = useState<{ username: string; email: string; profileImageUrl?: string; role?: 'admin' | 'user'; showModeratorWelcome?: boolean; } | null>(null);
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

  const handleCloseWelcomeOverlay = () => {
    setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, showModeratorWelcome: false };
    });
  };

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

  const navLinkClasses = "text-sm font-medium transition-colors hover:text-theme-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-theme-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100";
  const buttonBaseClasses = "transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg";

  return (
    <>
      {user?.showModeratorWelcome && (
        <WelcomeOverlay
          isOpen={user.showModeratorWelcome}
          onClose={handleCloseWelcomeOverlay}
        />
      )}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-16 w-64">
                <Image 
                  src="/images/logo.png" 
                  alt="高専マッチング ロゴ" 
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>
          <nav className="hidden sp:flex items-center gap-6">
            <Link href="/find-kosen" className={navLinkClasses}>
              高専を探す
            </Link>
            <Link href="/diagnosis" className={navLinkClasses}>
              高専マッチ
            </Link>
            <Link href="/reviews" className={navLinkClasses}>
              体験談
            </Link>
            <Link href="/direct-question" className={navLinkClasses}>
              直接質問
            </Link>
            <Link href="#" className={navLinkClasses}>
              よくある質問
            </Link>
          </nav>
          <div className="sp:hidden flex items-center">
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="sp:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-screen max-w-xs sp:max-w-none p-4 bg-background border-none shadow-xl rounded-2xl">
                <nav className="flex flex-col items-start gap-4">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/find-kosen"
                      className="text-lg font-medium hover:text-theme-primary w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      高専を探す
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/diagnosis"
                      className="text-lg font-medium hover:text-theme-primary w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      高専マッチ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/reviews"
                      className="text-lg font-medium hover:text-theme-primary w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      体験談
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/direct-question"
                      className="text-lg font-medium hover:text-theme-primary w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      直接質問
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="#"
                      className="text-lg font-medium hover:text-theme-primary w-full"
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
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-theme-primary"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg border-2 border-theme-primary">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-base font-medium">{user.username}</p>
                          <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button
                          variant="outline"
                          className={`${buttonBaseClasses} rounded-full border-theme-primary text-theme-primary hover:bg-theme-primary/10 w-full`}
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
                          className={`${buttonBaseClasses} rounded-full bg-red-500 hover:bg-red-600 text-white w-full`}
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
                          className={`${buttonBaseClasses} rounded-full border-theme-primary text-theme-primary hover:bg-theme-primary/10 w-full`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/login" className="flex items-center justify-center gap-2">
                            <LogIn size={16} />
                            <span>ログイン</span>
                          </Link>
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button
                          asChild
                          className={`${buttonBaseClasses} rounded-full bg-theme-primary hover:bg-theme-primary/90 text-white w-full`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/signup" className="flex items-center justify-center gap-2">
                            <UserPlus size={16} />
                            <span>新規登録</span>
                          </Link>
                        </Button>
                      </DropdownMenuItem>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden sp:flex items-center gap-4">
            {loading ? (
              <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`${buttonBaseClasses} flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-muted`}>
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
                <DropdownMenuContent align="end" className="w-56 mt-2 p-2 bg-background border-none shadow-xl rounded-2xl">
                  <DropdownMenuItem className="p-2 cursor-default focus:bg-transparent">
                    <div className="flex items-center gap-3">
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
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setIsAccountSettingsDialogOpen(true)} className="p-2 cursor-pointer rounded-lg">
                    アカウント設定
                  </DropdownMenuItem>
                   {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="p-2 cursor-pointer rounded-lg">
                        管理者ダッシュボード
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout} className="text-red-500 p-2 cursor-pointer focus:bg-red-500/10 focus:text-red-500 rounded-lg">
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="outline" className={`${buttonBaseClasses} rounded-full border-theme-primary text-theme-primary hover:bg-theme-primary/10`}>
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn size={16} className="mr-2" />
                    ログイン
                  </Link>
                </Button>
                <Button asChild className={`${buttonBaseClasses} rounded-full bg-theme-primary hover:bg-theme-primary/90 text-white`}>
                  <Link href="/signup" className="flex items-center gap-2">
                    <UserPlus size={16} className="mr-2" />
                    新規登録
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
         <AccountSettingsDialog 
          isOpen={isAccountSettingsDialogOpen}
          onClose={() => setIsAccountSettingsDialogOpen(false)}
          user={user}
          onUpdateProfile={(updatedUser: { username: string; email: string; profileImageUrl?: string; }) => setUser(prev => prev ? { ...prev, ...updatedUser } : null)}
          onLogout={handleLogout}
        />
      </header>
    </>
  );
} 