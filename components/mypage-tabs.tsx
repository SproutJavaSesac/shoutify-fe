"use client";

import { deletePost, hidePost, unhidePost } from "@/apis/posts";
import {
  Pagination as CommonPagination,
  DeleteButton,
  HideButton,
  PostWriteButton,
} from "@/components/commons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MEMBER_ROUTES } from "@/constants/members";
import { POST_ROUTES } from "@/constants/posts";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useMyComments, useMyInfo, useMyPosts } from "@/lib/hooks/useMembers";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ExternalLinkIcon,
  Heart,
  Loader2,
  MessageCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const bookmarkedPosts = [
  {
    id: 3,
    title: "Love's Gentle Refrain",
    author: "RomanticSoul",
    emotion: "romantic",
    reactions: 67,
    comments: 22,
  },
  {
    id: 4,
    title: "The Courage Within",
    author: "BraveHeart",
    emotion: "inspiring",
    reactions: 43,
    comments: 18,
  },
];

const badges = [
  {
    id: 1,
    name: "First Post",
    description: "Published your first post",
    earned: true,
    icon: "🎉",
  },
  {
    id: 2,
    name: "Poet Laureate",
    description: "Posts in all categories",
    earned: true,
    icon: "👑",
  },
  {
    id: 3,
    name: "Popular Writer",
    description: "10+ reactions on a post",
    earned: true,
    icon: "❤️",
  },
  {
    id: 4,
    name: "Community Favorite",
    description: "10+ bookmarks on a post",
    earned: false,
    icon: "⭐",
  },
  {
    id: 5,
    name: "Regular Visitor",
    description: "10th visit to the site",
    earned: true,
    icon: "🏠",
  },
  {
    id: 6,
    name: "Conversation Starter",
    description: "10+ comments on your posts",
    earned: false,
    icon: "💬",
  },
  {
    id: 7,
    name: "Literary Master",
    description: "50+ total reactions",
    earned: false,
    icon: "📚",
  },
  {
    id: 8,
    name: "Dedicated Reader",
    description: "50+ bookmarked posts",
    earned: false,
    icon: "🔖",
  },
  {
    id: 9,
    name: "Active Commenter",
    description: "25+ comments posted",
    earned: false,
    icon: "✍️",
  },
  {
    id: 10,
    name: "Emotion Explorer",
    description: "Used all emotion tags",
    earned: false,
    icon: "🎭",
  },
  {
    id: 11,
    name: "Weekly Writer",
    description: "Posted every day for a week",
    earned: false,
    icon: "📅",
  },
  {
    id: 12,
    name: "Community Champion",
    description: "Helped moderate content",
    earned: false,
    icon: "🛡️",
  },
];

const emotionTypeColors: { [key: string]: string } = {
  기쁨: "bg-yellow-100 text-yellow-800",
  슬픔: "bg-blue-100 text-blue-800",
  분노: "bg-red-100 text-red-800",
  흥미: "bg-orange-100 text-orange-800",
  혼란: "bg-purple-100 text-purple-800",
  자랑: "bg-green-100 text-green-800",
  // 영어 키도 유지 (기존 데이터 호환성)
  HAPPY: "bg-yellow-100 text-yellow-800",
  SAD: "bg-blue-100 text-blue-800",
  ANGRY: "bg-red-100 text-red-800",
  EXCITED: "bg-orange-100 text-orange-800",
  CONFUSED: "bg-purple-100 text-purple-800",
  PROUD: "bg-green-100 text-green-800",
};

// 감정 타입 영어 → 한국어 변환 맵
const emotionTypeTranslation: { [key: string]: string } = {
  HAPPY: "기쁨",
  SAD: "슬픔",
  ANGRY: "분노",
  EXCITED: "흥미",
  CONFUSED: "혼란",
  PROUD: "자랑",
};

// 기존 로컬 Pagination 함수를 제거하고 CommonPagination 사용

