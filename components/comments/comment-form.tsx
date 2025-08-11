"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";

interface CommentFormProps {
  placeholder?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  showCancel?: boolean;
  minHeight?: string;
  className?: string;
  submitLabel?: string;
}

export function CommentForm({
  placeholder = "댓글을 입력하세요...",
  onSubmit,
  onCancel,
  isSubmitting = false,
  showCancel = false,
  minHeight = "min-h-[100px]",
  className = "",
  submitLabel = "댓글 등록",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!content.trim()) {
      return;
    }

    await onSubmit(content.trim());
    setContent("");
  };

  const handleTextareaInteraction = () => {
    if (!user) {
      setShowAuthModal(true);
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <Textarea
          value={content}
          onChange={(e) => {
            if (!user) {
              setShowAuthModal(true);
              return;
            }
            setContent(e.target.value);
          }}
          onFocus={handleTextareaInteraction}
          onClick={handleTextareaInteraction}
          placeholder={
            user ? placeholder : "로그인 후 댓글을 작성할 수 있습니다."
          }
          className={minHeight}
          maxLength={500}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${
              content.length > 900
                ? "text-red-500 font-medium"
                : content.length > 800
                  ? "text-yellow-600"
                  : "text-gray-500"
            }`}
          >
            {500 - content.length}자 남음
            {content.length > 400 && " (거의 다 찼어요!)"}
          </span>
          <span className="text-xs text-gray-400">{content.length}/500자</span>
          <div className="flex space-x-2">
            {showCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={!user || !content.trim() || isSubmitting}
              size={showCancel ? "sm" : "default"}
            >
              {isSubmitting ? (
                <>등록 중...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </>
  );
}
