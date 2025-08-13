"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { withAuth } from "@/lib/hoc/withAuth";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  executeWithAuth?: (action: () => void) => void;
  isAuthenticated?: boolean;
}

const BaseBookmarkButton = ({
  isBookmarked,
  onClick,
  className,
  size = "sm",
  executeWithAuth,
  isAuthenticated,
}: BookmarkButtonProps) => {
  const handleClick = () => {
    if (executeWithAuth) {
      executeWithAuth(onClick);
    } else {
      onClick();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className={`h-8 w-8 p-0 ${isBookmarked ? "text-blue-600" : ""} ${className}`}
            onClick={handleClick}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isAuthenticated
              ? isBookmarked
                ? "북마크 해제"
                : "북마크 추가"
              : "로그인이 필요합니다"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const BookmarkButton = withAuth(BaseBookmarkButton);
