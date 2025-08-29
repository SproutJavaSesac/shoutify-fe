"use client";

import { deletePost, getPost, hidePost, unhidePost } from "@/apis/posts";
import { fetchPostReaction } from "@/apis/reactions";
import {
  BookmarkButton,
  DeleteButton,
  HideButton,
  ReactionButtons,
  ReportButton,
  ShareButton,
} from "@/components/commons";
import { PostAiScore } from "@/components/posts/post-ai-score";
import { ReportModal } from "@/components/report-modal";
import { ShareModal } from "@/components/share-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserProfileModal } from "@/components/user-profile-modal";
import { EMOTICON_OPTIONS } from "@/constants/posts";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  usePostReactionCreate,
  usePostReactionDelete,
  usePostReactionUpdate,
} from "@/lib/hooks/useReactions";
// import { usePostReactionManager } from "@/lib/hooks/useReactions";
import { utcToLocaleDateString } from "@/lib/utils";
import { Post } from "@/types/posts";
import {
  EmotionOption,
  ReactionDetailCountMap,
  ReactionLabelType,
} from "@/types/reactions";
import { Eye, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PostDetail({ postId }: Readonly<{ postId: string }>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postData, setPostData] = useState<Post>();

  // 게시글의 원본 감정 (작성자가 설정한 감정, 변경되지 않음)
  const [postEmotion, setPostEmotion] = useState<EmotionOption | null>(null);

  // 사용자들의 반응 통계 (댓글 수, 좋아요 수 등)
  const [reactions, setReactions] = useState<ReactionDetailCountMap>({
    HAPPY: 0,
    SAD: 0,
    ANGRY: 0,
    EXCITED: 0,
    CONFUSED: 0,
    PROUD: 0,
  });

  // 현재 로그인한 사용자가 표현한 반응
  const [myReaction, setMyReaction] = useState<ReactionLabelType | null>(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState(false);

  // 로딩 상태들
  const [isHideLoading, setIsHideLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isReactionLoading, setIsReactionLoading] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // 게시글 반응 관련 훅들
  const { mutate: createPostReaction } = usePostReactionCreate({
    onSuccess: (response) => {
      // 성공 후 최신 반응 상태를 GET으로 가져와서 업데이트
      fetchPostReaction({ postId: parseInt(postId) })
        .then((reactionData) => {
          setReactions(reactionData.reactionDetails);
          setMyReaction(reactionData.myReaction);
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

  const { mutate: updatePostReaction } = usePostReactionUpdate({
    onSuccess: (response) => {
      // 성공 후 최신 반응 상태를 GET으로 가져와서 업데이트
      fetchPostReaction({ postId: parseInt(postId) })
        .then((reactionData) => {
          console.log({ reactionData });
          setReactions(reactionData.reactionDetails);
          setMyReaction(reactionData.myReaction);
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

  const { mutate: deletePostReaction } = usePostReactionDelete({
    onSuccess: (response) => {
      // 성공 후 최신 반응 상태를 GET으로 가져와서 업데이트
      fetchPostReaction({ postId: parseInt(postId) })
        .then((reactionData) => {
          setReactions(reactionData.reactionDetails);
          setMyReaction(reactionData.myReaction);
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

  // 게시글 조회
  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPost(parseInt(postId));
      setPostData(response);
      setIsHidden(response.isHidden || false);

      // 게시글의 원본 감정 설정 (작성자가 설정한 감정)
      if (response.authorSelectEmotion) {
        // convertEmotionTypeToEmoticon 함수가 있다면 사용하거나, 직접 변환
        const emotionOption = EMOTICON_OPTIONS.find(
          (option) => option.value === response.authorSelectEmotion
        );
        setPostEmotion(emotionOption || null);
      }

      // 반응 통계 설정
      if (response.reactionDetailCount) {
        setReactions(response.reactionDetailCount);
      }

      // 내 반응 설정 (API에서 제공한다면)
      if (response.myReaction !== undefined) {
        setMyReaction(response.myReaction);
      }

      // 초기 로딩 시 사용자 반응 상태도 가져오기
      if (user) {
        try {
          const reactionData = await fetchPostReaction({
            postId: parseInt(postId),
          });
          setReactions(reactionData.reactionDetails);
          setMyReaction(reactionData.myReaction);
        } catch (reactionError) {
          // 반응 데이터가 없을 수도 있으므로 에러는 조용히 처리
          console.log(
            "반응 데이터가 없거나 가져오는데 실패했습니다:",
            reactionError
          );
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("게시글 조회 실패:", err);
      setError(
        err instanceof Error ? err.message : "게시글을 불러오는데 실패했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarkLoading) return;

    setIsBookmarkLoading(true);
    try {
      // TODO: 북마크 API 호출 (아직 구현되지 않음)
      // if (isBookmarked) {
      //   await removeBookmark(postData.postId);
      // } else {
      //   await addBookmark(postData.postId);
      // }

      setIsBookmarked(!isBookmarked);
      toast({
        description: isBookmarked
          ? "북마크에서 제거되었습니다"
          : "북마크에 추가되었습니다",
      });
    } catch (error) {
      console.error("북마크 처리 실패:", error);
      toast({
        title: "오류",
        description: "북마크 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleHide = async () => {
    if (!postData || isHideLoading) return;

    setIsHideLoading(true);
    try {
      if (isHidden) {
        // 현재 숨겨진 상태라면 공개하기
        await unhidePost(postData.postId);
        setIsHidden(false);
        toast({
          description: "게시글이 공개되었습니다.",
        });
      } else {
        // 현재 공개된 상태라면 숨기기
        await hidePost(postData.postId);
        setIsHidden(true);
        toast({
          description: "게시글이 숨겨졌습니다.",
        });
      }
    } catch (error) {
      console.error("게시글 숨김/공개 실패:", error);
      toast({
        title: "오류",
        description: "작업 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsHideLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postData || isDeleteLoading) return;

    setIsDeleteLoading(true);
    try {
      await deletePost(postData.postId);
      toast({
        title: "삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
      });
      // 삭제 후 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      toast({
        title: "삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleReport = () => {
    setReportModal(true);
  };

  const handleShare = () => {
    setShareModal(true);
  };

  const handleUserClick = () => {
    setUserProfileModal(true);
  };

  // 게시글 반응 처리 핸들러
  const handlePostReaction = async (reactionType: ReactionLabelType) => {
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
          createPostReaction({
            paths: { postId: parseInt(postId) },
            body: { type: reactionType },
          });
          break;
        case "update":
          updatePostReaction({
            paths: { postId: parseInt(postId) },
            body: { type: reactionType },
          });
          break;
        case "delete":
          deletePostReaction({
            paths: { postId: parseInt(postId), type: myReaction! },
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
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPost(postId);
  }, [postId]);

  if (isHidden) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">숨김 처리된 게시글입니다.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // postData가 없으면 렌더링하지 않음
  if (!postData) {
    return null;
  }

  const userMockData = {
    name: postData.nickname,
    avatar: "/placeholder.svg",
    joinedDate: "2024-01-15",
    stats: {
      followers: 124,
      following: 89,
      posts: 15,
    },
    badges: ["Active Writer", "Community Helper"],
    recentActivity: [
      "Posted a new story",
      "Commented on 3 posts",
      "Joined a writing group",
    ],
  };

  return (
    <article className="mb-8">
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {/* 게시글의 원본 감정 표시 */}
                {postEmotion && (
                  <Badge className={postEmotion.color}>
                    {postEmotion.emotionType} {postEmotion.label}
                  </Badge>
                )}
                {!postEmotion && (
                  <Badge className="bg-gray-200 text-gray-800">감정 없음</Badge>
                )}
              </div>

              {/* Title with Bookmark and Share icons */}
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">
                  {postData.afterTitle}
                </h1>
                <div className="flex items-center space-x-1 ml-4">
                  <BookmarkButton
                    isBookmarked={isBookmarked}
                    onClick={handleBookmark}
                  />
                  <ShareButton onClick={handleShare} />
                </div>
              </div>

              {/* Author and Time */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUserClick}
                    className="text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
                  >
                    {postData.nickname}
                  </button>
                  <span className="text-sm text-gray-500">
                    {utcToLocaleDateString(postData.createdAt)}
                  </span>
                </div>

                {/* Action buttons - right aligned */}
                <div className="flex items-center space-x-3">
                  <HideButton
                    isHidden={isHidden}
                    onClick={handleHide}
                    isMine={postData.isMine ? postData.isMine : false}
                    className="flex-shrink-0 text-sm px-3 py-1.5 h-8"
                    size="sm"
                    disabled={isHideLoading}
                  />
                  <DeleteButton
                    onClick={handleDelete}
                    isMine={postData.isMine ? postData.isMine : false}
                    confirmDescription="이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다."
                    className="flex-shrink-0 text-sm px-3 py-1.5 h-8"
                    size="sm"
                    disabled={isDeleteLoading}
                  />
                  <ReportButton
                    onClick={handleReport}
                    className="flex-shrink-0 text-sm px-3 py-1.5 h-8"
                    size="sm"
                  >
                    신고
                  </ReportButton>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          {postData.imgUrl && (
            <div className="mb-6">
              <Image
                src={postData.imgUrl || "/placeholder.svg"}
                alt="Post image"
                width={500}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-gray max-w-none mb-6">
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {postData.afterContent}
            </div>
          </div>

          {/* AI Score - 항상 표시하되, 없으면 준비중 상태 */}
          <div className="mb-6">
            <PostAiScore post={postData} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {/* Reaction Buttons */}
              <ReactionButtons
                reactions={reactions}
                myReaction={myReaction}
                onReactionClick={handlePostReaction}
                isAuthenticated={!!user}
                isLoading={isReactionLoading}
                size="default"
                showAllReactions={true}
              />

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{postData.commentCount}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReportModal
        isOpen={reportModal}
        onClose={() => setReportModal(false)}
        type="post"
        targetId={postData.postId}
        targetTitle={postData.afterTitle}
      />
      <ShareModal
        isOpen={shareModal}
        onClose={() => setShareModal(false)}
        postTitle={postData.afterTitle}
        postId={postData.postId}
      />
      <UserProfileModal
        isOpen={userProfileModal}
        onClose={() => setUserProfileModal(false)}
        userData={userMockData}
      />
    </article>
  );
}
