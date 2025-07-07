"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Bookmark, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// 새로운 API와 타입 사용
import { api } from "@/apis";
import { usePagination } from "@/lib/hooks/useApi";
import type { Post, PostQueryParams } from "@/types";
import { EMOTION_COLORS } from "@/types";

interface NewPostFeedProps {
  selectedCategory: string;
  searchQuery?: string;
}

export function NewPostFeed({
  selectedCategory,
  searchQuery = "",
}: NewPostFeedProps) {
  // API 호출 함수 정의
  const fetchPosts = useMemo(() => {
    return async (page: number, limit: number) => {
      const params: PostQueryParams = {
        page,
        limit,
        sortBy: "latest",
      };

      // 카테고리 필터링
      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      // 검색 쿼리 추가
      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      // API 호출
      const response = await api.posts.getPosts(params);

      return {
        data: response.posts,
        totalCount: response.totalCount,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
      };
    };
  }, [selectedCategory, searchQuery]);

  // 페이지네이션 훅 사용
  const {
    data: posts,
    loading,
    error,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  } = usePagination(fetchPosts, { pageSize: 10 });

  // 에러 처리
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          다시 시도
        </Button>
      </div>
    );
  }

  // 로딩 상태
  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">게시글을 불러오는 중...</span>
      </div>
    );
  }

  // 빈 상태
  if (!loading && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          {searchQuery ? "검색 결과가 없습니다." : "게시글이 없습니다."}
        </p>
        <Button onClick={refetch} variant="outline">
          새로고침
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 게시글 목록 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* 게시글 이미지 */}
                {post.hasImage && post.imageUrl && (
                  <div className="flex-shrink-0">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}

                {/* 게시글 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      className={
                        EMOTION_COLORS[
                          post.emotion as keyof typeof EMOTION_COLORS
                        ] || "bg-gray-100 text-gray-800"
                      }
                    >
                      {post.emotion}
                    </Badge>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>

                  <Link href={`/post/${post.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2 cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.preview}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>by {post.author}</span>
                      <span>{post.time}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.totalReactions}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </span>
                      {post.bookmarks && (
                        <span className="flex items-center space-x-1">
                          <Bookmark className="h-4 w-4" />
                          <span>{post.bookmarks}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={!hasPrev || loading}
          >
            이전
          </Button>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;

              // 현재 페이지 주변만 표시
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <Button
                    key={page}
                    variant={isCurrentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                );
              } else if (page === currentPage - 3 || page === currentPage + 3) {
                return (
                  <span key={page} className="px-2">
                    ...
                  </span>
                );
              }

              return null;
            })}
          </div>

          <Button
            variant="outline"
            onClick={nextPage}
            disabled={!hasNext || loading}
          >
            다음
          </Button>
        </div>
      )}

      {/* 로딩 오버레이 (페이지 전환 시) */}
      {loading && posts.length > 0 && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>로딩 중...</span>
          </div>
        </div>
      )}
    </div>
  );
}
