"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { withAuth } from "@/lib/hoc/withAuth";
import { MessageCircle } from "lucide-react";

interface CommentWriteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  executeWithAuth?: (action: () => void) => void;
  isAuthenticated?: boolean;
}

const BaseCommentWriteButton = ({
  onClick,
  disabled = false,
  children = "댓글 작성",
  className,
  executeWithAuth,
  isAuthenticated,
}: CommentWriteButtonProps) => {
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
            onClick={handleClick}
            disabled={disabled}
            className={className}
            variant="outline"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isAuthenticated ? "댓글을 작성하세요" : "로그인이 필요합니다"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const CommentWriteButton = withAuth(BaseCommentWriteButton);
