"use client";

import {
  AlertTriangle,
  ArrowLeft,
  FileQuestion,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PostDetailErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  // 404나 권한 관련 에러인지 확인
  const isNotFound =
    error.message?.includes("404") || error.message?.includes("Not Found");
  const isUnauthorized =
    error.message?.includes("401") || error.message?.includes("Unauthorized");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <FileQuestion className="h-16 w-16 text-purple-500" />
              <AlertTriangle className="absolute -top-2 -right-2 h-8 w-8 text-red-500 bg-white dark:bg-gray-900 rounded-full p-1" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isNotFound
                ? "게시글을 찾을 수 없습니다"
                : isUnauthorized
                  ? "접근 권한이 없습니다"
                  : "게시글을 불러올 수 없습니다"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isNotFound
                ? "요청하신 게시글이 존재하지 않거나 삭제되었습니다."
                : isUnauthorized
                  ? "이 게시글을 볼 수 있는 권한이 없습니다."
                  : "게시글 데이터를 가져오는 중에 문제가 발생했습니다."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {isNotFound
                ? "게시글 목록에서 다른 게시글을 확인해 보세요."
                : isUnauthorized
                  ? "로그인 상태를 확인해 주세요."
                  : "잠시 후 다시 시도하거나 게시글 목록으로 돌아가 주세요."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {!isNotFound && (
            <Button onClick={reset} className="w-full" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => router.push("/posts")}
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            게시글 목록으로
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <details>
              <summary className="cursor-pointer text-sm font-medium text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100">
                Post Detail 에러 디버그 정보
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                    에러:
                  </p>
                  <p className="text-sm text-purple-800 dark:text-purple-200 font-mono">
                    {error.message}
                  </p>
                </div>
                {error.digest && (
                  <div>
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                      Digest:
                    </p>
                    <p className="text-sm font-mono text-purple-700 dark:text-purple-300">
                      {error.digest}
                    </p>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
