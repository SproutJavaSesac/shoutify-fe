"use client";

import { AuthTextarea, CommentWriteButton } from "@/components/commons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import React, { useState } from "react";

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
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    await onSubmit(content.trim());
    setContent("");
  };

  const handleCommentSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    await onSubmit(content.trim());
    setContent("");
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
        <AuthTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
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
            <CommentWriteButton
              onClick={() => {}}
              disabled={!content.trim() || isSubmitting}
              className={showCancel ? "h-9 px-3" : ""}
            >
              {isSubmitting ? "등록 중..." : submitLabel}
            </CommentWriteButton>
          </div>
        </div>
      </form>
    </>
  );
}
