"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko" className="h-full">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                예상치 못한 오류가 발생했습니다
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                시스템 레벨 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={reset} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 시도
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
                size="lg"
              >
                홈으로 이동
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  오류 상세 정보 (개발 모드)
                </summary>
                <pre className="mt-2 text-xs bg-gray-200 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
