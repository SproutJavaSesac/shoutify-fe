"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 개발 환경에서 콘솔에 에러 로그 출력
    if (process.env.NODE_ENV === "development") {
      console.error("페이지 오류 발생:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <AlertCircle className="h-20 w-20 text-red-500" />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xs font-bold">
                  !
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              오류가 발생했습니다
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              페이지를 불러오는 중에 문제가 발생했습니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              잠시 후 다시 시도하거나, 문제가 지속되면 고객센터로 문의해 주세요.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full" size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            페이지 새로고침
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            홈으로 돌아가기
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <details>
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                개발자 정보 보기
              </summary>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    오류 메시지:
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                    {error.message}
                  </p>
                </div>
                {error.digest && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      오류 ID:
                    </p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {error.digest}
                    </p>
                  </div>
                )}
                {error.stack && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      스택 트레이스:
                    </p>
                    <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40">
                      {error.stack}
                    </pre>
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
