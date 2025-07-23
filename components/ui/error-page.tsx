"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
}

export function ErrorPage({
  title = "오류가 발생했습니다",
  message = "일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  onRetry,
  showHomeButton = true,
  showRetryButton = true,
}: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          <div className="flex justify-center space-x-2">
            {showRetryButton && onRetry && (
              <Button variant="outline" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                다시 시도
              </Button>
            )}

            {showHomeButton && (
              <Button onClick={() => router.push("/")}>
                <Home className="h-4 w-4 mr-2" />
                홈으로 가기
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 특화된 에러 컴포넌트들
export function PostCreationError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      title="게시글 작성 실패"
      message="게시글을 작성할 수 없습니다. 입력한 내용을 확인하고 다시 시도해주세요."
      onRetry={onRetry}
    />
  );
}

export function CommentError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      title="댓글 로드 실패"
      message="댓글을 불러올 수 없습니다."
      onRetry={onRetry}
      showHomeButton={false}
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      title="네트워크 오류"
      message="네트워크 연결을 확인하고 다시 시도해주세요."
      onRetry={onRetry}
    />
  );
}
