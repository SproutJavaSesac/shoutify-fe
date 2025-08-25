import { PostAiScore } from "@/components/posts/post-ai-score";
import { ProofreadDiffView } from "@/components/posts/proofread-diff-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CONCEPT_OPTIONS,
  EMOTICON_OPTIONS,
  GENRE_OPTIONS,
} from "@/constants/posts";
import { useToast } from "@/hooks/use-toast";
import { usePostFetchEffect } from "@/lib/hooks/usePosts";
import { generateWordDiff } from "@/lib/utils/diff";
import { DiffSegment } from "@/types/proofreads";
import {
  Calendar,
  Copy,
  ExternalLink,
  Eye,
  GitBranch,
  Heart,
  Loader2,
  MessageCircle,
  Settings,
  Sparkles,
  Trophy,
  User,
  UserIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PostDetailModalProps {
  postId: string | number;
  isOpen: boolean;
  onClose: () => void;
}

export function PostDetailModal({
  postId,
  isOpen,
  onClose,
}: PostDetailModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [diffData, setDiffData] = useState<{
    titleDiff: DiffSegment[];
    contentDiff: DiffSegment[];
  } | null>(null);

  // 게시글 상세 정보 가져오기
  const {
    data: post,
    loading,
    error,
    refetch,
  } = usePostFetchEffect({
    postId,
  });

  // diff 데이터 생성
  useEffect(() => {
    if (post?.beforeTitle && post?.beforeContent) {
      const titleDiff = generateWordDiff(
        post.beforeTitle || post.afterTitle,
        post.afterTitle
      );
      const contentDiff = generateWordDiff(
        post.beforeContent || post.afterContent,
        post.afterContent
      );

      setDiffData({ titleDiff, contentDiff });
    }
  }, [post]);

  const getConceptLabel = (conceptType: string) => {
    return (
      CONCEPT_OPTIONS.find((option) => option.value === conceptType)?.label ||
      conceptType
    );
  };

  const getGenreLabel = (genreType?: string) => {
    if (!genreType) return null;
    return (
      GENRE_OPTIONS.find((option) => option.value === genreType)?.label ||
      genreType
    );
  };

  const getEmotionInfo = (emotion: string) => {
    return EMOTICON_OPTIONS.find((option) => option.value === emotion);
  };

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;

      // 유효한 날짜인지 확인
      if (isNaN(dateObj.getTime())) {
        return "날짜 정보 없음";
      }

      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error("Date formatting error:", error);
      return "날짜 정보 없음";
    }
  };

  const handleCopyPost = async () => {
    if (!post) return;

    const textToCopy = `제목: ${post.afterTitle}\n\n내용:\n${post.afterContent}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        description: "게시글이 클립보드에 복사되었습니다!",
      });
    } catch (error) {
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      toast({
        description: "게시글이 클립보드에 복사되었습니다!",
      });
    }
  };

  const handleViewProfile = () => {
    if (post?.nickname) {
      // memberId 대신 nickname으로 프로필 페이지 이동
      router.push(`/profile/member/${encodeURIComponent(post.nickname)}`);
    }
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">게시글을 불러오는 중...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !post) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex flex-col items-center justify-center py-12">
            <X className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              게시글을 불러올 수 없습니다
            </h3>
            <p className="text-gray-500 mb-4">
              {error || "게시글이 삭제되었거나 접근할 수 없습니다."}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              다시 시도
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between sticky top-0 bg-white z-10 pb-4">
          <div className="flex-1 pr-4">
            <DialogTitle className="text-xl font-bold line-clamp-2">
              {post.afterTitle}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{post.nickname}</span>
              <span>•</span>
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 프로필 관련 버튼 */}
            {post.isMine ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditProfile}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                프로필 편집
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewProfile}
                className="flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                프로필 보기
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPost}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              복사
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />글 내용
            </TabsTrigger>
            <TabsTrigger value="diff" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              AI 첨삭 변화
            </TabsTrigger>
            <TabsTrigger value="scores" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              AI 점수
            </TabsTrigger>
          </TabsList>

          {/* 글 내용 탭 */}
          <TabsContent value="content" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {getConceptLabel(post.conceptType)}
                    </Badge>
                    {post.genreType && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-50 text-purple-700"
                      >
                        {getGenreLabel(post.genreType)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-red-500">
                      <Heart className="h-4 w-4 mr-1" />
                      <span className="font-medium">{post.reactionCount}</span>
                    </div>
                    <div className="flex items-center text-blue-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="font-medium">{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {post.imgUrl && (
                  <div className="mb-6">
                    <Image
                      src={post.imgUrl}
                      alt="게시글 이미지"
                      width={800}
                      height={400}
                      className="rounded-lg w-full object-cover"
                    />
                  </div>
                )}
                <div className="prose max-w-none">
                  <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                    <p className="whitespace-pre-wrap leading-relaxed text-gray-800 text-base">
                      {post.afterContent}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {post.emotion && getEmotionInfo(post.emotion) && (
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                        <span className="text-xl mr-2">
                          {getEmotionInfo(post.emotion)?.emotionType}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                          {getEmotionInfo(post.emotion)?.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {post.isHidden && (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        숨김
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/posts/${post.postId}`, "_blank")
                      }
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      게시글 보기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI 첨삭 변화 탭 */}
          <TabsContent value="diff" className="space-y-6 mt-6">
            {post.beforeTitle && post.beforeContent && diffData ? (
              <ProofreadDiffView
                originalTitle={post.beforeTitle}
                originalContent={post.beforeContent}
                modifiedTitle={post.afterTitle}
                modifiedContent={post.afterContent}
                titleDiff={diffData.titleDiff}
                contentDiff={diffData.contentDiff}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <GitBranch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    AI 첨삭 정보가 없습니다
                  </h3>
                  <p className="text-gray-500">
                    이 게시글은 AI 첨삭을 거치지 않았거나, 원본 데이터를 찾을 수
                    없습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI 점수 탭 */}
          <TabsContent value="scores" className="space-y-6 mt-6">
            {post.aiScore ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      AI 분석 결과
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostAiScore post={post} />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.aiScore.conceptScore !== undefined && (
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {post.aiScore.conceptScore}
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          컨셉
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${post.aiScore.conceptScore}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {post.aiScore.writingScore !== undefined && (
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {post.aiScore.writingScore}
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          문체
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${post.aiScore.writingScore}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {post.aiScore.creativityScore !== undefined && (
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {post.aiScore.creativityScore}
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          창의성
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${post.aiScore.creativityScore}%`,
                            }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {post.aiScore.emotionScore !== undefined && (
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {post.aiScore.emotionScore}
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          감정
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-orange-600 h-2 rounded-full transition-all"
                            style={{ width: `${post.aiScore.emotionScore}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {post.aiScore.genreScore !== undefined && (
                    <Card className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-pink-600 mb-2">
                          {post.aiScore.genreScore}
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          장르
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-pink-600 h-2 rounded-full transition-all"
                            style={{ width: `${post.aiScore.genreScore}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {post.aiScore.totalScore !== undefined && (
                    <Card className="text-center hover:shadow-md transition-shadow border-2 border-yellow-200 bg-yellow-50">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-yellow-700 mb-2">
                          {post.aiScore.totalScore}
                        </div>
                        <p className="text-sm font-medium text-yellow-700">
                          종합 점수
                        </p>
                        <div className="w-full bg-yellow-200 rounded-full h-2 mt-3">
                          <div
                            className="bg-yellow-600 h-2 rounded-full transition-all"
                            style={{ width: `${post.aiScore.totalScore}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    AI 분석 점수가 없습니다
                  </h3>
                  <p className="text-gray-500">
                    이 게시글은 아직 AI 분석을 완료하지 않았습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
