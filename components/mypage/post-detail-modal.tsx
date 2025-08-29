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
import { SCORE_LEVELS } from "@/constants/proofreads";
import { useToast } from "@/hooks/use-toast";
import { generateWordDiff } from "@/lib/utils/diff";
import { Post } from "@/types/posts";
import {
  BarChart3,
  Calendar,
  Copy,
  ExternalLink,
  Eye,
  GitBranch,
  Heart,
  MessageCircle,
  Palette,
  PenTool,
  Settings,
  Sparkles,
  Trophy,
  User,
  UserIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface PostDetailModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export function PostDetailModal({
  post,
  isOpen,
  onClose,
}: PostDetailModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const mockPost = {
    ...post,
    aiScore: {
      conceptScore: 85,
      writingScore: 90,
      creativityScore: 80,
      emotionScore: 75,
      genreScore: 88,
      totalScore: 83,
    },
  };

  // diff 데이터를 useMemo로 생성하여 무한 루프 방지
  const diffData = useMemo(() => {
    if (!post.beforeTitle && !post.beforeContent) {
      return null;
    }

    const titleDiff = generateWordDiff(
      post.beforeTitle || post.afterTitle,
      post.afterTitle
    );
    const contentDiff = generateWordDiff(
      post.beforeContent || post.afterContent,
      post.afterContent
    );

    return { titleDiff, contentDiff };
  }, [
    post.beforeTitle,
    post.beforeContent,
    post.afterTitle,
    post.afterContent,
  ]);

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
    const textToCopy = `제목: ${post.afterTitle}\n\n내용:\n${post.afterContent}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        description: "게시글이 클립보드에 복사되었습니다!",
      });
    } catch (error) {
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
    if (post.nickname) {
      router.push(`/profile/member/${encodeURIComponent(post.nickname)}`);
    }
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

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
                    {post.conceptType && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {getConceptLabel(post.conceptType)}
                      </Badge>
                    )}
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
            {diffData ? (
              <ProofreadDiffView
                originalTitle={post.beforeTitle || post.afterTitle}
                originalContent={post.beforeContent || post.afterContent}
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
            {mockPost.aiScore ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      AI 분석 결과
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostAiScore post={mockPost} />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockPost.aiScore.conceptScore !== undefined && (
                    <DetailedScoreCard
                      title="컨셉 적합도"
                      score={mockPost.aiScore.conceptScore}
                      icon={<PenTool className="h-4 w-4 text-purple-600" />}
                      description="선택한 컨셉에 얼마나 잘 맞는지"
                      color="purple"
                    />
                  )}

                  {mockPost.aiScore.writingScore !== undefined && (
                    <DetailedScoreCard
                      title="글쓰기 품질"
                      score={mockPost.aiScore.writingScore}
                      icon={<BarChart3 className="h-4 w-4 text-blue-600" />}
                      description="문법, 어휘, 문체의 완성도"
                      color="blue"
                    />
                  )}

                  {mockPost.aiScore.creativityScore !== undefined && (
                    <DetailedScoreCard
                      title="창의성"
                      score={mockPost.aiScore.creativityScore}
                      icon={<Sparkles className="h-4 w-4 text-yellow-600" />}
                      description="독창적이고 흥미로운 표현"
                      color="yellow"
                    />
                  )}

                  {mockPost.aiScore.emotionScore !== undefined && (
                    <DetailedScoreCard
                      title="감정 표현"
                      score={mockPost.aiScore.emotionScore}
                      icon={<Heart className="h-4 w-4 text-red-600" />}
                      description="감정이 얼마나 잘 드러나는지"
                      color="red"
                    />
                  )}

                  {mockPost.aiScore.genreScore !== undefined && (
                    <DetailedScoreCard
                      title="장르 적합성"
                      score={mockPost.aiScore.genreScore}
                      icon={<Palette className="h-4 w-4 text-green-600" />}
                      description="선택한 장르에 적합한 스타일"
                      color="green"
                    />
                  )}

                  {mockPost.aiScore.totalScore !== undefined && (
                    <DetailedScoreCard
                      title="종합 점수"
                      score={mockPost.aiScore.totalScore}
                      icon={<Trophy className="h-4 w-4 text-amber-600" />}
                      description="모든 요소를 종합한 전체 평가"
                      color="amber"
                      isTotal={true}
                    />
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

interface DetailedScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  description: string;
  color: string;
  isTotal?: boolean;
}

function DetailedScoreCard({
  title,
  score,
  icon,
  description,
  color,
  isTotal = false,
}: DetailedScoreCardProps) {
  const getScoreLevel = (score: number) => {
    const levels = Object.values(SCORE_LEVELS);
    return levels.find((level) => score >= level.min) || SCORE_LEVELS.BAD;
  };

  const scoreLevel = getScoreLevel(score);

  const colorClasses = {
    purple: {
      bg: "bg-purple-50",
      border: isTotal ? "border-2 border-purple-200" : "",
      text: "text-purple-600",
      progress: "bg-purple-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: isTotal ? "border-2 border-blue-200" : "",
      text: "text-blue-600",
      progress: "bg-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: isTotal ? "border-2 border-green-200" : "",
      text: "text-green-600",
      progress: "bg-green-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: isTotal ? "border-2 border-yellow-200" : "",
      text: "text-yellow-600",
      progress: "bg-yellow-600",
    },
    red: {
      bg: "bg-red-50",
      border: isTotal ? "border-2 border-red-200" : "",
      text: "text-red-600",
      progress: "bg-red-600",
    },
    amber: {
      bg: "bg-amber-50",
      border: isTotal ? "border-2 border-amber-200" : "",
      text: "text-amber-600",
      progress: "bg-amber-600",
    },
  };

  const currentColors =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${currentColors.bg} ${currentColors.border}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
          </div>
          <Badge variant="outline" className={`${scoreLevel.color} text-xs`}>
            {score}점
          </Badge>
        </div>

        <div className="mb-3">
          <div className={`text-2xl font-bold mb-2 ${currentColors.text}`}>
            {score}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${currentColors.progress}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        <p className={`text-xs font-medium mt-1 ${scoreLevel.color}`}>
          {scoreLevel.label}
        </p>
      </CardContent>
    </Card>
  );
}
