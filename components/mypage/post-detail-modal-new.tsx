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
import { generateWordDiff } from "@/lib/utils/diff";
import { MyComment } from "@/types/comments";
import { Post } from "@/types/posts";
import { DiffSegment } from "@/types/proofreads";
import {
  Calendar,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  Heart,
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

// 통합 모달 데이터 인터페이스
interface ModalData {
  id: string | number;
  title: string;
  nickname: string;
  beforeTitle?: string;
  beforeContent?: string;
  afterTitle: string;
  afterContent: string;
  createdAt: Date | string;
  imgUrl?: string;
  reactionCount: number;
  commentCount?: number;
  emotion?: string;
  conceptType?: string;
  genreType?: string;
  isDeleted?: boolean;
  isHidden?: boolean;
  isMine?: boolean;
  aiScore?: {
    conceptScore?: number;
    writingScore?: number;
    creativityScore?: number;
    emotionScore?: number;
    genreScore?: number;
    totalScore?: number;
  };
  type: "post" | "comment";
}

interface PostDetailModalProps {
  data: Post | MyComment;
  isOpen: boolean;
  onClose: () => void;
  type: "post" | "comment";
}

// Post를 ModalData로 변환
function postToModalData(post: Post): ModalData {
  return {
    id: post.postId,
    title: post.afterTitle,
    nickname: post.nickname,
    beforeTitle: post.beforeTitle,
    beforeContent: post.beforeContent,
    afterTitle: post.afterTitle,
    afterContent: post.afterContent,
    createdAt: post.createdAt,
    imgUrl: post.imgUrl,
    reactionCount: post.reactionCount,
    commentCount: post.commentCount,
    emotion: post.emotion,
    conceptType: post.conceptType,
    genreType: post.genreType,
    isDeleted: post.isDeleted,
    isHidden: post.isHidden,
    isMine: post.isMine,
    aiScore: post.aiScore,
    type: "post",
  };
}

// MyComment를 ModalData로 변환
function commentToModalData(comment: MyComment): ModalData {
  return {
    id: comment.commentId,
    title: comment.postTitle,
    nickname: "익명", // 댓글에는 닉네임이 없으므로
    beforeTitle: undefined,
    beforeContent: comment.beforeContent,
    afterTitle: comment.postTitle,
    afterContent: comment.afterContent,
    createdAt: comment.createdAt,
    imgUrl: undefined,
    reactionCount: comment.reactionCount,
    commentCount: undefined,
    emotion: undefined,
    conceptType: undefined,
    genreType: undefined,
    isDeleted: comment.isDeleted,
    isHidden: false,
    isMine: comment.isMine,
    aiScore: undefined,
    type: "comment",
  };
}

export function PostDetailModal({
  data,
  isOpen,
  onClose,
  type,
}: PostDetailModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [diffData, setDiffData] = useState<{
    titleDiff: DiffSegment[];
    contentDiff: DiffSegment[];
  } | null>(null);

  // 데이터를 통합 형태로 변환
  const modalData: ModalData =
    type === "post"
      ? postToModalData(data as Post)
      : commentToModalData(data as MyComment);

  // diff 데이터 생성
  useEffect(() => {
    if (
      modalData.type === "post" &&
      (modalData.beforeTitle || modalData.beforeContent)
    ) {
      const titleDiff = generateWordDiff(
        modalData.beforeTitle || modalData.afterTitle,
        modalData.afterTitle
      );
      const contentDiff = generateWordDiff(
        modalData.beforeContent || modalData.afterContent,
        modalData.afterContent
      );

      setDiffData({ titleDiff, contentDiff });
    } else if (modalData.type === "comment" && modalData.beforeContent) {
      // 댓글 모드에서는 내용만 diff 생성
      const contentDiff = generateWordDiff(
        modalData.beforeContent,
        modalData.afterContent
      );

      setDiffData({
        titleDiff: [],
        contentDiff,
      });
    } else {
      setDiffData(null);
    }
  }, [modalData]);

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
    const textToCopy =
      modalData.type === "comment"
        ? `댓글 내용: ${modalData.afterContent}`
        : `제목: ${modalData.afterTitle}\n\n내용:\n${modalData.afterContent}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        description: `${modalData.type === "comment" ? "댓글이" : "게시글이"} 클립보드에 복사되었습니다!`,
      });
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      toast({
        description: `${modalData.type === "comment" ? "댓글이" : "게시글이"} 클립보드에 복사되었습니다!`,
      });
    }
  };

  const handleViewProfile = () => {
    if (modalData.nickname && modalData.nickname !== "익명") {
      router.push(`/profile/member/${encodeURIComponent(modalData.nickname)}`);
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
              {modalData.afterTitle}
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span>{modalData.nickname}</span>
              <span>•</span>
              <Calendar className="h-4 w-4" />
              <span>{formatDate(modalData.createdAt)}</span>
              {modalData.type === "comment" && (
                <>
                  <span>•</span>
                  <FileText className="h-4 w-4" />
                  <span>댓글</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 프로필 관련 버튼 */}
            {modalData.isMine ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditProfile}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                프로필 편집
              </Button>
            ) : modalData.nickname !== "익명" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewProfile}
                className="flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                프로필 보기
              </Button>
            ) : null}
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
          <TabsList
            className={`grid w-full ${modalData.type === "post" ? "grid-cols-3" : "grid-cols-2"}`}
          >
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {modalData.type === "comment" ? "댓글 내용" : "글 내용"}
            </TabsTrigger>
            <TabsTrigger value="diff" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              AI 첨삭 변화
            </TabsTrigger>
            {modalData.type === "post" && (
              <TabsTrigger value="scores" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                AI 점수
              </TabsTrigger>
            )}
          </TabsList>

          {/* 글/댓글 내용 탭 */}
          <TabsContent value="content" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {modalData.type === "post" && modalData.conceptType && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {getConceptLabel(modalData.conceptType)}
                      </Badge>
                    )}
                    {modalData.type === "post" && modalData.genreType && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-50 text-purple-700"
                      >
                        {getGenreLabel(modalData.genreType)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-red-500">
                      <Heart className="h-4 w-4 mr-1" />
                      <span className="font-medium">
                        {modalData.reactionCount}
                      </span>
                    </div>
                    {modalData.type === "post" &&
                      modalData.commentCount !== undefined && (
                        <div className="flex items-center text-blue-500">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="font-medium">
                            {modalData.commentCount}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {modalData.type === "post" && modalData.imgUrl && (
                  <div className="mb-6">
                    <Image
                      src={modalData.imgUrl}
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
                      {modalData.afterContent}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {modalData.type === "post" &&
                      modalData.emotion &&
                      getEmotionInfo(modalData.emotion) && (
                        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                          <span className="text-xl mr-2">
                            {getEmotionInfo(modalData.emotion)?.emotionType}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">
                            {getEmotionInfo(modalData.emotion)?.label}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                    {modalData.isHidden && (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        숨김
                      </Badge>
                    )}
                    {modalData.type === "post" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/posts/${modalData.id}`, "_blank")
                        }
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        게시글 보기
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI 첨삭 변화 탭 */}
          <TabsContent value="diff" className="space-y-6 mt-6">
            {diffData &&
            (diffData.titleDiff.length > 0 ||
              diffData.contentDiff.length > 0) ? (
              modalData.type === "post" ? (
                <ProofreadDiffView
                  originalTitle={modalData.beforeTitle || modalData.afterTitle}
                  originalContent={
                    modalData.beforeContent || modalData.afterContent
                  }
                  modifiedTitle={modalData.afterTitle}
                  modifiedContent={modalData.afterContent}
                  titleDiff={diffData.titleDiff}
                  contentDiff={diffData.contentDiff}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      댓글 AI 첨삭 변화
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            변환 전
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                            <p className="whitespace-pre-wrap text-gray-800">
                              {modalData.beforeContent}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-green-500" />
                            변환 후
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            <p className="whitespace-pre-wrap font-medium text-gray-800">
                              {modalData.afterContent}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <GitBranch className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    AI 첨삭 정보가 없습니다
                  </h3>
                  <p className="text-gray-500">
                    이 {modalData.type === "comment" ? "댓글" : "게시글"}은 AI
                    첨삭을 거치지 않았거나, 원본 데이터를 찾을 수 없습니다.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI 점수 탭 (게시글만) */}
          {modalData.type === "post" && (
            <TabsContent value="scores" className="space-y-6 mt-6">
              {modalData.aiScore ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        AI 분석 결과
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PostAiScore post={data as Post} />
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {modalData.aiScore.conceptScore !== undefined && (
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {modalData.aiScore.conceptScore}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            컨셉
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${modalData.aiScore.conceptScore}%`,
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {modalData.aiScore.writingScore !== undefined && (
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {modalData.aiScore.writingScore}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            문체
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${modalData.aiScore.writingScore}%`,
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {modalData.aiScore.creativityScore !== undefined && (
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {modalData.aiScore.creativityScore}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            창의성
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${modalData.aiScore.creativityScore}%`,
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {modalData.aiScore.emotionScore !== undefined && (
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-orange-600 mb-2">
                            {modalData.aiScore.emotionScore}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            감정
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-orange-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${modalData.aiScore.emotionScore}%`,
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {modalData.aiScore.genreScore !== undefined && (
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-pink-600 mb-2">
                            {modalData.aiScore.genreScore}
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            장르
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-pink-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${modalData.aiScore.genreScore}%`,
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {modalData.aiScore.totalScore !== undefined && (
                      <Card className="text-center hover:shadow-md transition-shadow border-2 border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6">
                          <div className="text-3xl font-bold text-yellow-700 mb-2">
                            {modalData.aiScore.totalScore}
                          </div>
                          <p className="text-sm font-medium text-yellow-700">
                            종합 점수
                          </p>
                          <div className="w-full bg-yellow-200 rounded-full h-2 mt-3">
                            <div
                              className="bg-yellow-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${modalData.aiScore.totalScore}%`,
                              }}
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
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
