"use client";

import { CommentForm } from "@/components/comments/comment-form";
import {
  DeleteButton,
  Pagination,
  ReactionButtons,
  ReportButton,
} from "@/components/commons";
import { ReportModal } from "@/components/report-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  useCommentCreate,
  useCommentDelete,
  useCommentList,
} from "@/lib/hooks/useComments";
import {
  useCommentReactionCreate,
  useCommentReactionDelete,
  useCommentReactionUpdate,
} from "@/lib/hooks/useReactions";
import { utcToLocaleDateString } from "@/lib/utils";
import { Comment, CommentSortType } from "@/types/comments";
import { ReactionLabelType } from "@/types/reactions";
import { MessageCircle } from "lucide-react";
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

  // 각 댓글별 내 반응 상태 (commentId -> ReactionLabelType)
  const [myReactions, setMyReactions] = useState<
    Record<string | number, ReactionLabelType | null>
  >({});

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
  }); // 댓글 삭제
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

  // 댓글 리액션 훅들
  const { mutate: createCommentReaction } = useCommentReactionCreate({
    onSuccess: () => {
      toast({
        description: "반응을 표시했습니다.",
      });
      refetch(); // 댓글 목록 새로고침하여 최신 반응 상태 반영
    },
    onError: (errorMessage) => {
      toast({
        title: "반응 실패",
        description: errorMessage,
        variant: "destructive",
      });
      // 실패 시 상태 롤백은 필요없음 (미리 상태 업데이트하지 않으므로)
    },
  });

  const { mutate: updateCommentReaction } = useCommentReactionUpdate({
    onSuccess: () => {
      toast({
        description: "반응을 변경했습니다.",
      });
      refetch();
    },
    onError: (errorMessage) => {
      toast({
        title: "반응 변경 실패",
        description: errorMessage,
        variant: "destructive",
      });
      // 실패 시 상태 롤백은 필요없음 (미리 상태 업데이트하지 않으므로)
    },
  });

  const { mutate: deleteCommentReaction } = useCommentReactionDelete({
    onSuccess: () => {
      toast({
        description: "반응을 취소했습니다.",
      });
      refetch();
    },
    onError: (errorMessage) => {
      toast({
        title: "반응 취소 실패",
        description: errorMessage,
        variant: "destructive",
      });
      // 실패 시 상태 롤백은 필요없음 (미리 상태 업데이트하지 않으므로)
    },
  });

  // 댓글 리액션 핸들러 - 게시글과 동일한 로직
  const handleCommentReaction = (
    commentId: string | number,
    reactionType: ReactionLabelType
  ) => {
    const currentReaction = myReactions[commentId];

    // 현재 선택된 반응과 같은 반응을 다시 클릭한 경우 - 삭제
    if (currentReaction === reactionType) {
      console.log("Deleting comment reaction:", {
        postId,
        commentId,
        reactionType,
      });
      deleteCommentReaction({
        paths: { postId, commentId },
      });
      // 성공 시에만 상태 업데이트 (onSuccess 콜백에서 처리)
    }
    // 처음 반응을 선택하는 경우 - 생성
    else if (!currentReaction) {
      console.log("Creating comment reaction:", {
        postId,
        commentId,
        reactionType,
      });
      createCommentReaction({
        paths: { postId, commentId },
        body: { type: reactionType },
      });
      // 성공 시에만 상태 업데이트 (onSuccess 콜백에서 처리)
    }
    // 다른 반응으로 변경하는 경우 - 수정
    else {
      console.log("Updating comment reaction:", {
        postId,
        commentId,
        reactionType,
      });
      updateCommentReaction({
        paths: { postId, commentId },
        body: { type: reactionType },
      });
      // 성공 시에만 상태 업데이트 (onSuccess 콜백에서 처리)
    }
  };

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
  const handleDeleteComment = (commentId: string | number) => {
    deleteComment({
      paths: {
        postId,
        commentId,
      },
    });
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

  // order 순서로 정렬된 댓글 목록 생성 - 서버에서 정렬된 데이터를 order 순으로만 정렬
  const sortedComments = comments
    ? [...comments].sort((a, b) => a.order - b.order)
    : [];

  // 댓글 렌더링 함수
  const renderComment = (comment: Comment) => {
    const isHighlighted = comment.commentId === highlightedCommentId;
    const isReply = comment.level > 0;

    // level에 따른 들여쓰기 계산 (level 1당 32px)
    const indentStyle = {
      marginLeft: `${comment.level * 32}px`,
    };

    return (
      <div
        key={comment.commentId}
        ref={isHighlighted ? highlightRef : undefined}
        style={indentStyle}
        className={`border rounded-lg p-4 ${
          isReply ? "bg-gray-50" : "bg-white"
        } ${isHighlighted ? "ring-2 ring-blue-300 bg-blue-50" : ""}`}
      >
        {/* 댓글 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">
              {comment.commenterNickname}
            </span>
            <span className="text-xs text-gray-500">
              {utcToLocaleDateString(comment.createdAt)}
            </span>
            {comment.isMine && (
              <Badge variant="outline" className="text-xs">
                내 댓글
              </Badge>
            )}
            {/* level 표시 (개발용 - 나중에 제거) */}
            <span className="text-xs text-gray-400">
              level: {comment.level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 신고 버튼 - 내 댓글이 아닌 경우에만 표시 */}
            {!comment.isMine && (
              <ReportButton
                onClick={() => handleReportComment(comment)}
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                size="sm"
              >
                신고
              </ReportButton>
            )}

            {/* 삭제 버튼 */}
            <DeleteButton
              isMine={
                comment.commenterId ? comment.commenterId === user?.id : false
              }
              onClick={() => handleDeleteComment(comment.commentId)}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              size="sm"
              confirmDescription="이 댓글을 삭제하시겠습니까?"
            />
          </div>
        </div>

        {/* 댓글 내용 */}
        <p className="text-gray-800 mb-3 whitespace-pre-line">
          {comment.content}
        </p>

        {/* 댓글 액션 (반응, 답글) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 반응 버튼들 */}
            <ReactionButtons
              reactions={comment.reactions || {}}
              myReaction={myReactions[comment.commentId]}
              onReactionClick={(reactionType) =>
                handleCommentReaction(comment.commentId, reactionType)
              }
              isAuthenticated={!!user}
              size="sm"
              showAllReactions={true}
            />
          </div>

          {/* 답글 버튼 (대댓글까지 표시) */}
          {comment.level < 2 && !comment.isDeleted && !comment.isReported && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(
                  replyingTo === comment.commentId ? null : comment.commentId
                );
              }}
              className="text-xs"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              답글
            </Button>
          )}
        </div>

        {/* 답글 작성 폼 */}
        {comment.level === 0 && replyingTo === comment.commentId && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
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
    );
  };

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
              {sortedComments.map((comment) => renderComment(comment))}
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
