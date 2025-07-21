"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, MessageCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";
import type { Comment } from "@/types/comments";
import { utcToLocaleDateString } from "@/lib/utils";

// const commentsData = [
//   {
//     id: 1,
//     author: "PoetryLover",
//     time: "1 hour ago",
//     content:
//       "Your words paint such vivid imagery of autumn's melancholy. The metaphor of leaves dancing their final waltz is particularly moving.",
//     reactions: { "❤️": 3, "😊": 2, "😢": 1, "🤔": 1, "👏": 1 },
//     replies: [
//       {
//         id: 11,
//         author: "LiteraryMuse",
//         time: "45 minutes ago",
//         content:
//           "Thank you for your kind words. Autumn has always spoken to my soul in whispers of change and beauty.",
//         reactions: { "❤️": 2, "😊": 1, "😢": 0, "🤔": 0, "👏": 0 },
//         replies: [],
//       },
//     ],
//   },
//   {
//     id: 2,
//     author: "NightWriter",
//     time: "2 hours ago",
//     content:
//       "The transformation from your original thoughts to this literary masterpiece is remarkable. The AI truly captured the essence of melancholy.",
//     reactions: { "❤️": 5, "😊": 3, "😢": 2, "🤔": 1, "👏": 1 },
//     replies: [],
//   },
// ];

// TODO order가 무작위로 오는 경우 고려?
const commentsData: Comment[] = [
  {
    commentId: 1,
    commenterId: 2,
    commenterNickname: "슬기로운 미어캣",
    parentId: null,
    order: 1,
    level: 0,
    content: "정말 좋은 글이네요. AI가 다듬은 댓글입니다.",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: false,
    createdAt: new Date(new Date("2025-07-06T16:26:47")),
    updatedAt: new Date(new Date("2025-07-06T16:26:47")),
  },
  {
    commentId: 7,
    commenterId: 8,
    commenterNickname: "자유로운 돌고래",
    parentId: 1,
    order: 2,
    level: 1,
    content: "동의합니다! 저도 같은 생각을 했습니다.",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: true,
    createdAt: new Date(new Date("2025-07-06T16:26:47")),
    updatedAt: new Date(new Date("2025-07-06T16:26:47")),
  },
  {
    commentId: 13,
    commenterId: 4,
    commenterNickname: "신비로운 유니콘",
    parentId: 7,
    order: 3,
    level: 2,
    content: "두 분 모두 정말 대단하십니다.",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: false,
    createdAt: new Date(new Date("2025-07-06T16:26:47")),
    updatedAt: new Date(new Date("2025-07-06T16:26:47")),
  },
  {
    commentId: 8,
    commenterId: null,
    commenterNickname: "알 수 없음",
    parentId: 1,
    order: 4,
    level: 1,
    content: "삭제된 내용입니다",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: true,
    isReported: false,
    isMine: false,
    createdAt: new Date("2025-07-06T16:26:47"),
    updatedAt: new Date("2025-07-06T16:26:47"),
  },
  {
    commentId: 2,
    commenterId: 3,
    commenterNickname: "용감한 펭귄",
    parentId: null,
    order: 5,
    level: 0,
    content: "많은 것을 배우고 갑니다.",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: false,
    createdAt: new Date("2025-07-06T16:26:47"),
    updatedAt: new Date("2025-07-06T16:26:47"),
  },
  {
    commentId: 9,
    commenterId: 10,
    commenterNickname: "명상하는 여우",
    parentId: 2,
    order: 6,
    level: 1,
    content: "도움이 되셨다니 다행입니다.",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: false,
    createdAt: new Date("2025-07-06T16:26:47"),
    updatedAt: new Date("2025-07-06T16:26:47"),
  },
  {
    commentId: 3,
    commenterId: 4,
    commenterNickname: "신비로운 유니콘",
    parentId: null,
    order: 7,
    level: 0,
    content: "혹시 이 부분에 대해 조금 더 자세히 설명해주실 수 있을까요?",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: true,
    createdAt: new Date("2025-07-06T16:26:47"),
    updatedAt: new Date("2025-07-06T16:26:47"),
  },
  {
    commentId: 10,
    commenterId: 1,
    commenterNickname: "행복한 코알라",
    parentId: 3,
    order: 8,
    level: 1,
    content: "어떤 부분이 가장 궁금하신가요?",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: false,
    createdAt: new Date("2025-07-06T16:26:47"),
    updatedAt: new Date("2025-07-06T16:26:47"),
  },
  {
    commentId: 14,
    commenterId: 5,
    commenterNickname: "춤추는 알파카",
    parentId: 10,
    order: 9,
    level: 2,
    content: "세 번째 문단이 특히 궁금합니다!",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: false,
    isReported: false,
    isMine: false,
    createdAt: new Date("2025-07-06T16:26:47"),
    updatedAt: new Date("2025-07-06T16:26:47"),
  },
  {
    commentId: 4,
    commenterId: null,
    commenterNickname: "알 수 없음",
    parentId: null,
    order: 10,
    level: 0,
    content: "삭제된 내용입니다",
    reactionCount: 6,
    reactions: {
      EXCITED: 2,
      HAPPY: 3,
      ANGRY: 0,
      SAD: 1,
    },
    isDeleted: true,
    isReported: false,
    isMine: false,
    createdAt: new Date("2025-07-06T16:26:47"),
    updatedAt: new Date("2025-07-06T16:26:47"),
  },
];

