"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";
import { Loader2, PenTool } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/*로딩 헤더*/}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-3">
              <PenTool className="h-8 w-8 text-green-500" />
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                인증을 확인하는 중...
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                로그인 상태를 확인하고 있습니다
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-600 mb-6">
              이 페이지에 접근하려면 로그인해 주세요.
            </p>
          </div>
        )}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return <>{children}</>;
}
