"use client";

import { AuthModal } from "@/components/auth-modal";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import React, { useState } from "react";

interface AuthTextareaProps extends React.ComponentProps<"textarea"> {
  onAuthenticatedFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onAuthenticatedClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  requireAuthOnFocus?: boolean;
  requireAuthOnClick?: boolean;
}

export function AuthTextarea({
  onAuthenticatedFocus,
  onAuthenticatedClick,
  requireAuthOnFocus = true,
  requireAuthOnClick = true,
  onFocus,
  onClick,
  ...textareaProps
}: AuthTextareaProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (requireAuthOnFocus && !user) {
      setShowAuthModal(true);
      e.target.blur(); // 포커스 해제
      return;
    }
    onAuthenticatedFocus?.(e);
    onFocus?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (requireAuthOnClick && !user) {
      setShowAuthModal(true);
      return;
    }
    onAuthenticatedClick?.(e);
    onClick?.(e);
  };

  return (
    <>
      <Textarea
        {...textareaProps}
        onFocus={handleFocus}
        onClick={handleClick}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
