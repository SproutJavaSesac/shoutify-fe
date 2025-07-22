"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createPost } from "@/apis/posts";
import { FetchError } from "@/apis/client";
import { ConceptType, EmotionType } from "@/types/post-creation";
import { CATEGORY_OPTIONS, EMOTION_OPTIONS } from "@/constants/post-creation";

export function PostCreationForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ConceptType | "">("");
  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as ConceptType | "");
  };

  const handleEmotionClick = (emotionValue: EmotionType) => {
    setEmotion(emotion === emotionValue ? null : emotionValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 입력값 검증
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "입력 오류",
        description: "카테고리, 제목, 내용은 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    // 로그인 확인
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "글을 작성하려면 먼저 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 이미지 업로드 처리 (선택적)
      let imageUrl: string | undefined;
      if (image) {
        // TODO: 이미지 업로드 API 호출
        // const uploadResponse = await uploadImage(image);
        // imageUrl = uploadResponse.url;
        console.log("이미지 업로드 예정:", image.name);
      }

      // 게시글 생성 요청 데이터 준비
      const postData = {
        title: title.trim(),
        content: content.trim(),
        conceptType: category,
        emotionType: emotion,
        ...(imageUrl && { imageUrl }), // 이미지가 있을 때만 포함
      };

      console.log("🚀 게시글 생성 요청 데이터:", postData);

      // API 요청 실행
      const response = await createPost(postData);

      console.log("✅ 게시글 생성 성공:", response);

      // 성공 알림
      toast({
        title: "게시글 작성 완료! 🎉",
        description: `"${response.title}" 게시글이 AI의 마법으로 탄생했습니다.`,
      });

      // 생성된 게시글로 이동
      router.push(`/posts/${response.postId}`);
    } catch (error) {
      console.error("게시글 작성 실패:", error);

      let errorMessage = "게시글 작성 중 오류가 발생했습니다.";

      if (error instanceof FetchError) {
        // 서버에서 받은 구체적인 에러 메시지 사용
        errorMessage = error.message || "서버 오류가 발생했습니다.";

        // 특정 에러 코드에 따른 메시지 처리
        if (error.status === 400) {
          errorMessage = "입력한 정보를 다시 확인해주세요.";
        } else if (error.status === 401) {
          errorMessage = "로그인이 필요합니다.";
        } else if (error.status === 403) {
          errorMessage = "게시글 작성 권한이 없습니다.";
        } else if (error.status === 500) {
          errorMessage =
            "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
        }
      } else if (error instanceof Error) {
        // 네트워크 오류 등
        errorMessage = "네트워크 연결을 확인해주세요.";
      }

      toast({
        title: "작성 실패 😅",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
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
            <p className="text-sm text-gray-500">{100 - title.length}자 남음</p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="당신의 생각을 자유롭게 써보세요. AI가 아름다운 문학 작품으로 변화시켜 드립니다..."
              className="min-h-[200px]"
              maxLength={2000}
            />
            <p className="text-sm text-gray-500">
              {2000 - content.length}자 남음
            </p>
          </div>

          {/* Emotion Selection */}
          <div className="space-y-2">
            <Label>감정 (선택사항)</Label>
            <p className="text-sm text-gray-600 mb-3">
              AI 변환에 참고할 감정을 선택하거나, 비워두면 자동으로 감지됩니다
            </p>
            <div className="flex flex-wrap gap-2">
              {EMOTION_OPTIONS.map((emotionOption) => (
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
              disabled={
                isSubmitting || !title.trim() || !content.trim() || !category
              }
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
