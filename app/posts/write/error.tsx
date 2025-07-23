"use client";

import { AlertTriangle, ArrowLeft, PenOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WriteErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <PenOff className="h-16 w-16 text-red-500" />
              <AlertTriangle className="absolute -top-2 -right-2 h-8 w-8 text-orange-500 bg-white dark:bg-gray-900 rounded-full p-1" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              게시글 작성을 시작할 수 없습니다
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              게시글 작성 페이지를 불러오는 중에 문제가 발생했습니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              로그인 상태를 확인하거나 잠시 후 다시 시도해 주세요.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            페이지 새로고침
          </Button>

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
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <details>
              <summary className="cursor-pointer text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100">
                Write 페이지 에러 디버그 정보
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    에러:
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                    {error.message}
                  </p>
                </div>
                {error.digest && (
                  <div>
                    <p className="text-xs font-medium text-red-600 dark:text-red-400">
                      Digest:
                    </p>
                    <p className="text-sm font-mono text-red-700 dark:text-red-300">
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
