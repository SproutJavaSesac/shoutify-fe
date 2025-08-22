"use client";

import { AuthTextarea } from "@/components/commons";
import { ConversionDashboard, ComprehensiveDiffView } from "@/components/ai";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EMOTICON_OPTIONS,
  POST_ROUTES,
} from "@/constants/posts";
import { CONCEPT_CATEGORIES as AI_CONCEPT_CATEGORIES } from "@/constants/ai";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { usePostCreate } from "@/lib/hooks/usePosts";
import { ConceptType } from "@/types/posts";
import { ReactionLabelType } from "@/types/reactions";
import { AIConversionResult, AIPreviewRequest, GenreOption } from "@/types/ai";
import { 
  Sparkles, 
  Upload, 
  X, 
  Wand2, 
  RefreshCw, 
  Check, 
  Eye, 
  EyeOff,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useCallback } from "react";

export function PostCreationForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [concept, setConcept] = useState<ConceptType | "">("");
  const [genre, setGenre] = useState<string>("");
  const [emotion, setEmotion] = useState<ReactionLabelType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("write");
  
  // AI 변환 관련 상태
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState<AIConversionResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  // 선택된 컨셉에 따른 장르 옵션
  const availableGenres: GenreOption[] = 
    AI_CONCEPT_CATEGORIES.find(cat => cat.value === concept)?.genres || [];

  const {
    mutate: createPost,
    loading: isSubmitting,
    error,
  } = usePostCreate({
    onSuccess: (response) => {
      toast({
        title: "게시글 작성 완료! 🎉",
        description: `"${response?.afterTitle}" 게시글이 AI의 마법으로 탄생했습니다.`,
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
    setGenre(""); // 컨셉 변경시 장르 초기화
    // 기존 변환 결과 초기화
    if (conversionResult) {
      setConversionResult(null);
      setActiveTab("write");
    }
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    // 장르 변경시 기존 변환 결과 초기화
    if (conversionResult) {
      setConversionResult(null);
      setActiveTab("write");
    }
  };

  const handleEmotionClick = (emotionValue: ReactionLabelType) => {
    setEmotion(emotionValue);
    // 감정 변경시 기존 변환 결과 초기화
    if (conversionResult) {
      setConversionResult(null);
      setActiveTab("write");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // 제목 변경시 기존 변환 결과 초기화
    if (conversionResult) {
      setConversionResult(null);
      setActiveTab("write");
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // 내용 변경시 기존 변환 결과 초기화
    if (conversionResult) {
      setConversionResult(null);
      setActiveTab("write");
    }
  };

  // AI 미리보기 생성 (모의 함수)
  const generateAIPreview = useCallback(async () => {
    if (!title.trim() || !content.trim() || !concept) {
      toast({
        title: "입력 오류",
        description: "컨셉 카테고리, 제목, 내용은 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    setIsPreviewLoading(true);
    
    try {
      // 실제 구현에서는 API 호출
      // const response = await fetch('/api/ai/preview', { ... });
      
      // 모의 응답 생성 (개발용)
      await new Promise(resolve => setTimeout(resolve, 2000)); // 로딩 시뮬레이션
      
      const mockResult: AIConversionResult = {
        sessionId: `session_${Date.now()}`,
        originalTitle: title,
        originalContent: content,
        convertedTitle: `${title} (AI 변환됨)`,
        convertedContent: `${content}\n\n[AI가 문학적 표현으로 변환한 내용]`,
        titleDiff: [
          { type: 'EQUAL', text: title },
          { type: 'INSERT', text: ' (AI 변환됨)', reason: '제목에 변환 표시 추가' }
        ],
        contentDiff: [
          { type: 'EQUAL', text: content },
          { type: 'INSERT', text: '\n\n[AI가 문학적 표현으로 변환한 내용]', reason: '문학적 표현 추가' }
        ],
        metadata: {
          sessionId: `session_${Date.now()}`,
          processingTime: 1500,
          conceptScore: 85,
          writingScore: 78,
          creativityScore: 92,
          emotionScore: emotion ? 88 : undefined,
          genreScore: genre ? 82 : undefined,
          totalScore: 85,
          improvements: [
            '문장 구조를 더 세련되게 개선했습니다',
            '감정 표현을 더 풍부하게 만들었습니다',
            '어휘 선택을 문학적으로 향상시켰습니다'
          ],
          originalLength: title.length + content.length,
          convertedLength: (title + ' (AI 변환됨)').length + (content + '\n\n[AI가 문학적 표현으로 변환한 내용]').length,
          wordsChanged: 12,
          wordsAdded: 8,
          wordsRemoved: 2
        },
        createdAt: new Date().toISOString()
      };

      setConversionResult(mockResult);
      setActiveTab("ai-preview");
      
      toast({
        title: "AI 변환 완료! ✨",
        description: "변환 결과를 확인해보세요.",
      });
      
    } catch (error) {
      toast({
        title: "변환 실패",
        description: "AI 변환 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }, [title, content, concept, genre, emotion, toast]);

  // 변환 결과 승인
  const handleAcceptConversion = () => {
    if (!conversionResult) return;
    
    setTitle(conversionResult.convertedTitle);
    setContent(conversionResult.convertedContent);
    setConversionResult(null);
    setActiveTab("write");
    
    toast({
      title: "변환 승인됨! 👍",
      description: "AI 변환 결과가 적용되었습니다. 이제 게시글을 발행할 수 있습니다.",
    });
  };

  // 변환 다시 시도
  const handleRetryConversion = () => {
    generateAIPreview();
  };

  // 변환 취소
  const handleRejectConversion = () => {
    setConversionResult(null);
    setActiveTab("write");
    
    toast({
      title: "변환 취소됨",
      description: "원본 내용으로 돌아갔습니다.",
    });
  };

  const validateNecessaries = () => {
    return !title.trim() || !content.trim() || !concept;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateNecessaries()) {
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

  return (
    <form onSubmit={handleSubmit}>
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
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                글쓰기
              </TabsTrigger>
              <TabsTrigger 
                value="ai-preview" 
                className="flex items-center gap-2"
                disabled={!conversionResult}
              >
                <Wand2 className="h-4 w-4" />
                AI 변환 결과
                {conversionResult && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    New
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-6 mt-6">
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
                          <div className="text-xs text-gray-500">{category.description}</div>
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
                        <SelectItem key={genreOption.value} value={genreOption.value}>
                          <div>
                            <div className="font-medium">{genreOption.label}</div>
                            <div className="text-xs text-gray-500">{genreOption.description}</div>
                            {genreOption.targetAudience && (
                              <div className="text-xs text-blue-500">👥 {genreOption.targetAudience}</div>
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
                  onChange={handleTitleChange}
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
                  onChange={handleContentChange}
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
                  AI 변환에 참고할 감정을 선택하거나, 비워두면 자동으로 감지됩니다
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

              {/* AI Preview Button */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Wand2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      AI로 글을 더 매력적으로 만들어보세요! ✨
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      선택한 컨셉과 장르에 맞춰 AI가 여러분의 글을 문학적으로 변환해드립니다.
                      변환 후에도 원본으로 되돌리거나 수정할 수 있습니다.
                    </p>
                    <Button
                      type="button"
                      onClick={generateAIPreview}
                      disabled={isPreviewLoading || validateNecessaries()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isPreviewLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          AI가 변환 중...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          AI 변환 미리보기 생성
                        </>
                      )}
                    </Button>
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

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || validateNecessaries()}
                  className="bg-gray-800 hover:bg-gray-900"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      변환 중...
                    </>
                  ) : (
                    "게시글 발행"
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai-preview" className="mt-6">
              {conversionResult && !isPreviewLoading && (
                <div className="space-y-6 bg-gray-50 p-6 rounded-xl border">
                  {/* 상세 통계 대시보드 - 백엔드 데이터 활용 */}
                  <ConversionDashboard metadata={conversionResult.metadata} />

                  {/* 뷰 옵션 토글 */}
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => setShowComparison(!showComparison)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showComparison ? '단일 뷰로 보기' : '원본과 나란히 비교하기'}
                    </Button>
                  </div>

                  {/* Comprehensive Diff View */}
                  <ComprehensiveDiffView
                    originalTitle={conversionResult.originalTitle}
                    transformedTitle={conversionResult.convertedTitle}
                    originalContent={conversionResult.originalContent}
                    transformedContent={conversionResult.convertedContent}
                    titleDiff={conversionResult.titleDiff}
                    contentDiff={conversionResult.contentDiff}
                    sessionId={conversionResult.sessionId}
                    showComparison={showComparison}
                    onToggleView={() => setShowComparison(!showComparison)}
                  />

                  {/* 액션 버튼들 */}
                  <div className="flex flex-wrap gap-4 justify-center pt-4 border-t">
                    <Button
                      onClick={handleAcceptConversion}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                    >
                      <Check className="w-5 h-5" />
                      ✅ 변환 결과 승인하고 계속하기
                    </Button>
                    <Button
                      onClick={handleRetryConversion}
                      disabled={isPreviewLoading}
                      className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 disabled:scale-100 flex items-center gap-2 shadow-lg"
                    >
                      <RefreshCw className={`w-5 h-5 ${isPreviewLoading ? 'animate-spin' : ''}`} />
                      🔄 다시 변환하기
                    </Button>
                    <Button
                      onClick={handleRejectConversion}
                      variant="outline"
                      className="px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                    >
                      <X className="w-5 h-5" />
                      ❌ 변환 취소하고 돌아가기
                    </Button>
                  </div>
                </div>
              )}

              {isPreviewLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">AI가 열심히 변환 중입니다...</p>
                    <p className="text-sm text-gray-500 mt-1">잠시만 기다려주세요</p>
                  </div>
                </div>
              )}

              {!conversionResult && !isPreviewLoading && (
                <div className="text-center py-12">
                  <Wand2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    아직 AI 변환 결과가 없습니다
                  </h3>
                  <p className="text-gray-500 mb-6">
                    "글쓰기" 탭에서 내용을 작성하고 AI 변환을 시도해보세요.
                  </p>
                  <Button
                    onClick={() => setActiveTab("write")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    글쓰기로 돌아가기
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </form>
  );
}
