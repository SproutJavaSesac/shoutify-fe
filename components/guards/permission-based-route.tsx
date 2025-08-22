"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import type { RoleType } from "@/types/auth";
import { AlertTriangle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

interface PermissionBasedRouteProps {
  children: ReactNode;
  /**
   * 권한 체크 함수 - true를 반환하면 접근 허용
   */
  hasPermission: (user: any, roleType?: RoleType) => boolean;
  /**
   * 권한이 없을 때 표시할 메시지
   */
  deniedMessage?: string;
  /**
   * 권한이 없을 때 리다이렉트할 경로
   */
  redirectPath?: string;
  /**
   * 로딩 컴포넌트
   */
  loadingComponent?: ReactNode;
}

export function PermissionBasedRoute({
  children,
  hasPermission,
  deniedMessage = "이 페이지에 접근할 권한이 없습니다.",
  redirectPath = "/",
  loadingComponent,
}: PermissionBasedRouteProps) {
  const { isAuthenticated, user, loading, roleType } = useAuth();
  const router = useRouter();

  const userHasPermission = user ? hasPermission(user, roleType) : false;

  useEffect(() => {
    if (!loading) {
      // 로그인되지 않은 경우
      if (!isAuthenticated || !user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_redirect_url", window.location.pathname);
        }
        router.push(redirectPath);
      }
      // 로그인은 되었지만 권한이 없는 경우
      else if (!userHasPermission) {
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, user, loading, userHasPermission, router, redirectPath]);

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
              이 페이지에 접근하려면 로그인해야 합니다.
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

  // 권한이 없는 경우
  if (!userHasPermission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              접근 권한이 없습니다
            </h2>
            <p className="text-gray-600 mb-4">{deniedMessage}</p>
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

  // 권한이 있는 경우 컨텐츠 렌더링
  return <>{children}</>;
}
