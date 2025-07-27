"use client";

import Link from "next/link";
import { ArrowLeft, FileX, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { POST_ROUTES } from "@/constants/posts";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* 404 일러스트레이션 */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <FileX className="h-24 w-24 text-gray-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-600 dark:text-gray-400">
                  404
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              요청하신 페이지가 존재하지 않거나 이동되었습니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              주소를 다시 확인하시거나, 아래 버튼을 통해 다른 페이지로 이동해
              주세요.
            </p>
          </div>
        </div>

        {/* 액션 버튼들 gap 필요 */}
        <div className="space-y-3 flex flex-col gap-3">
          <Link href="/" className="w-full" replace={true}>
            <Button className="w-full" size="lg">
              <Home className="mr-2 h-5 w-5" />
              홈으로 돌아가기
            </Button>
          </Link>

          <Link href="/posts" className="w-full" replace={true}>
            <Button variant="outline" className="w-full" size="lg">
              <FileX className="mr-2 h-5 w-5" />
              게시글 보러가기
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            이전 페이지로
          </Button>
        </div>

        {/* 도움말 섹션 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Search className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                찾고 계신 페이지가 있나요?
              </h3>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                상단 검색바를 이용하시거나, 홈페이지에서 원하시는 콘텐츠를
                찾아보세요.
              </p>
            </div>
          </div>
        </div>

        {/* 추천 링크들 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            추천 페이지
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/posts"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:underline"
              replace={true}
            >
              📝 게시글 목록
            </Link>
            <Link
              href={POST_ROUTES.CREATE}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:underline"
              replace={true}
            >
              ✍️ 글 작성하기
            </Link>
            <Link
              href="/ranking"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:underline"
              replace={true}
            >
              🏆 랭킹
            </Link>
            <Link
              href="/mypage"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:underline"
              replace={true}
            >
              👤 마이페이지
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
