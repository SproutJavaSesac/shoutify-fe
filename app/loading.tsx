import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          페이지를 불러오는 중입니다...
        </h1>
      </div>
    </div>
  );
}
