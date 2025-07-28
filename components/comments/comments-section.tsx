"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, MessageCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";
import type { Comment, CommentQueryParams } from "@/types/comments";
import { utcToLocaleDateString } from "@/lib/utils";
import { getComments } from "@/apis/comments";
import { Pagination } from "@/types/commons";
import { EmoticonType } from "@/types/reactions";
import { EMOTION_TO_EMOJI_MAP } from "@/constants/reactions";

export function CommentsSection({ postId }: Readonly<{ postId: string }>) {
  // 상태 관리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentReactions, setCommentReactions] = useState<{
    [key: number]: string | null;
  }>({});
  const [paginationData, setPaginationData] = useState<
    Pagination | undefined
  >();
  const [hasNext, setHasNext] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 댓글 데이터를 가져오는 함수
  const fetchComments = async (
    params: CommentQueryParams,
    appendMode: boolean = false,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getComments({
        postId: parseInt(postId),
        queryParams: params,
      });

      // API 응답 데이터를 상태에 설정 (appendMode에 따라 누적 또는 교체)
      if (appendMode) {
        setCommentsData((prev) => [...prev, ...response.comments]);
      } else {
        setCommentsData(response.comments);
      }

      // 페이지네이션 정보 업데이트
      if (response.pagination) {
        setPaginationData(response.pagination);
        setHasNext(response.pagination.hasNext);
      }
    } catch (err) {
      console.error("댓글을 불러오는 중 오류가 발생했습니다:", err);
      setError("댓글을 불러올 수 없습니다. 다시 시도해주세요.");
      toast({
        variant: "destructive",
        title: "오류",
        description: "댓글을 불러올 수 없습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트가 마운트될 때 댓글 불러오기
  useEffect(() => {
    if (postId) {
      fetchComments({
        page: 0,
        size: 20,
      });
    }
  }, [postId]);

  const handleSubmitComment = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (newComment.trim()) {
      toast({
        description: "댓글을 작성했습니다.",
      });
      setNewComment("");
    }
  };

  const handleSubmitReply = (parentCommentId: number) => {
    if (replyText.trim()) {
      toast({
        description: "답글을 작성했습니다.",
      });
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handleCommentReaction = (commentId: number, reactionType: string) => {
    setCommentReactions((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === reactionType ? null : reactionType,
    }));
  };

  const CommentComponent = ({
    comment,
    level = 0,
  }: {
    comment: Comment;
    level?: number;
  }) => (
    <div
      className={`${
        level > 0 ? "mt-4" : ""
      } ${level === 1 ? "pl-8" : level === 2 ? "pl-16" : ""}`}
    >
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-medium text-gray-900">
                {comment.commenterNickname}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {utcToLocaleDateString(comment.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {comment.isMine && (
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Flag className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <p className="text-gray-700 mb-3">{comment.content}</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* ReactionDetailCountMap의 순서로 EmoticonType을 ReactionEmojiType로 변환하여 출력 */}
              {(Object.keys(EMOTION_TO_EMOJI_MAP) as EmoticonType[]).map(
                (emotionType) => {
                  const emoji = EMOTION_TO_EMOJI_MAP[emotionType];
                  const count = comment.reactions[emotionType] || 0;

                  return (
                    <div key={emotionType} className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-xs ${
                          commentReactions[comment.commentId] === emotionType
                            ? "bg-gray-100 ring-2 ring-blue-300"
                            : ""
                        }`}
                        onClick={() =>
                          handleCommentReaction(comment.commentId, emotionType)
                        }
                      >
                        {emoji}
                      </Button>
                      <span className="text-xs text-gray-500 ml-1">
                        {count}
                      </span>
                    </div>
                  );
                },
              )}
            </div>

            {level < 2 && !comment.isDeleted && !comment.isReported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setReplyingTo(
                    replyingTo === comment.commentId ? null : comment.commentId,
                  )
                }
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                답글 작성
              </Button>
            )}
          </div>

          {replyingTo === comment.commentId && (
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="답글을 입력하세요."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.commentId)}
                >
                  작성
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section id="comments" className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>댓글 ({commentsData.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">현재 작성자: </span>
                <span className="text-sm font-medium">@{user.nickname}</span>
              </div>
              <Textarea
                placeholder="문학 작품을 인용해 생각을 나눠보세요!"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {1000 - newComment.length} 남은 글자수
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  댓글 작성
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">
                댓글을 작성하려면 먼저 로그인해 주세요.
              </p>
              <Button onClick={() => setShowAuthModal(true)}>로그인하기</Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {loading ? (
              // 로딩 상태 UI
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-gray-600">
                  댓글을 불러오는 중...
                </span>
              </div>
            ) : error ? (
              // 에러 상태 UI
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  variant="outline"
                  onClick={() =>
                    fetchComments({
                      page: 1,
                      size: 20,
                    })
                  }
                >
                  다시 시도
                </Button>
              </div>
            ) : commentsData.length === 0 ? (
              // 댓글이 없을 때 UI
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">아직 댓글이 없습니다.</p>
                <p className="text-sm text-gray-500">
                  첫 번째 댓글을 작성해보세요!
                </p>
              </div>
            ) : (
              // 댓글 목록 표시
              <>
                {commentsData.map((comment) => (
                  <CommentComponent
                    key={comment.commentId}
                    comment={comment}
                    level={comment.level}
                  />
                ))}

                {/* 더 많은 댓글 불러오기 버튼 */}
                {hasNext && paginationData && (
                  <div className="text-center py-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        fetchComments(
                          {
                            page: paginationData.currentPage + 1,
                            size: paginationData.pageSize,
                          },
                          true,
                        )
                      }
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          불러오는 중...
                        </>
                      ) : (
                        "더 많은 댓글 보기"
                      )}
                    </Button>
                  </div>
                )}

                {/* 페이지네이션 정보 표시 */}
                {paginationData && paginationData.totalCount > 0 && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    총 {paginationData.totalCount}개의 댓글 중{" "}
                    {commentsData.length}개 표시
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </section>
  );
}
