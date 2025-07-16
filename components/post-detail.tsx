"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Eye,
  Flag,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { ReportModal } from "@/components/report-modal";
import { ShareModal } from "@/components/share-modal";
import { UserProfileModal } from "@/components/user-profile-modal";
import { getPost } from "@/apis/posts";
import { Post } from "@/types/posts";
import { utcToLocaleDateString } from "@/lib/utils";

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

// const reactionEmojis = {
//     "happy": "❤️",
//     "sad": "😢",
//     "angry": "😠",
//     "excited": "🎉",
//     "confused": "🤔",
//     "proud": "👏",
// }
const reactionEmojis = ["❤️", "😊", "😢", "🤔", "👏"];

export function PostDetail({ postId }: Readonly<{ postId: string }>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postData, setPostData] = useState<Post>();
  const [reactions, setReactions] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState(false);
  const { toast } = useToast();

  // 게시글 조회
  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPost(parseInt(postId));
      setPostData(response);
      setIsHidden(response.isHidden || false);
      setLoading(false);
    } catch (err) {
      console.error("게시글 조회 실패:", err);
      setError(
        err instanceof Error ? err.message : "게시글을 불러오는데 실패했습니다",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = (emoji: string) => {
    setReactions((prev) => (prev === emoji ? null : emoji));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      description: isBookmarked
        ? "Removed from bookmarks"
        : "Added to bookmarks",
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
                {/*<Badge className={emotionColors[postData.emotion as keyof typeof emotionColors]}>*/}
                {/*    {postData.emotion}*/}
                {/*</Badge>*/}
                <Badge className={emotionColors["melancholy"]}>
                  {"melancholy"}
                </Badge>
              </div>

              {/* Title with Bookmark and Share icons */}
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">
                  {postData.afterTitle}
                </h1>
                <div className="flex items-center space-x-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${isBookmarked ? "text-blue-600" : ""}`}
                    onClick={handleBookmark}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={handleHide}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Hide
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleReport}
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    Report
                  </Button>
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
              {/* Reaction Buttons with individual counts */}
              <div className="flex items-center space-x-2">
                {reactionEmojis.map((emoji) => (
                  <div key={emoji} className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${reactions === emoji ? "bg-gray-100 ring-2 ring-blue-300" : ""}`}
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </Button>
                    <span className="text-sm text-gray-500 ml-1">
                      {
                        postMockData.reactions[
                          emoji as keyof typeof postMockData.reactions
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>

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
