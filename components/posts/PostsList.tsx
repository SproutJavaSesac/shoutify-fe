"use client";

import { Pagination } from "@/components/commons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CONCEPT_OPTIONS,
  EMOTICON_OPTIONS,
  GENRE_OPTIONS,
  POST_ROUTES,
} from "@/constants/posts";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { usePostListFetchEffect } from "@/lib/hooks/usePosts";
import {
  usePostReactionCreate,
  usePostReactionDelete,
  usePostReactionUpdate,
} from "@/lib/hooks/useReactions";
import { utcToLocaleDateString } from "@/lib/utils";
import {
  ConceptType,
  EmotionType,
  GenreType,
  PostSortType,
} from "@/types/posts";
import { ReactionLabelType } from "@/types/reactions";
import { Calendar, Eye, HeartIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PostsListProps {
  initialSort?: PostSortType;
  concept?: ConceptType;
  limit?: number;
  keyword?: string;
}

export default function PostsList({
  initialSort = "createdAt",
  concept = "ALL",
  limit = 10,
  keyword,
}: Readonly<PostsListProps>) {
  const { toast } = useToast();
  const { user } = useAuth();

  // 각 게시글별 반응 로딩 상태
  const [reactionLoadingStates, setReactionLoadingStates] = useState<
    Record<string | number, boolean>
  >({});

  const {
    data: posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    hasNext,
    hasPrevious,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  } = usePostListFetchEffect({
    size: limit,
    immediate: true,
  });

  // 게시글 반응 관련 훅들
  const { mutate: createPostReaction } = usePostReactionCreate({
    onSuccess: () => {
      refetch(); // 게시글 목록 새로고침
    },
    onError: (error) => {
      toast({
        title: "반응 등록 실패",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: updatePostReaction } = usePostReactionUpdate({
    onSuccess: () => {
      refetch(); // 게시글 목록 새로고침
    },
    onError: (error) => {
      toast({
        title: "반응 수정 실패",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: deletePostReaction } = usePostReactionDelete({
    onSuccess: () => {
      refetch(); // 게시글 목록 새로고침
    },
    onError: (error) => {
      toast({
        title: "반응 삭제 실패",
        description: error,
        variant: "destructive",
      });
    },
  });

  // 게시글 반응 처리 핸들러
  const handlePostReaction = async (
    postId: string | number,
    reactionType: ReactionLabelType
  ) => {
    // 로그인 체크
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "반응을 누르려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    // 이미 처리 중이면 무시
    if (reactionLoadingStates[postId]) return;

    // 로딩 상태 시작
    setReactionLoadingStates((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      const post = posts?.find((p) => p.postId === postId);
      if (!post) return;

      const currentMyReaction = post.myReaction;

      // 액션 결정
      let action: "create" | "update" | "delete";

      if (!currentMyReaction) {
        // 첫 반응 → POST (생성)
        action = "create";
      } else if (currentMyReaction === reactionType) {
        // 같은 반응 클릭 → DELETE (삭제)
        action = "delete";
      } else {
        // 다른 반응으로 변경 → PUT (수정)
        action = "update";
      }

      // CUD 작업 수행
      switch (action) {
        case "create":
          createPostReaction({
            paths: { postId },
            body: { type: reactionType },
          });
          break;
        case "update":
          updatePostReaction({
            paths: { postId },
            body: { type: reactionType },
          });
          break;
        case "delete":
          deletePostReaction({
            paths: { postId, type: currentMyReaction! },
          });
          break;
      }
    } catch (error) {
      toast({
        title: "반응 처리 실패",
        description: "반응 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      // 로딩 상태 해제
      setReactionLoadingStates((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between pt-4 border-t">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-4">
            게시글을 불러오는 중 오류가 발생했습니다: {error}
          </div>
          <Button onClick={() => refetch()} variant="outline">
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {keyword
              ? `"${keyword}"에 대한 검색 결과가 없습니다.`
              : "아직 게시글이 없습니다."}
          </p>
          <Link href={POST_ROUTES.CREATE}>
            <Button>첫 번째 게시글 작성하기</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const getConceptLabel = (conceptType: ConceptType) => {
    return (
      CONCEPT_OPTIONS.find((option) => option.value === conceptType)?.label ||
      conceptType
    );
  };

  const getGenreLabel = (genreType: GenreType) => {
    return (
      GENRE_OPTIONS.find((option) => option.value === genreType)?.label ||
      genreType
    );
  };

  const getEmotionOption = (emotionType: EmotionType) => {
    return EMOTICON_OPTIONS.find((option) => option.value === emotionType);
  };

  return (
    <div className="space-y-6">
      {/* 검색 결과 정보 */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>전체 {totalCount}개의 게시글</span>
        {totalPages > 0 && (
          <span>
            {currentPage + 1} / {totalPages} 페이지
          </span>
        )}
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card
            key={post.postId}
            className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center flex-wrap gap-2">
                    {/* 게시글의 감정 표시 (PostDetail과 같은 스타일) */}

                    {/* 장르 표시 */}
                    {post.genreType && (
                      <Badge
                        variant="outline"
                        className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 px-2 py-1"
                      >
                        🎨 {getGenreLabel(post.genreType)}
                      </Badge>
                    )}
                    {post.authorSelectEmotion && (
                      <>
                        {(() => {
                          const emotionOption = getEmotionOption(
                            post.authorSelectEmotion
                          );
                          return emotionOption ? (
                            <Badge
                              className={`${emotionOption.color} text-xs font-medium px-2 py-1`}
                            >
                              {emotionOption.emotionType} {emotionOption.label}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {post.authorSelectEmotion}
                            </Badge>
                          );
                        })()}
                      </>
                    )}
                    {!post.authorSelectEmotion && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">
                        감정 없음
                      </Badge>
                    )}

                    {/* 컨셉 표시 */}
                    {/* <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1">
                      📝 {getConceptLabel(post.conceptType)}
                    </Badge> */}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 ml-2 flex-shrink-0">
                    <Calendar className="h-3 w-3 mr-1" />
                    {utcToLocaleDateString(post.createdAt)}
                  </div>
                </div>

                {/* 제목 */}
                <Link href={POST_ROUTES.DETAIL(post.postId)}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 transition-colors duration-200 leading-tight">
                    {post.afterTitle}
                  </h3>
                </Link>

                {/* 내용 미리보기 */}
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {post.afterContent}
                </p>

                {/* 푸터 */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="font-medium">by {post.nickname}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* 반응하기 총 개수 post.reactionCount 이용 */}
                    <div className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                      <HeartIcon className="h-4 w-4" />
                      <span className="font-medium">{post.reactionCount}</span>
                    </div>

                    {/* 댓글 수 */}
                    <div className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{post.commentCount}</span>
                    </div>

                    {/* 숨김 상태 */}
                    {post.isHidden && (
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Eye className="h-4 w-4" />
                        <span>숨김</span>
                      </div>
                    )}

                    {/* 내 글 표시 */}
                    {post.isMine && (
                      <Badge
                        variant="outline"
                        className="text-xs border-green-200 text-green-700 bg-green-50"
                      >
                        내 글
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Pagination
          pagination={{
            currentPage,
            totalPages,
            totalCount,
            pageSize: limit,
            hasNext,
            hasPrevious,
          }}
          onPageChange={goToPage}
          showFirstLastButtons={true}
        />
      )}
    </div>
  );
}
