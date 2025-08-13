"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { withAuth } from "@/lib/hoc/withAuth";
import { Eye, EyeOff } from "lucide-react";

interface HideButtonProps {
  isHidden: boolean;
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
  disabled?: boolean;
  executeWithAuth?: (action: () => void) => void;
  isAuthenticated?: boolean;
}

const BaseHideButton = ({
  isHidden,
  onClick,
  className,
  size = "sm",
  children,
  disabled = false,
  executeWithAuth,
  isAuthenticated,
}: HideButtonProps) => {
  const handleClick = () => {
    if (executeWithAuth) {
      executeWithAuth(onClick);
    } else {
      onClick();
    }
  };

  const defaultChildren = isHidden ? "숨김 해제" : "숨기기";
  const icon = isHidden ? (
    <EyeOff className="h-3 w-3 mr-1" />
  ) : (
    <Eye className="h-3 w-3 mr-1" />
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className={`h-7 px-2 text-xs ${className}`}
            onClick={handleClick}
            disabled={disabled}
          >
            {icon}
            {children || defaultChildren}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isAuthenticated
              ? isHidden
                ? "게시글을 다시 표시합니다"
                : "게시글을 숨깁니다"
              : "로그인이 필요합니다"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const HideButton = withAuth(BaseHideButton);
