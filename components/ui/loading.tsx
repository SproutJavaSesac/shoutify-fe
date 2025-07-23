"use client";

import { Card, CardContent } from "@/components/ui/card";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({
  message = "잠시만 기다려주세요...",
  size = "md",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = {
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
  };

  return (
    <div
      className={`flex justify-center items-center ${containerClasses[size]}`}
    >
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div
            className={`animate-spin rounded-full border-b-2 border-gray-900 mb-4 ${sizeClasses[size]}`}
          />
          <p className="text-gray-600 text-center">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// 특화된 로딩 컴포넌트들
export function PostCreationLoading() {
  return <Loading message="게시글을 생성하는 중..." size="lg" />;
}

export function CommentLoading() {
  return <Loading message="댓글을 불러오는 중..." size="sm" />;
}

export function PageLoading() {
  return <Loading message="페이지를 불러오는 중..." size="lg" />;
}
