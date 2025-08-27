"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AlertTriangle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

interface OwnerOnlyRouteProps {
  children: ReactNode;
  /**
   * 리소스의 소유자 ID (작성자 ID 등)
   */
  ownerId: number;
  /**
   * 소유자가 아닐 때 표시할 리소스 이름 (예: "게시글", "댓글", "프로필")
   */
  resourceName?: string;
  /**
   * 권한이 없을 때 리다이렉트할 경로 (기본값: "/")
   */
  redirectPath?: string;
  /**
   * 로딩 중일 때 표시할 컴포넌트
   */
  loadingComponent?: ReactNode;
}

export function OwnerOnlyRoute({
  children,
  ownerId,
  resourceName = "리소스",
  redirectPath = "/",
  loadingComponent,
}: OwnerOnlyRouteProps) {
  const { isAuthenticated, user, loading, roleType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // 로그인되지 않은 경우
      if (!isAuthenticated || !user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_redirect_url", window.location.pathname);
        }
        router.push(redirectPath);
      }
      // 로그인은 되었지만 본인이 아닌 경우 (단, 관리자는 예외)
      else if (user.id !== ownerId && roleType !== "ADMIN") {
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, user, loading, ownerId, roleType, router, redirectPath]);

  // 로딩 중일 때
  if (loading) {
    if (loadingComponent) return <>{loadingComponent}</>;

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
              이 {resourceName}에 접근하려면 로그인해야 합니다.
            </p>
            <Button
              onClick={() => router.push(redirectPath)}
              className="w-full"
            >
              홈으로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 본인이 아니고 관리자도 아닌 경우
  if (user.id !== ownerId && roleType !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Lock className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              접근 권한이 없습니다
            </h2>
            <p className="text-gray-600 mb-2">
              이 {resourceName}은 작성자만 접근할 수 있습니다.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              소유자 ID: {ownerId} | 현재 사용자 ID: {user.id}
            </p>
            <Button
              onClick={() => router.push(redirectPath)}
              className="w-full"
            >
              돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 본인이거나 관리자인 경우 컨텐츠 렌더링
  return <>{children}</>;
}
