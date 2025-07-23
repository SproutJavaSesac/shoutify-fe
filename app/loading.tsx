"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export default function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") {
          return "";
        }
        return prev + ".";
      });
    }, 500); // 0.5초마다 점 추가
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-gray-100 dark:bg-gray-900">
      <FileText className="h-16 w-16 text-blue-500" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          페이지를 불러오는 중입니다{dots}
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          잠시만 기다려 주세요
        </p>
      </div>
    </div>
  );
}
