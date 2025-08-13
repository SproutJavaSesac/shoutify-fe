"use client";

import { AuthModal } from "@/components/auth-modal";
import { PostWriteButton } from "@/components/commons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "@/components/user-menu";
import { MEMBER_ROUTES } from "@/constants/members";
import { POST_ROUTES } from "@/constants/posts";
import { RANKING_ROUTES } from "@/constants/rankings";
import { useAuth } from "@/lib/auth";
import { Menu, PenTool } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading, roleType } = useAuth();
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="h-8 w-8 text-gray-800" />
            <span className="text-xl font-bold text-gray-900">구절구절</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={POST_ROUTES.LIST}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              게시글 목록
            </Link>
            <Link
              href={RANKING_ROUTES.LIST}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              랭킹
            </Link>
            {roleType === "ADMIN" && (
              <Link
                href="/admin"
                className="text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                관리자
              </Link>
            )}
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <>
                <PostWriteButton
                  onClick={() => router.push(POST_ROUTES.CREATE)}
                  className="bg-gray-800 hover:bg-gray-900"
                >
                  글 쓰기
                </PostWriteButton>
                <UserMenu />
              </>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gray-800 hover:bg-gray-900"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href={POST_ROUTES.LIST} className="text-lg font-medium">
                    Posts
                  </Link>
                  <Link
                    href={RANKING_ROUTES.LIST}
                    className="text-lg font-medium"
                  >
                    Ranking
                  </Link>
                  {user ? (
                    <>
                      <Link
                        href={MEMBER_ROUTES.MY_PAGE}
                        className="text-lg font-medium"
                      >
                        My Page
                      </Link>
                      <PostWriteButton
                        onClick={() => router.push(POST_ROUTES.CREATE)}
                        className="text-lg font-medium bg-transparent hover:bg-gray-100 text-gray-900 p-0 justify-start h-auto"
                        variant="ghost"
                      >
                        Write
                      </PostWriteButton>
                      {roleType === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="text-lg font-medium text-red-600"
                        >
                          관리자
                        </Link>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsAuthModalOpen(true)}
                      variant="outline"
                      className="justify-start"
                    >
                      Sign In
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
