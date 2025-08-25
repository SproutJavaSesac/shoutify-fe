import { PostAiScore } from "@/components/posts/post-ai-score";
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
import { Post } from "@/types/posts";
import {
  Calendar,
  Heart,
  MessageCircle,
  Sparkles,
  Star,
  Trophy,
  User,
  X,
} from "lucide-react";
import Image from "next/image";

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
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // 유효한 날짜인지 확인
      if (isNaN(dateObj.getTime())) {
        return '날짜 정보 없음';
      }
      
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '날짜 정보 없음';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <DialogTitle className="flex-1 pr-4">{post.afterTitle}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">글 내용</TabsTrigger>
            <TabsTrigger value="versions">이전/현재 버전</TabsTrigger>
            <TabsTrigger value="scores">AI 점수</TabsTrigger>
          </TabsList>

          {/* 글 내용 탭 */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{post.nickname}</span>
                    <Badge variant="outline">
                      {getConceptLabel(post.conceptType)}
                    </Badge>
                    {post.genreType && (
                      <Badge variant="secondary">
                        {getGenreLabel(post.genreType)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {post.imgUrl && (
                    <div className="mb-4">
                      <Image
                        src={post.imgUrl}
                        alt="게시글 이미지"
                        width={600}
                        height={400}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {post.afterContent}
                  </p>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-red-500">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{post.reactionCount}</span>
                    </div>
                    <div className="flex items-center text-blue-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{post.commentCount}</span>
                    </div>
                    {post.emotion && getEmotionInfo(post.emotion) && (
                      <div className="flex items-center">
                        <span className="text-lg mr-1">
                          {getEmotionInfo(post.emotion)?.emotionType}
                        </span>
                        <span className="text-sm text-gray-600">
                          {getEmotionInfo(post.emotion)?.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {post.isHidden && <Badge variant="destructive">숨김</Badge>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 이전/현재 버전 탭 */}
          <TabsContent value="versions" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    이전 버전 (원본)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {post.afterContent.substring(0, 100)}... (원본 내용 -
                      실제로는 서버에서 beforeContent를 제공해야 함)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    현재 버전 (AI 개선)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="whitespace-pre-wrap">{post.afterContent}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI 점수 탭 */}
          <TabsContent value="scores" className="space-y-4">
            {post.aiScore ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-gold" />
                      AI 분석 점수
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PostAiScore post={post} />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">
                        {post.aiScore.conceptScore}
                      </div>
                      <p className="text-sm text-gray-600">컨셉</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {post.aiScore.writingScore}
                      </div>
                      <p className="text-sm text-gray-600">문체</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">
                        {post.aiScore.creativityScore}
                      </div>
                      <p className="text-sm text-gray-600">창의성</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-orange-600">
                        {post.aiScore.emotionScore}
                      </div>
                      <p className="text-sm text-gray-600">감정</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">AI 분석 점수가 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
