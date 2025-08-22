"use client";

import { AuthTextarea } from "@/components/commons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONCEPT_CATEGORIES as AI_CONCEPT_CATEGORIES } from "@/constants/ai";
import { EMOTICON_OPTIONS, POST_ROUTES } from "@/constants/posts";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { usePostCreate } from "@/lib/hooks/usePosts";
import {
  useProofreadCreate,
  useProofreadPublish,
} from "@/lib/hooks/useProofreads";
import { GenreOption } from "@/types/ai";
import { ConceptType } from "@/types/posts";
import { ProofreadCreateResponse } from "@/types/proofreads";
import { ReactionLabelType } from "@/types/reactions";
import { Loader2, Send, Sparkles, Upload, Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { ProofreadPreview } from "./proofread-preview";

export function PostCreationForm() {
  // 기본 입력 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [concept, setConcept] = useState<ConceptType | "">("");
  const [genre, setGenre] = useState<string>("");
  const [emotion, setEmotion] = useState<ReactionLabelType | null>(null);
  const [image, setImage] = useState<File | null>(null);

  // 첨삭 관련 상태
  const [currentStep, setCurrentStep] = useState<"write" | "preview">("write");
  const [proofreadResult, setProofreadResult] =
    useState<ProofreadCreateResponse | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  // 선택된 컨셉에 따른 장르 옵션
  const availableGenres: GenreOption[] =
    AI_CONCEPT_CATEGORIES.find((cat) => cat.value === concept)?.genres || [];

  // 바로 게시글 발행 훅 (AI 첨삭 없이)
  const { mutate: createPost, loading: isDirectPublishing } = usePostCreate({
    onSuccess: (response) => {
      toast({
        title: "게시글 작성 완료! 🎉",
        description: `"${response?.afterTitle}" 게시글이 작성되었습니다.`,
      });
      if (response?.postId) {
        router.push(POST_ROUTES.DETAIL(response.postId));
      }
    },
    onError: (errorMessage) => {
      toast({
        title: "작성 실패 😅",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // 첨삭 요청 훅
  const { mutate: createProofread, loading: isProofreadLoading } =
    useProofreadCreate({
      onSuccess: (response) => {
        setProofreadResult(response);
        setCurrentStep("preview");
        toast({
          title: "AI 첨삭 완료! ✨",
          description: "첨삭 결과를 확인해보세요.",
        });
      },
      onError: (errorMessage) => {
        toast({
          title: "첨삭 실패",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });

  // 첨삭 게시글 발행 훅
  const { mutate: publishProofread, loading: isProofreadPublishing } =
    useProofreadPublish({
      onSuccess: (response) => {
        toast({
          title: "게시글 발행 완료! 🎉",
          description: `"${response?.afterTitle}" 게시글이 발행되었습니다.`,
        });
        if (response?.postId) {
          router.push(POST_ROUTES.DETAIL(response.postId));
        }
      },
      onError: (errorMessage) => {
        toast({
          title: "발행 실패",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });

  // 이벤트 핸들러들
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleConceptChange = (value: string) => {
    setConcept(value as ConceptType);
    setGenre("");
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
  };

  const handleEmotionClick = (emotionValue: ReactionLabelType) => {
    setEmotion(emotionValue);
  };

  const validateForm = () => {
    return !title.trim() || !content.trim() || !concept;
  };

  // AI 첨삭 미리보기 요청
  const handleRequestProofread = async () => {
    if (validateForm()) {
      toast({
        title: "입력 오류",
        description: "컨셉 카테고리, 제목, 내용은 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    await createProofread({
      title: title.trim(),
      conceptType: concept as ConceptType,
      emotionType: emotion || undefined,
      content: content.trim(),
      taskUuid: proofreadResult?.taskUuid, // 재시도 시 기존 taskUuid 사용
    });
  };

  // 바로 발행 (AI 첨삭 없이)
  const handleDirectPublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      toast({
        title: "입력 오류",
        description: "컨셉 카테고리, 제목, 내용은 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    // 이미지 업로드 로직 (필요 시)
    let imageUrl: string | undefined;
    if (image) {
      // TODO: 이미지 업로드 API 연동
      console.log("이미지 업로드 예정:", image.name);
    }

    await createPost({
      title: title.trim(),
      content: content.trim(),
      conceptType: concept as ConceptType,
      emotionType: emotion ?? undefined,
      imageUrl,
    });
  };

  // 첨삭 글로 돌아가기
  const handleBackToEdit = () => {
    setCurrentStep("write");
  };

  // 첨삭 재시도
  const handleRetryProofread = async () => {
    if (!proofreadResult) return;

    await createProofread({
      title: title.trim(),
      conceptType: concept as ConceptType,
      emotionType: emotion || undefined,
      content: content.trim(),
      taskUuid: proofreadResult.taskUuid, // 기존 taskUuid로 재시도
    });
  };

  // 첨삭 결과로 발행
  const handlePublishProofread = async () => {
    if (!proofreadResult) return;

    // 이미지 업로드 로직 (필요 시)
    let imageUrl: string | undefined;
    if (image) {
      // TODO: 이미지 업로드 API 연동
      console.log("이미지 업로드 예정:", image.name);
    }

    await publishProofread(proofreadResult.taskUuid, {
      chosenAttemptId: proofreadResult.attemptId,
      imageUrl,
    });
  };

  // 첨삭 결과 확인 화면
  if (currentStep === "preview" && proofreadResult) {
    return (
      <ProofreadPreview
        proofreadResult={proofreadResult}
        originalTitle={title}
        originalContent={content}
        conceptType={concept as ConceptType}
        onBackToEdit={handleBackToEdit}
        onRetryProofread={handleRetryProofread}
        onPublishProofread={handlePublishProofread}
        isPublishing={isProofreadPublishing}
        isRetrying={isProofreadLoading}
      />
    );
  }

  // 글 작성 화면
  return (
    <form onSubmit={handleDirectPublish}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>새로운 이야기 만들기</span>
          </CardTitle>
          {user && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">{user.nickname}</span>님으로 작성 중
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Concept Selection */}
          <div className="space-y-2">
            <Label htmlFor="concept">컨셉 카테고리 *</Label>
            <Select value={concept} onValueChange={handleConceptChange}>
              <SelectTrigger>
                <SelectValue placeholder="컨셉 카테고리를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {AI_CONCEPT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-gray-500">
                        {category.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genre Selection */}
          {concept && availableGenres.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="genre">글 장르 (선택사항)</Label>
              <Select value={genre} onValueChange={handleGenreChange}>
                <SelectTrigger>
                  <SelectValue placeholder="장르를 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {availableGenres.map((genreOption) => (
                    <SelectItem
                      key={genreOption.value}
                      value={genreOption.value}
                    >
                      <div>
                        <div className="font-medium">{genreOption.label}</div>
                        <div className="text-xs text-gray-500">
                          {genreOption.description}
                        </div>
                        {genreOption.targetAudience && (
                          <div className="text-xs text-blue-500">
                            👥 {genreOption.targetAudience}
                          </div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력해주세요..."
              maxLength={100}
            />
            <div className="flex justify-between items-center">
              <p
                className={`text-sm ${
                  title.length > 85
                    ? "text-red-500 font-medium"
                    : title.length > 70
                      ? "text-yellow-600"
                      : "text-gray-500"
                }`}
              >
                {100 - title.length}자 남음
                {title.length > 85 && " (거의 다 찼어요!)"}
              </p>
              <p className="text-xs text-gray-400">{title.length}/100자</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <AuthTextarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="당신의 생각을 자유롭게 써보세요. AI가 아름다운 문학 작품으로 변화시켜 드립니다..."
              className="min-h-[200px]"
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <p
                className={`text-sm ${
                  content.length > 900
                    ? "text-red-500 font-medium"
                    : content.length > 800
                      ? "text-yellow-600"
                      : "text-gray-500"
                }`}
              >
                {1000 - content.length}자 남음
                {content.length > 900 && " (거의 다 찼어요!)"}
              </p>
              <p className="text-xs text-gray-400">{content.length}/1000자</p>
            </div>
          </div>

          {/* Emotion Selection */}
          <div className="space-y-2">
            <Label>감정 (선택사항)</Label>
            <p className="text-sm text-gray-600 mb-3">
              AI 첨삭에 참고할 감정을 선택하거나, 비워두면 자동으로 감지됩니다
            </p>
            <div className="flex flex-wrap gap-2">
              {EMOTICON_OPTIONS.map((emotionOption) => (
                <Badge
                  key={emotionOption.value}
                  className={`cursor-pointer transition-all ${
                    emotion === emotionOption.value
                      ? emotionOption.color
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handleEmotionClick(emotionOption.value)}
                >
                  {emotionOption.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>이미지 (선택사항)</Label>
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  게시글에 함께 올릴 이미지를 업로드하세요
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm">
                    파일 선택
                  </Button>
                </Label>
              </div>
            ) : (
              <div className="relative">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{image.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 중요한 안내 사항 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Wand2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-2">
                  AI 첨삭으로 글을 더 매력적으로! ✨
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  바로 발행하거나, AI 첨삭을 먼저 확인해보세요. 첨삭 후에도
                  수정하거나 다시 첨삭을 요청할 수 있습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    onClick={handleRequestProofread}
                    disabled={isProofreadLoading || validateForm()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
                  >
                    {isProofreadLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI 첨삭 중...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        AI 첨삭 먼저 확인하기
                      </>
                    )}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isDirectPublishing || validateForm()}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isDirectPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        발행 중...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        바로 발행하기
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>알림:</strong> 게시글은 발행 후 수정할 수 없습니다. 내용을
              신중하게 검토해주세요.
            </p>
          </div>

          {/* Cancel Button */}
          <div className="flex justify-start">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              작성 취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
