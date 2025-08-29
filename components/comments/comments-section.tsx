"use client";

import { CommentForm } from "@/components/comments/comment-form";
import { CommentItem } from "@/components/comments/comment-item";
import { Pagination } from "@/components/commons";
import { ReportModal } from "@/components/report-modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  useCommentCreate,
  useCommentDelete,
  useCommentList,
} from "@/lib/hooks/useComments";
import { Comment, CommentSortType } from "@/types/comments";
import { useEffect, useRef, useState } from "react";

export function CommentsSection({
  postId,
}: Readonly<{ postId: string | number }>) {
  // 상태 관리
  const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
  const [sortType, setSortType] = useState<CommentSortType>("createdAt");
  const [highlightedCommentId, setHighlightedCommentId] = useState<
    string | number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 각 댓글별 삭제 로딩 상태
  const [deletingComments, setDeletingComments] = useState<
    Set<string | number>
  >(new Set());

  // 신고 모달 상태
  const [reportModal, setReportModal] = useState(false);
  const [reportingComment, setReportingComment] = useState<Comment | null>(
    null
  );
  const { toast } = useToast();
  const { user } = useAuth();
  const highlightRef = useRef<HTMLDivElement>(null);

  // 댓글 목록 조회
  const {
    data: comments,
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
  } = useCommentList({
    postId,
    page: 0,
    size: 20, // 페이지당 댓글 수
    sort: sortType,
    order: "ASC",
  });

  // 댓글 생성
  const { mutate: createComment } = useCommentCreate({
    onSuccess: (response) => {
      // 성공 시 상태 초기화
      setReplyingTo(null);
      setIsSubmitting(false);

      // 생성된 댓글 하이라이트
      setHighlightedCommentId(response.commentId);

      toast({
        description: "댓글이 등록되었습니다.",
      });

      // 생성된 댓글이 있는 페이지 계산 (새로운 댓글은 마지막 페이지에 추가됨)
      const newTotalCount = totalCount + 1;
      const targetPage = Math.floor((newTotalCount - 1) / 20);

      if (targetPage !== currentPage) {
        goToPage(targetPage);
      } else {
        refetch();
      }
    },
    onError: (errorMessage) => {
      setIsSubmitting(false);
      toast({
        title: "댓글 등록 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // 댓글 삭제
  const { mutate: deleteComment } = useCommentDelete({
    onSuccess: () => {
      toast({
        description: "댓글이 삭제되었습니다.",
      });
      refetch();
    },
    onError: (errorMessage) => {
      toast({
        title: "댓글 삭제 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // 하이라이트된 댓글로 스크롤
  useEffect(() => {
    if (highlightedCommentId && highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // 3초 후 하이라이트 제거
      const timer = setTimeout(() => {
        setHighlightedCommentId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightedCommentId, comments]);

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (content: string) => {
    setIsSubmitting(true);
    await createComment({
      paths: { postId },
      body: {
        content,
      },
    });
  };

  // 대댓글 작성 핸들러
  const handleReplySubmit = async (
    content: string,
    parentCommentId: string | number
  ) => {
    await createComment({
      paths: { postId },
      body: {
        content,
        parentId: parentCommentId,
      },
    });
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: string | number) => {
    if (deletingComments.has(commentId)) return;

    setDeletingComments((prev) => new Set([...prev, commentId]));

    try {
      await new Promise((resolve, reject) => {
        deleteComment({
          paths: {
            postId,
            commentId,
          },
        });
        // deleteComment의 onSuccess/onError 콜백에서 처리되므로 여기서는 단순히 Promise 형태로 래핑
        // 실제로는 mutate의 결과를 기다릴 수 있도록 수정이 필요할 수 있음
        setTimeout(resolve, 100); // 임시: 실제로는 mutate의 완료를 기다려야 함
      });
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    } finally {
      setDeletingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  // 댓글 신고 핸들러
  const handleReportComment = (comment: Comment) => {
    setReportingComment(comment);
    setReportModal(true);
  };

  // 정렬 변경 핸들러
  const handleSortChange = (newSort: CommentSortType) => {
    setSortType(newSort);
  };

  // 답글 토글 핸들러
  const handleReply = (commentId: string | number) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  // order 순서로 정렬된 댓글 목록 생성 - 서버에서 정렬된 데이터를 order 순으로만 정렬
  const sortedComments = comments
    ? [...comments].sort((a, b) => a.order - b.order)
    : [];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">댓글을 불러오는 중...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            댓글을 불러오는 중 오류가 발생했습니다: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              댓글 {totalCount > 0 && `(${totalCount})`}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 댓글 작성 폼 */}
          <CommentForm
            placeholder="댓글을 입력하세요..."
            onSubmit={handleCommentSubmit}
            isSubmitting={isSubmitting}
            submitLabel="댓글 등록"
          />

          {/* 댓글 목록 */}
          {sortedComments && sortedComments.length > 0 ? (
            <div className="space-y-4">
              {sortedComments.map((comment) => (
                <div key={comment.commentId}>
                  <CommentItem
                    comment={comment}
                    postId={postId}
                    isHighlighted={comment.commentId === highlightedCommentId}
                    onReply={handleReply}
                    onDelete={handleDeleteComment}
                    onReport={handleReportComment}
                    highlightRef={
                      comment.commentId === highlightedCommentId
                        ? (highlightRef as any)
                        : undefined
                    }
                    isDeleting={deletingComments.has(comment.commentId)}
                  />
                  {/* 답글 작성 폼 */}
                  {comment.level >= 0 &&
                    comment.level < 2 &&
                    replyingTo === comment.commentId && (
                      <div className="mt-4 ml-8 p-3 bg-gray-50 rounded-lg">
                        <CommentForm
                          placeholder="답글을 입력하세요..."
                          onSubmit={(content) =>
                            handleReplySubmit(content, comment.commentId)
                          }
                          onCancel={() => setReplyingTo(null)}
                          showCancel={true}
                          minHeight="min-h-[80px]"
                          submitLabel="답글 등록"
                        />
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              첫 번째 댓글을 작성해보세요!
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pt-4 border-t">
              <Pagination
                pagination={{
                  currentPage,
                  totalPages,
                  totalCount,
                  pageSize: 10, // 댓글은 10개씩 페이징
                  hasNext,
                  hasPrevious,
                }}
                onPageChange={goToPage}
                maxVisiblePages={5}
                showFirstLastButtons={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 댓글 신고 모달 */}
      <ReportModal
        isOpen={reportModal}
        onClose={() => {
          setReportModal(false);
          setReportingComment(null);
        }}
        type="comment"
        targetId={reportingComment?.commentId || ""}
        targetContent={reportingComment?.content || ""}
      />
    </>
  );
}
