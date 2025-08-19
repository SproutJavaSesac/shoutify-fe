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

  // 각 댓글별 반응 로딩 상태 (commentId -> boolean)
  const [reactionLoadingStates, setReactionLoadingStates] = useState<
    Record<string | number, boolean>
  >({});

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

  // 댓글별 반응 상태 관리 (메모리 최적화를 위해 실제로 사용되는 댓글만 관리)
  const [commentReactions, setCommentReactions] = useState<
    Record<
      string | number,
      {
        reactions: Record<ReactionLabelType, number>;
        myReaction: ReactionLabelType | null;
      }
    >
  >({});

  // 개별 댓글 반응 핸들러 (POST → GET / PUT → GET / DELETE → GET 패턴)
  const handleCommentReaction = async (
    commentId: string | number,
    reactionType: ReactionLabelType,
    currentCommentReactions: Record<ReactionLabelType, number>
  ) => {
    if (reactionLoadingStates[commentId]) return; // 이미 처리 중이면 무시

    const currentMyReaction = myReactions[commentId];

    // 로딩 상태 설정
    setReactionLoadingStates((prev) => ({ ...prev, [commentId]: true }));

    // 액션 결정
    let action: "create" | "update" | "delete"; // 함수 상단으로 이동하여 catch 블록에서도 접근 가능하게 함

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

    try {
      // CUD 작업 수행
      const {
        createCommentReaction,
        updateCommentReaction,
        deleteCommentReaction,
        fetchCommentReaction,
      } = await import("@/apis/reactions");

      switch (action) {
        case "create":
          await createCommentReaction({
            paths: { postId, commentId },
            body: { type: reactionType },
          });
          break;
        case "update":
          await updateCommentReaction({
            paths: { postId, commentId },
            body: { type: reactionType },
          });
          break;
        case "delete":
          await deleteCommentReaction({
            paths: { postId, commentId },
          });
          break;
      }

      // CUD 작업 성공 후 최신 데이터를 GET으로 가져오기
      const latestReactionData = await fetchCommentReaction({
        postId,
        commentId,
      });

      // 해당 댓글의 반응 정보만 업데이트
      setCommentReactions((prev) => ({
        ...prev,
        [commentId]: {
          reactions: latestReactionData.reactionDetails,
          myReaction: latestReactionData.reaction,
        },
      }));

      setMyReactions((prev) => ({
        ...prev,
        [commentId]: latestReactionData.reaction,
      }));

      // 성공 메시지
      const actionText =
        action === "create"
          ? "반응을 표시했습니다."
          : action === "update"
            ? "반응을 변경했습니다."
            : "반응을 취소했습니다.";

      toast({
        description: actionText,
      });
    } catch (error) {
      const errorText =
        action === "create"
          ? "반응 실패"
          : action === "update"
            ? "반응 변경 실패"
            : "반응 취소 실패";

      toast({
        title: errorText,
        description:
          error instanceof Error
            ? error.message
            : "반응 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      // 로딩 상태 해제
      setReactionLoadingStates((prev) => ({ ...prev, [commentId]: false }));
    }
  }; // 하이라이트된 댓글로 스크롤
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

  // 댓글 목록이 변경될 때 초기 내 반응 상태 설정
  useEffect(() => {
    if (comments) {
      const initialMyReactions: Record<
        string | number,
        ReactionLabelType | null
      > = {};
      comments.forEach((comment) => {
        if (comment.reaction !== undefined) {
          initialMyReactions[comment.commentId] = comment.reaction;
        }
      });

      // 기존 myReactions와 병합하되, 서버에서 온 데이터를 우선시
      setMyReactions((prev) => ({
        ...prev,
        ...initialMyReactions,
      }));
    }
  }, [comments]);

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
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="font-medium text-gray-900 truncate">
              {comment.commenterNickname}
            </span>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {utcToLocaleDateString(comment.createdAt)}
            </span>
            {comment.isMine && (
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                내 댓글
              </Badge>
            )}
            {/* level 표시 (개발용 - 나중에 제거) */}
            <span className="text-xs text-gray-400 whitespace-nowrap">
              level: {comment.level}
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
            {/* 신고 버튼 - 내 댓글이 아닌 경우에만 표시 */}
            {!comment.isMine && (
              <ReportButton
                onClick={() => handleReportComment(comment)}
                className="text-xs px-2 py-1 h-6 min-w-[40px] text-gray-500 hover:text-red-500"
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
              className="text-xs px-2 py-1 h-6 min-w-[40px] text-red-500 hover:text-red-700"
              size="sm"
              variant="ghost"
              confirmDescription="이 댓글을 삭제하시겠습니까?"
              disabled={deletingComments.has(comment.commentId)}
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
              reactions={
                commentReactions[comment.commentId]?.reactions ||
                comment.reactions ||
                {}
              }
              myReaction={
                commentReactions[comment.commentId]?.myReaction !== undefined
                  ? commentReactions[comment.commentId]?.myReaction
                  : myReactions[comment.commentId]
              }
              onReactionClick={(reactionType) =>
                handleCommentReaction(
                  comment.commentId,
                  reactionType,
                  comment.reactions || {}
                )
              }
              isAuthenticated={!!user}
              isLoading={reactionLoadingStates[comment.commentId] || false}
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
