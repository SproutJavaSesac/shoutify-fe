"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useCommentDelete } from "@/lib/hooks/useComments";
import {
  useMyBadges,
  useMyComments,
  useMyInfo,
  useMyPosts,
} from "@/lib/hooks/useMembers";
import {
  usePostDelete,
  usePostHide,
  usePostUnhide,
} from "@/lib/hooks/usePosts";
import {
  Award,
  Edit,
  Eye,
  FileText,
  Loader2,
  MessageCircle,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { useMemo } from "react";
import { MyCommentList } from "./my-comment-list";
import { MyPostList } from "./my-post-list";

export function MyPageContent() {
  const { toast } = useToast();
  const { user } = useAuth();

  // API 훅들 - 전역 에러 처리 적용
  const paginationParams = useMemo(() => ({ page: 0, size: 20 }), []);
  const apiOptions = useMemo(() => ({ immediate: true }), []);

  const badgeImages = [
    {
      badgeId: 1,
      name: "첫 게시글",
      description: "첫 번째 게시글을 작성한 사용자에게 주어지는 배지입니다.",
      badgeImage: "📝",
    },
    {
      badgeId: 2,
      name: "새로운 가족",
      description: "회원가입을 완료한 새로운 멤버에게 주어지는 배지입니다.",
      badgeImage: "👋️",
    },
    {
      badgeId: 3,
      name: "신진 작가",
      description: "게시글을 10개 이상 작성하는 사용자에게 주어지는 배지입니다.",
      badgeImage: "✍",
    },
    {
      badgeId: 4,
      name: "소통의 시작",
      description: "첫 번째 댓글을 작성한 사용자에게 주어지는 배지입니다.",
      badgeImage: "💬",
    },
    {
      badgeId: 5,
      name: "리액션 요정",
      description: "댓글을 5회 이상 작성한 사용자에게 주어지는 배지입니다.",
      badgeImage: "✨",
    },
    {
      badgeId: 6,
      name: "인기 게시글",
      description: "작성한 게시글에 댓글이 5개 이상 달린 사용자에게 주어지는 배지입니다.",
      badgeImage: "🔥",
    },
    {
      badgeId: 7,
      name: "첫 반응하기",
      description: "첫 번째 반응하기를 실행한 사용자에게 주어지는 배지입니다.",
      badgeImage: "👍",
    },
    {
      badgeId: 8,
      name: "다정한 이웃",
      description: "반응하기를 10회 이상 실행한 사용자에게 주어지는 배지입니다.",
      badgeImage: "❤️",
    },
    {
      badgeId: 9,
      name: "첫 랭킹 진입",
      description: "첫 번째로 랭킹에 진입한 사용자에게 주어지는 배지입니다.",
      badgeImage: "🏆",
    }
  ]

  const {
    data: myInfo,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useMyInfo(apiOptions);
  const {
    data: postsData,
    loading: postsLoading,
    refetch: refetchPosts,
    error: postsError,
  } = useMyPosts(paginationParams, apiOptions);
  const {
    data: commentsData,
    loading: commentsLoading,
    refetch: refetchComments,
    error: commentsError,
  } = useMyComments(paginationParams, apiOptions);
  const {
    data: badgesData,
    loading: badgesLoading,
    error: badgesError,
    refetch: refetchBadges,
  } = useMyBadges();

  const {
    mutate: deletePost,
    loading: isDeleting,
    error: deleteError,
  } = usePostDelete({
    onSuccess: (response) => {
      toast({
        description: "게시글이 삭제되었습니다.",
      });
      refetchPosts(); // 목록 새로고침
    },
    onError: (error) => {
      toast({
        title: "삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
  const {
    mutate: hidePost,
    loading: isHiding,
    error: hideError,
  } = usePostHide({
    onSuccess: (response) => {
      toast({
        description: "게시글이 숨김 처리되었습니다.",
      });
      refetchPosts(); // 목록 새로고침
    },
    onError: (error) => {
      toast({
        title: "숨김 처리 실패",
        description: "게시글 숨김 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
  const {
    mutate: unhidePost,
    loading: isUnhiding,
    error: unhideError,
  } = usePostUnhide({
    onSuccess: (response) => {
      toast({
        description: "게시글이 공개 처리되었습니다.",
      });
      refetchPosts(); // 목록 새로고침
    },
    onError: (error) => {
      toast({
        title: "공개 처리 실패",
        description: "게시글 공개 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const {
    mutate: deleteComment,
    loading: isDeletingComment,
    error: deleteCommentError,
  } = useCommentDelete({
    onSuccess: (response) => {
      toast({
        description: "댓글이 삭제되었습니다.",
      });
      refetchComments(); // 목록 새로고침
    },
    onError: (error) => {
      toast({
        title: "삭제 실패",
        description: "댓글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const posts = postsData?.posts || [];
  const comments = commentsData?.comments || [];
  const badges = badgesData?.badgeSummaries || []; // 404 시 전역에서 null 반환, 여기서 빈 배열로 fallback
  const isLoading =
    profileLoading || postsLoading || commentsLoading || badgesLoading;

  // 치명적 에러들만 체크 (배지는 선택적 기능이므로 제외)
  const hasError = profileError || postsError || commentsError;
  // 배지 에러는 조용히 처리됨 (SILENT_NOT_FOUND는 에러 상태이지만 앱 중단하지 않음)

  const handleEditProfile = () => {
    // TODO: 프로필 수정 기능 구현
    toast({
      title: "개발 중",
      description: "프로필 수정 기능은 준비 중입니다.",
    });
  };

  const handleViewPublicProfile = () => {
    // TODO: 공개 프로필 페이지 구현
    toast({
      title: "개발 중",
      description: "공개 프로필 보기 기능은 준비 중입니다.",
    });
  };

  const handleDeletePost = async (postId: number) => {
    await deletePost({ paths: {postId} });
  };

  const handleHidePost = async (postId: number) => {
    await hidePost({ paths: {postId} });
  };

  const handleUnhidePost = async (postId: number) => {
    await unhidePost({ paths: { postId } });
  };

  const handleDeleteComment = async (commentId: number | string) => {
    await deleteComment({ commentId });
  };

  const stats = {
    totalPosts: posts?.length || 0,
    publicPosts: posts?.filter((p) => !p.isHidden).length || 0,
    hiddenPosts: posts?.filter((p) => p.isHidden).length || 0,
    totalComments: comments?.length || 0,
    totalReactions:
      posts?.reduce((sum, post) => sum + (post.reactionCount || 0), 0) || 0,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {hasError ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              데이터 로딩 중 오류 발생
            </h3>
            <p className="text-gray-500 mb-4">
              일시적인 문제일 수 있습니다. 다시 시도해주세요.
            </p>
            <Button
              onClick={() => {
                // 치명적 에러가 발생한 API들만 재시도
                if (profileError) refetchProfile?.();
                if (postsError) refetchPosts?.();
                if (commentsError) refetchComments?.();
                // 배지는 전역에서 처리되므로 별도 재시도 불필요
              }}
              className="mt-4"
            >
              다시 시도
            </Button>
            {/* 배지 에러 정보는 표시하지 않음 (전역에서 조용히 처리됨) */}
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      ) : (
        <>
          {/* 프로필 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                프로필 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {user?.nickname || myInfo?.nickname || "사용자"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {posts.length > 0
                        ? "활발한 커뮤니티 멤버"
                        : "새로운 멤버"}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>가입일: 2024년</span>
                      <span>•</span>
                      <span>총 반응: {myInfo?.reactionCount || 0}개</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleEditProfile}>
                    <Edit className="h-4 w-4 mr-2" />
                    프로필 수정
                  </Button>
                  <Button variant="outline" onClick={handleViewPublicProfile}>
                    <Eye className="h-4 w-4 mr-2" />
                    공개 프로필 보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />내 게시글
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalPosts}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  공개 {stats.publicPosts} • 숨김 {stats.hiddenPosts}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />내 댓글
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalComments}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  활발한 소통 참여
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  받은 반응
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalReactions}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  다른 사용자들의 반응
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  획득 배지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-500 mt-1">
                  배지 시스템 준비 중
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 배지 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 획득한 배지 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  획득한 배지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  {badgeImages.filter((badge) => {
                        for (let i = 0; i < badges.length; i++) {
                          if (badge.badgeId === badges[i].badgeId) {
                            return false;
                          }
                        }
                        return true;
                      }
                  ).map((badge) => (
                      <div
                          key={badge.badgeId}
                      >
                        <span className="text-4xl mb-2">{badge.badgeImage}</span>
                        <div>{badge.name}</div>
                        <div>{badge.description}</div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 미획득 배지 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-gray-400" />
                  획득 가능한 배지
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  {badgeImages.filter((badge) => {
                        for (let i = 0; i < badges.length; i++) {
                          if (badge.badgeId === badges[i].badgeId) {
                            return true;
                          }
                        }
                        return false;
                      }
                      ).map((badge) => (
                      <div
                          key={badge.badgeId}
                      >
                        <span className="text-4xl mb-2">{badge.badgeImage}</span>
                        <div>{badge.name}</div>
                        <div>{badge.description}</div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 콘텐츠 관리 탭 */}
          <Tabs defaultValue="posts" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />내 게시글
                <Badge variant="secondary" className="ml-1">
                  {stats.totalPosts}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />내 댓글
                <Badge variant="secondary" className="ml-1">
                  {stats.totalComments}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      작성한 게시글이 없습니다
                    </h3>
                    <p className="text-gray-500">
                      첫 번째 게시글을 작성해보세요!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <MyPostList
                  posts={posts as any} // 타입 변환 임시 처리
                  onDeletePost={handleDeletePost}
                  onHidePost={handleHidePost}
                  onUnhidePost={handleUnhidePost}
                />
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              {comments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      작성한 댓글이 없습니다
                    </h3>
                    <p className="text-gray-500">
                      다른 사용자의 게시글에 댓글을 남겨보세요!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <MyCommentList
                  comments={comments as any} // 타입 변환 임시 처리
                  onDeleteComment={handleDeleteComment}
                />
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
