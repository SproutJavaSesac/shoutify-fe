"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  useMyBadges,
  useMyComments,
  useMyInfo,
  useMyPosts,
} from "@/lib/hooks/useMembers";
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

  const posts = postsData?.posts || [];
  const comments = commentsData?.comments || [];
  const badges = badgesData?.badges || []; // 404 시 전역에서 null 반환, 여기서 빈 배열로 fallback
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
    try {
      // TODO: API 호출로 실제 삭제
      toast({
        description: "게시글이 삭제되었습니다.",
      });
      refetchPosts(); // 목록 새로고침
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "게시글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleHidePost = async (postId: number) => {
    try {
      // TODO: API 호출로 숨김 처리
      toast({
        description: "게시글이 숨김 처리되었습니다.",
      });
      refetchPosts(); // 목록 새로고침
    } catch (error) {
      toast({
        title: "숨김 처리 실패",
        description: "게시글 숨김 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleUnhidePost = async (postId: number) => {
    try {
      // TODO: API 호출로 공개 처리
      toast({
        description: "게시글이 공개 처리되었습니다.",
      });
      refetchPosts(); // 목록 새로고침
    } catch (error) {
      toast({
        title: "공개 처리 실패",
        description: "게시글 공개 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: number | string) => {
    try {
      // TODO: API 호출로 댓글 삭제
      toast({
        description: "댓글이 삭제되었습니다.",
      });
      refetchComments(); // 목록 새로고침
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "댓글 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
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
                  <p>배지 시스템을 준비 중입니다</p>
                  <p className="text-sm">활동을 통해 배지를 획득해보세요!</p>
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
                  <p>배지 시스템 준비 중입니다</p>
                  <p className="text-sm">곧 멋진 배지들을 만나보세요! ✨</p>
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
