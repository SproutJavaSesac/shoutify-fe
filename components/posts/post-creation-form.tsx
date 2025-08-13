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
import {
  CONCEPT_OPTIONS,
  EMOTICON_OPTIONS,
  POST_ROUTES,
} from "@/constants/posts";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { usePostCreate } from "@/lib/hooks/usePosts";
import { ConceptType } from "@/types/posts";
import { ReactionLabelType } from "@/types/reactions";
import { Sparkles, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export function PostCreationForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [concept, setConcept] = useState<ConceptType | "">("");
  const [emotion, setEmotion] = useState<ReactionLabelType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

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
  };

  const handleEmotionClick = (emotionValue: ReactionLabelType) => {
    setEmotion(emotionValue);
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
        <CardContent className="space-y-6">
          {/* Concept Selection */}
          <div className="space-y-2">
            <Label htmlFor="concept">컨셉 카테고리 *</Label>
            <Select value={concept} onValueChange={handleConceptChange}>
              <SelectTrigger>
                <SelectValue placeholder="컨셉 카테고리를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {CONCEPT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
        </CardContent>
      </Card>
    </form>
  );
}
