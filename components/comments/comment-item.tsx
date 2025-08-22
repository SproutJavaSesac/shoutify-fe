"use client";

import { fetchCommentReaction } from "@/apis/reactions";
import {
  DeleteButton,
  ReactionButtons,
  ReportButton,
} from "@/components/commons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  useCommentReactionCreate,
  useCommentReactionDelete,
  useCommentReactionUpdate,
} from "@/lib/hooks/useReactions";
import { utcToLocaleDateString } from "@/lib/utils";
import { Comment } from "@/types/comments";
import { ReactionLabelType } from "@/types/reactions";
import { MessageCircle } from "lucide-react";
import { memo, useCallback, useState } from "react";

interface CommentItemProps {
  comment: Comment;
  postId: string | number;
  isHighlighted?: boolean;
  isDeleting?: boolean;
  onReply: (commentId: string | number) => void;
  onDelete: (commentId: string | number) => void;
  onReport: (comment: Comment) => void;
  highlightRef?: React.RefObject<HTMLDivElement>;
}

export const CommentItem = memo(function CommentItem({
  comment,
  postId,
  isHighlighted = false,
  isDeleting = false,
  onReply,
  onDelete,
  onReport,
  highlightRef,
}: CommentItemProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  // 개별 댓글의 반응 상태 관리
  const [reactions, setReactions] = useState(comment.reactions || {});
  const [myReaction, setMyReaction] = useState<ReactionLabelType | null>(
    comment.reaction || null
  );
  const [isReactionLoading, setIsReactionLoading] = useState(false);

  // 댓글 반응 관련 훅들
  const { mutate: createCommentReaction } = useCommentReactionCreate({
    onSuccess: (response) => {
      // 성공 후 최신 반응 상태를 GET으로 가져와서 업데이트
      fetchCommentReaction({ postId, commentId: comment.commentId })
        .then((reactionData) => {
          setReactions(reactionData.reactionDetails);
          setMyReaction(reactionData.type);
        })
        .catch((error) => {
          console.error("반응 상태 가져오기 실패:", error);
        })
        .finally(() => {
          setIsReactionLoading(false);
        });
    },
    onError: (error) => {
      setIsReactionLoading(false);
      toast({
        title: "반응 등록 실패",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateCommentReaction } = useCommentReactionUpdate({
    onSuccess: (response) => {
      fetchCommentReaction({ postId, commentId: comment.commentId })
        .then((reactionData) => {
          setReactions(reactionData.reactionDetails);
          setMyReaction(reactionData.type);
        })
        .catch((error) => {
          console.error("반응 상태 가져오기 실패:", error);
        })
        .finally(() => {
          setIsReactionLoading(false);
        });
    },
    onError: (error) => {
      setIsReactionLoading(false);
      toast({
        title: "반응 수정 실패",
        description: error,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteCommentReaction } = useCommentReactionDelete({
    onSuccess: (response) => {
      fetchCommentReaction({ postId, commentId: comment.commentId })
        .then((reactionData) => {
          setReactions(reactionData.reactionDetails);
          setMyReaction(reactionData.type);
        })
        .catch((error) => {
          console.error("반응 상태 가져오기 실패:", error);
        })
        .finally(() => {
          setIsReactionLoading(false);
        });
    },
    onError: (error) => {
      setIsReactionLoading(false);
      toast({
        title: "반응 삭제 실패",
        description: error,
        variant: "destructive",
      });
    },
  });

  // 댓글 반응 처리 핸들러
  const handleCommentReaction = useCallback(
    async (reactionType: ReactionLabelType) => {
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
      if (isReactionLoading) return;

      // 로딩 상태 시작
      setIsReactionLoading(true);

      try {
        // 액션 결정
        let action: "create" | "update" | "delete";

        if (!myReaction) {
          // 첫 반응 → POST (생성)
          action = "create";
        } else if (myReaction === reactionType) {
          // 같은 반응 클릭 → DELETE (삭제)
          action = "delete";
        } else {
          // 다른 반응으로 변경 → PUT (수정)
          action = "update";
        }

        // CUD 작업 수행
        switch (action) {
          case "create":
            createCommentReaction({
              paths: { postId, commentId: comment.commentId },
              body: { type: reactionType },
            });
            break;
          case "update":
            updateCommentReaction({
              paths: { postId, commentId: comment.commentId },
              body: { type: reactionType },
            });
            break;
          case "delete":
            deleteCommentReaction({
              paths: {
                postId,
                commentId: comment.commentId,
                type: myReaction!,
              },
            });
            break;
        }
      } catch (error) {
        // 에러 시 로딩 상태 해제
        setIsReactionLoading(false);

        toast({
          title: "반응 처리 실패",
          description: "반응 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
    [
      user,
      isReactionLoading,
      myReaction,
      postId,
      comment.commentId,
      createCommentReaction,
      updateCommentReaction,
      deleteCommentReaction,
      toast,
    ]
  );

  const isReply = comment.level > 0;

  // level에 따른 들여쓰기 계산 (level 1당 32px)
  const indentStyle = {
    marginLeft: `${comment.level * 32}px`,
  };

  return (
    <div
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
              onClick={() => onReport(comment)}
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
            onClick={() => onDelete(comment.commentId)}
            className="text-xs px-2 py-1 h-6 min-w-[40px] text-red-500 hover:text-red-700"
            size="sm"
            variant="ghost"
            confirmDescription="이 댓글을 삭제하시겠습니까?"
            disabled={isDeleting}
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
            reactions={reactions}
            myReaction={myReaction}
            onReactionClick={handleCommentReaction}
            isAuthenticated={!!user}
            isLoading={isReactionLoading}
            size="sm"
            showAllReactions={true}
          />
        </div>

        {/* 답글 버튼 (대댓글까지 표시) */}
        {comment.level < 2 && !comment.isDeleted && !comment.isReported && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.commentId)}
            className="text-xs"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            답글
          </Button>
        )}
      </div>
    </div>
  );
});
