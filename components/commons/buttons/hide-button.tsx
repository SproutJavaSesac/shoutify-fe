"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { withOwnership } from "@/lib/hoc/withOwnership";
import { Eye, EyeOff } from "lucide-react";

interface HideButtonProps {
  isHidden: boolean;
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
  disabled?: boolean;
  isMine?: boolean; // 소유권 확인용
  // HOC에서 주입되는 props
  executeWithOwnership?: (action: () => void) => void;
  isOwner?: boolean;
  isAuthenticated?: boolean;
}

const BaseHideButton = ({
  isHidden,
  onClick,
  className,
  size = "sm",
  children,
  disabled = false,
  isMine,
  executeWithOwnership,
  isOwner,
  isAuthenticated,
}: HideButtonProps) => {
  const handleClick = () => {
    if (executeWithOwnership) {
      executeWithOwnership(onClick);
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

  const getTooltipMessage = () => {
    if (!isAuthenticated) return "로그인이 필요합니다";
    if (!isOwner) return "본인의 콘텐츠만 숨길 수 있습니다";
    return isHidden ? "다시 표시합니다" : "숨깁니다";
  };

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
          <p>{getTooltipMessage()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const HideButton = withOwnership(BaseHideButton, {
  resourceName: "콘텐츠",
  showOwnershipModal: true,
});
