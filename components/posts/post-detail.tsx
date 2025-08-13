"use client";

import { getPost } from "@/apis/posts";
import {
  ReactionButtons,
  BookmarkButton,
  DeleteButton,
  HideButton,
  ReportButton,
  ShareButton,
} from "@/components/commons";
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
import { utcToLocaleDateString } from "@/lib/utils";
import { Post } from "@/types/posts";
import {
  EmotionOption,
  ReactionDetailCountMap,
  ReactionLabelType,
} from "@/types/reactions";
import { Eye, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const postMockData = {
  author: "LiteraryMuse",
  emotion: "melancholy",
  reactions: { "❤️": 15, "😊": 8, "😢": 12, "🤔": 7, "👏": 3 },
  comments: 12,
  bookmarks: 23,
};

const emotionColors = {
  melancholy: "bg-blue-100 text-blue-800",
};

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

  const { toast } = useToast();
  const { user } = useAuth();

  // 게시글 리액션 훅들
  const { mutate: createReaction } = usePostReactionCreate({
    onSuccess: (response) => {
      setReactions(response.reactionDetails);
      setMyReaction(response.reaction);
      toast({
        description: "반응을 표시했습니다.",
      });
    },
    onError: (errorMessage) => {
      toast({
        title: "반응 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const { mutate: updateReaction } = usePostReactionUpdate({
    onSuccess: (response) => {
      setReactions(response.reactionDetails);
      setMyReaction(response.reaction);
      toast({
        description: "반응을 변경했습니다.",
      });
    },
    onError: (errorMessage) => {
      toast({
        title: "반응 변경 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteReaction } = usePostReactionDelete({
    onSuccess: (response) => {
      setReactions(response.reactionDetails);
      setMyReaction(null);
      toast({
        description: "반응을 취소했습니다.",
      });
    },
    onError: (errorMessage) => {
      toast({
        title: "반응 취소 실패",
        description: errorMessage,
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
      if (response.emotion) {
        // convertEmotionTypeToEmoticon 함수가 있다면 사용하거나, 직접 변환
        const emotionOption = EMOTICON_OPTIONS.find(
          (option) => option.value === response.emotion
        );
        setPostEmotion(emotionOption || null);
      }

      // 반응 통계 설정
      if (response.reactionDetailCount) {
        setReactions(response.reactionDetailCount);
      }

      // 내 반응 설정 (API에서 제공한다면)
      // setMyReaction(response.myReaction || null);

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

  const handleReaction = (reactionType: ReactionLabelType) => {
    if (!postData) return;

    // 현재 선택된 반응과 같은 반응을 다시 클릭한 경우 - 삭제
    if (myReaction === reactionType) {
      deleteReaction({
        paths: { postId },
      });
    }
    // 처음 반응을 선택하는 경우 - 생성
    else if (!myReaction) {
      createReaction({
        paths: { postId },
        body: { type: reactionType },
      });
    }
    // 다른 반응으로 변경하는 경우 - 수정
    else {
      updateReaction({
        paths: { postId },
        body: { type: reactionType },
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      description: isBookmarked
        ? "북마크에서 제거되었습니다"
        : "북마크에 추가되었습니다",
    });
  };

  const handleHide = () => {
    setIsHidden(true);
    toast({
      description: "게시글이 숨겨졌습니다.",
    });
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
                <div className="flex items-center space-x-2">
                  {postData.isMine && (
                    <>
                      <HideButton isHidden={isHidden} onClick={handleHide} />
                      <DeleteButton
                        onClick={() => {
                          /* TODO: 삭제 로직 구현 */
                        }}
                      >
                        Delete
                      </DeleteButton>
                    </>
                  )}
                  <ReportButton onClick={handleReport}>Report</ReportButton>
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

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {/* Reaction Buttons */}
              <ReactionButtons
                reactions={reactions}
                myReaction={myReaction}
                onReactionClick={handleReaction}
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
