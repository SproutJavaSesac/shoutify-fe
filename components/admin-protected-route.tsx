"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AlertTriangle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, user, loading, roleType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // 로그인되지 않은 경우 현재 페이지를 리다이렉트 URL로 저장하고 홈으로 이동
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_redirect_url", window.location.href);
      }
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">권한을 확인하고 있습니다...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-600 mb-4">
              관리자 페이지에 접근하려면 로그인해야 합니다.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              홈으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 관리자 권한이 없는 경우
  if (roleType !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              접근 권한이 없습니다
            </h2>
            <p className="text-gray-600 mb-2">
              관리자 권한이 필요한 페이지입니다.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              현재 권한: {roleType || "USER"}
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              홈으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 관리자 권한이 있는 경우 컨텐츠 렌더링
  return <>{children}</>;
}
