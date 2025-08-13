"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export const ShareButton = ({
  onClick,
  className,
  size = "sm",
}: ShareButtonProps) => {
  return (
    <Button
      variant="ghost"
      size={size}
      className={`h-8 w-8 p-0 ${className}`}
      onClick={onClick}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};
