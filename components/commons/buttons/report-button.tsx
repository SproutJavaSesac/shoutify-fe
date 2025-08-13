"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { withAuth } from "@/lib/hoc/withAuth";
import { Flag } from "lucide-react";

interface ReportButtonProps {
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
  executeWithAuth?: (action: () => void) => void;
  isAuthenticated?: boolean;
}

const BaseReportButton = ({
  onClick,
  className,
  size = "sm",
  children = "Report",
  executeWithAuth,
  isAuthenticated,
}: ReportButtonProps) => {
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
            className={`h-7 px-2 text-xs ${className}`}
            onClick={handleClick}
          >
            <Flag className="h-3 w-3 mr-1" />
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isAuthenticated ? "게시글을 신고하세요" : "로그인이 필요합니다"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ReportButton = withAuth(BaseReportButton);