// 문자열 키와 이모티콘 매핑 (기존 reactionEmojis 대신 사용)
const reactionMapping = {
  HAPPY: "😊",
  SAD: "😢",
  ANGRY: "😡",
  EXCITED: "🤩",
  CONFUSED: "🤔",
  PROUD: "👏",
} as const;
//
// // CommentComponent 내부의 reactions 렌더링 부분을 다음과 같이 변경:
// <div className="flex items-center space-x-2">
//   {Object.entries(comment.reactions).map(([reactionType, count]) => {
//     const emoji = reactionMapping[reactionType as keyof typeof reactionMapping];
//     if (!emoji || count === 0) return null;
//
//     return (
//       <div key={reactionType} className="flex items-center">
//         <Button
//           variant="ghost"
//           size="sm"
//           className={`h-6 w-6 p-0 text-xs ${
//             commentReactions[comment.commentId] === reactionType
//               ? "bg-gray-100 ring-2 ring-blue-300"
//               : ""
//           }`}
//           onClick={() => handleCommentReaction(comment.commentId, reactionType)}
//         >
//           {emoji}
//         </Button>
//         <span className="text-xs text-gray-500 ml-1">{count}</span>
//       </div>
//     );
//   })}
// </div>;
//
const reactionEmojis = ["❤️", "😊", "😢", "🤔", "👏"];

export function CommentsSection({ postId }: Readonly<{ postId: string }>) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentReactions, setCommentReactions] = useState<{
    [key: number]: string | null;
  }>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmitComment = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (newComment.trim()) {
      toast({
        description: "Comment posted successfully",
      });
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: number) => {
    if (replyText.trim()) {
      toast({
        description: "Reply posted successfully",
      });
      setReplyText("");
      setReplyingTo(null);
    }
  };
  //
  // const handleCommentReaction = (commentId: number, emoji: string) => {
  //   setCommentReactions((prev) => ({
  //     ...prev,
  //     [commentId]: prev[commentId] === emoji ? null : emoji,
  //   }));
  // };

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
      className={`${level > 0 ? "mt-4" : ""} ${level === 1 ? "pl-8" : level === 2 ? "pl-16" : ""}`}
    >
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-medium text-gray-9110">
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
              {Object.entries(comment.reactions).map(
                ([reactionType, count]) => {
                  const emoji =
                    reactionMapping[
                      reactionType as keyof typeof reactionMapping
                    ];
                  if (!emoji || count === 0) return null;

                  return (
                    <div key={reactionType} className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 text-xs ${
                          commentReactions[comment.commentId] === reactionType
                            ? "bg-gray-100 ring-2 ring-blue-300"
                            : ""
                        }`}
                        onClick={() =>
                          handleCommentReaction(comment.commentId, reactionType)
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

            {level < 2 && (
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
                Reply
              </Button>
            )}
          </div>

          {replyingTo === comment.commentId && (
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.commentId)}
                >
                  Reply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/*{comment.replies?.map((reply: any) => (*/}
      {/*  <CommentComponent key={reply.id} comment={reply} level={level + 1} />*/}
      {/*))}*/}
    </div>
  );

  return (
    <section id="comments" className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Comments ({commentsData.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Commenting as</span>
                <span className="text-sm font-medium">@{user.nickname}</span>
              </div>
              <Textarea
                placeholder="Share your thoughts on this literary piece..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {1000 - newComment.length} characters remaining
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">
                Sign in to join the literary discussion
              </p>
              <Button onClick={() => setShowAuthModal(true)}>
                Sign In to Comment
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {commentsData.map((comment) => (
              <CommentComponent
                key={comment.commentId}
                comment={comment}
                level={comment.level}
              />
            ))}
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
