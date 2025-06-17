"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";
import { UserMenu } from "@/components/user-menu";

export function Navigation() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="h-8 w-8 text-gray-800" />
            <span className="text-xl font-bold text-gray-900">Shoutify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/posts"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/ranking"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Ranking
            </Link>
            <Link
              href="/my-page"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              My Page
            </Link>
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <>
                <Link href="/posts/write">
                  <Button className="bg-gray-800 hover:bg-gray-900">
                    Write
                  </Button>
                </Link>
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
                  <Link href="/posts" className="text-lg font-medium">
                    Posts
                  </Link>
                  <Link href="/ranking" className="text-lg font-medium">
                    Ranking
                  </Link>
                  {user ? (
                    <>
                      <Link href="/my-page" className="text-lg font-medium">
                        My Page
                      </Link>
                      <Link href="/posts/write" className="text-lg font-medium">
                        Write
                      </Link>
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
