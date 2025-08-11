"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Facebook,
  MessageCircle,
  Share2,
  Twitter,
  Instagram,
  Image as ImageIcon,
  Quote,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  postId: string | number;
  originalText?: string; // 원문
  transformedText?: string; // 변환된 문학적 표현
}

export function ShareModal({
  isOpen,
  onClose,
  postTitle,
  postId,
  originalText,
  transformedText,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const postUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        description: "링크가 클립보드에 복사되었습니다!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        description: "링크 복사에 실패했습니다",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedTitle = encodeURIComponent(postTitle);
    const encodedUrl = encodeURIComponent(postUrl);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "kakao":
        // KakaoTalk sharing would require Kakao SDK integration
        toast({
          description: "카카오톡 공유 기능이 곧 제공될 예정입니다",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  // 텍스트 줄바꿈 함수
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine + word + " ";
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    return lines;
  };

  // 텍스트를 이미지로 변환하는 함수
  const createStoryImage = async (
    text: string,
    type: "quote" | "transformation"
  ) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Instagram 스토리 사이즈 (9:16 비율)
    canvas.width = 1080;
    canvas.height = 1920;

    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (type === "quote") {
      gradient.addColorStop(0, "#fef7ff"); // 밝은 보라
      gradient.addColorStop(1, "#f3e8ff"); // 연한 보라
    } else {
      gradient.addColorStop(0, "#f0f9ff"); // 밝은 파랑
      gradient.addColorStop(1, "#e0f2fe"); // 연한 파랑
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 텍스트 설정
    ctx.fillStyle = "#581c87"; // 어두운 보라
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (type === "quote") {
      // 인용구 스타일
      ctx.font = "bold 80px serif";
      ctx.fillText('"', canvas.width / 2, 300);

      // 메인 텍스트
      ctx.font = "60px serif";
      const lines = wrapText(ctx, text, canvas.width - 200);
      const lineHeight = 80;
      const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
      });

      ctx.font = "bold 80px serif";
      ctx.fillText('"', canvas.width / 2, canvas.height - 400);
    } else {
      // 변환 스타일
      if (originalText && transformedText) {
        // "전" 텍스트
        ctx.fillStyle = "#dc2626"; // 빨간색
        ctx.font = "bold 48px sans-serif";
        ctx.fillText("일상 표현", canvas.width / 2, 400);

        ctx.font = "52px sans-serif";
        const originalLines = wrapText(ctx, originalText, canvas.width - 200);
        originalLines.forEach((line, index) => {
          ctx.fillText(line, canvas.width / 2, 500 + index * 60);
        });

        // 화살표
        ctx.fillStyle = "#7c3aed";
        ctx.font = "bold 60px sans-serif";
        ctx.fillText("↓", canvas.width / 2, 800);

        // "후" 텍스트
        ctx.fillStyle = "#581c87"; // 어두운 보라
        ctx.font = "bold 48px serif";
        ctx.fillText("문학적 표현", canvas.width / 2, 900);

        ctx.font = "52px serif";
        const transformedLines = wrapText(
          ctx,
          transformedText,
          canvas.width - 200
        );
        transformedLines.forEach((line, index) => {
          ctx.fillText(line, canvas.width / 2, 1000 + index * 60);
        });
      }
    }

    // 하단 브랜딩
    ctx.fillStyle = "#9333ea";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText("구절구절", canvas.width / 2, canvas.height - 200);

    ctx.font = "28px sans-serif";
    ctx.fillText("gujeol-gujeol.com", canvas.width / 2, canvas.height - 150);

    return canvas.toDataURL("image/png");
  };

  // 이미지로 Instagram 스토리 공유
  const handleInstagramImageShare = async (
    type: "quote" | "transformation"
  ) => {
    try {
      const text = type === "quote" ? postTitle : transformedText || postTitle;
      const imageDataUrl = await createStoryImage(text, type);

      if (!imageDataUrl) {
        toast({
          description: "이미지 생성에 실패했습니다.",
          variant: "destructive",
        });
        return;
      }

      // 이미지를 Blob으로 변환
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      // Web Share API 시도 (모바일에서 Instagram 앱으로 직접 공유)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "story.png", { type: "image/png" });
        const shareData = {
          files: [file],
          title: "구절구절 - 감정을 문학으로",
          text: "구절구절에서 만든 아름다운 표현을 확인해보세요!",
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // 폴백: 이미지 다운로드
      const link = document.createElement("a");
      link.download = `gujeol-story-${Date.now()}.png`;
      link.href = imageDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        description:
          "이미지가 다운로드되었습니다. Instagram 스토리에 업로드해 주세요!",
        duration: 4000,
      });
    } catch (error) {
      console.error("Instagram 공유 오류:", error);
      toast({
        description: "공유 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="h-5 w-5" />
            <span>공유하기</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Link Share */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              링크 공유
            </label>
            <div className="flex space-x-2">
              <Input value={postUrl} readOnly className="flex-1 text-sm" />
              <Button onClick={handleCopyLink} size="sm">
                <Copy className="h-4 w-4" />
                {copied ? "복사됨" : "복사"}
              </Button>
            </div>
          </div>

          {/* Instagram Stories Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Instagram 스토리 공유
            </label>
            <div className="space-y-2">
              {/* 인용구 이미지 */}
              <Button
                onClick={() => handleInstagramImageShare("quote")}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
              >
                <Quote className="h-4 w-4" />
                <span>인용구 이미지로 공유</span>
              </Button>

              {/* 변환 비교 이미지 (원문과 변환문이 모두 있을 때만 표시) */}
              {originalText && transformedText && (
                <Button
                  onClick={() => handleInstagramImageShare("transformation")}
                  variant="outline"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>변환 과정 이미지로 공유</span>
                </Button>
              )}
            </div>
          </div>

          {/* Social Share */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              다른 소셜 미디어 공유
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => handleSocialShare("twitter")}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                <Twitter className="h-4 w-4" />
                <span>트위터</span>
              </Button>
              <Button
                onClick={() => handleSocialShare("facebook")}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                <Facebook className="h-4 w-4" />
                <span>페이스북</span>
              </Button>
              <Button
                onClick={() => handleSocialShare("kakao")}
                variant="outline"
                className="flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-500 border-yellow-400"
              >
                <MessageCircle className="h-4 w-4" />
                <span>카카오</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