export function MyPageTabs() {
  const [activeTab, setActiveTab] = useState("posts");
  const [postsPage, setPostsPage] = useState(0);
  const [commentsPage, setCommentsPage] = useState(0);
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set());

  const { user } = useAuth();
  const router = useRouter();
  const { data: myInfo, loading: infoLoading, error: infoError } = useMyInfo();

  // 파라미터 객체를 메모이제이션하여 무한 렌더링 방지
  const postsParams = useMemo(
    () => ({ page: postsPage, size: 5 }),
    [postsPage]
  );
  const commentsParams = useMemo(
    () => ({ page: commentsPage, size: 10 }),
    [commentsPage]
  );

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useMyPosts(postsParams);
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
  } = useMyComments(commentsParams);

  const togglePostExpansion = (postId: number) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const handlePostAction = async (
    postId: number,
    action: "hide" | "unhide" | "delete"
  ) => {
    if (loadingActions.has(postId)) return;

    setLoadingActions((prev) => new Set([...prev, postId]));

    try {
      switch (action) {
        case "hide":
          await hidePost(postId);
          toast({ title: "성공", description: "게시글을 숨겼습니다." });
          break;
        case "unhide":
          await unhidePost(postId);
          toast({ title: "성공", description: "게시글을 공개했습니다." });
          break;
        case "delete":
          await deletePost(postId);
          toast({ title: "성공", description: "게시글을 삭제했습니다." });
          break;
      }

      // 액션 후 데이터 새로고침
      refetchPosts();
    } catch (error) {
      console.error("Post action error:", error);
      toast({
        title: "오류",
        description: "작업 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoadingActions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  if (infoLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">내 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (infoError) {
    return (
      <div className="text-center py-12 text-red-600">
        정보를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.
      </div>
    );
  }

  if (!user || !myInfo) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={myInfo.profileImageUrl ?? "/placeholder.svg"}
                alt={myInfo.nickname}
              />
              <AvatarFallback className="text-lg">
                {myInfo.nickname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {myInfo.nickname}
              </h1>
              <p className="text-gray-600 mb-4">{myInfo.email}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {myInfo.postCount}
                  </div>
                  <div className="text-sm text-gray-600">게시글</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {myInfo.reactionCount}
                  </div>
                  <div className="text-sm text-gray-600">반응</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">234</div>
                  <div className="text-sm text-gray-600">북마크</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {myInfo.commentCount}
                  </div>
                  <div className="text-sm text-gray-600">댓글</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href={MEMBER_ROUTES.MY_INFO_EDIT}>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 text-sm px-3 py-1.5 h-8"
                    size="sm"
                  >
                    <Settings className="h-4 w-4" />
                    <span>프로필 수정</span>
                  </Button>
                </Link>
                <Link href={MEMBER_ROUTES.MEMBER_PROFILE(myInfo.memberId)}>
                  <Button
                    className="flex items-center space-x-2 text-sm px-3 py-1.5 h-8"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>공개 프로필 보기</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">내 게시글</TabsTrigger>
          <TabsTrigger value="comments">댓글</TabsTrigger>
          <TabsTrigger value="bookmarks">북마크</TabsTrigger>
          <TabsTrigger value="badges">배지</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {postsLoading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {postsError && (
            <div className="text-center py-10 text-red-500">
              게시글을 불러오는데 실패했습니다.
            </div>
          )}
          {!postsLoading && !postsError && postsData?.posts?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">✍️</div>
              <p className="text-gray-500 mb-1">
                아직 작성한 게시글이 없습니다
              </p>
              <p className="text-gray-400 text-sm">
                첫 번째 게시글을 작성해보세요!
              </p>
              <PostWriteButton
                onClick={() => router.push(POST_ROUTES.CREATE)}
                className="mt-4 text-sm px-3 py-1.5 h-8"
              >
                게시글 작성하기
              </PostWriteButton>
            </div>
          )}
          {!postsLoading &&
            !postsError &&
            postsData?.posts?.map((post) => {
              const isExpanded = expandedPosts.has(post.postId);
              const isLoading = loadingActions.has(post.postId);

              return (
                <Card key={post.postId}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          <Badge
                            className={
                              emotionTypeColors[
                                emotionTypeTranslation[post.emotionType] ||
                                  post.emotionType
                              ] || "bg-gray-100 text-gray-800"
                            }
                          >
                            {emotionTypeTranslation[post.emotionType] ||
                              post.emotionType}
                          </Badge>
                          <Badge variant="outline">{post.conceptType}</Badge>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                              locale: ko,
                            })}
                          </span>
                          {post.isHidden && (
                            <Badge variant="secondary">숨김</Badge>
                          )}
                        </div>

                        <Link href={POST_ROUTES.DETAIL(post.postId)}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                            {post.afterTitle || post.beforeTitle}
                          </h3>
                        </Link>

                        <div className="space-y-3">
                          {isExpanded ? (
                            <>
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  원문:
                                </p>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                  {post.beforeContent}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  AI 변환:
                                </p>
                                <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded">
                                  {post.afterContent}
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {post.afterContent || post.beforeContent}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{post.reactionCount}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.commentCount}</span>
                            </span>
                            <Link
                              href={POST_ROUTES.DETAIL(post.postId)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLinkIcon className="h-4 w-4" />
                              <span>게시글 보기</span>
                            </Link>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePostExpansion(post.postId)}
                            className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1.5 h-8"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                간략히 보기
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                전체 보기
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col items-center space-y-2 ml-4">
                        <HideButton
                          isMine={true}
                          isHidden={post.isHidden}
                          onClick={() =>
                            handlePostAction(
                              post.postId,
                              post.isHidden ? "unhide" : "hide"
                            )
                          }
                          disabled={isLoading}
                          size="sm"
                          className="text-sm px-3 py-1.5 h-8 min-w-[60px]"
                        />
                        <DeleteButton
                          isMine={true}
                          onClick={() =>
                            handlePostAction(post.postId, "delete")
                          }
                          disabled={isLoading}
                          size="sm"
                          className="text-sm px-3 py-1.5 h-8 min-w-[60px]"
                          confirmDescription="정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          <CommonPagination
            pagination={postsData?.pagination}
            onPageChange={setPostsPage}
            showFirstLastButtons={true}
          />
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {commentsLoading && (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {commentsError && (
            <div className="text-center py-10 text-red-500">
              댓글을 불러오는데 실패했습니다.
            </div>
          )}
          {!commentsLoading &&
            !commentsError &&
            commentsData?.comments?.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">💬</div>
                <p className="text-gray-500 mb-1">
                  아직 작성한 댓글이 없습니다
                </p>
                <p className="text-gray-400 text-sm">
                  다른 사용자의 게시글에 댓글을 남겨보세요!
                </p>
              </div>
            )}
          {!commentsLoading &&
            !commentsError &&
            commentsData?.comments?.map((comment) => (
              <Card key={comment.commentId}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-500">게시글:</span>
                        <Link
                          href={POST_ROUTES.DETAIL(comment.postId)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {comment.postTitle}
                        </Link>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-3">
                        {comment.afterContent}
                      </p>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Heart className="h-4 w-4" />
                        <span>{comment.reactionCount} 반응</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          <CommonPagination
            pagination={commentsData?.pagination}
            onPageChange={setCommentsPage}
            showFirstLastButtons={true}
          />
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-4">
          {bookmarkedPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">🔖</div>
              <p className="text-gray-500 mb-1">
                아직 북마크한 게시글이 없습니다
              </p>
              <p className="text-gray-400 text-sm">
                마음에 드는 게시글에 북마크를 추가해보세요!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {bookmarkedPosts.map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <Badge
                      className={`mb-2 ${
                        emotionTypeColors[
                          post.emotion as keyof typeof emotionTypeColors
                        ]
                      }`}
                    >
                      {post.emotion}
                    </Badge>

                    <Link href={POST_ROUTES.DETAIL(post.id)}>
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 mb-3">
                      작성자: {post.author}
                    </p>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.reactions}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`${
                  badge.earned
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2 opacity-75">
                    {badge.earned ? badge.icon : "🔒"}
                  </div>
                  <h3
                    className={`font-semibold mb-1 ${
                      badge.earned ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {badge.name}
                  </h3>
                  <p
                    className={`text-xs ${
                      badge.earned ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                      획득함
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>배지 진행도</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {badges.filter((b) => b.earned).length} / {badges.length}
                </div>
                <p className="text-gray-600">획득한 배지</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (badges.filter((b) => b.earned).length /
                          badges.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
