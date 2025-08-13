"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { withOwnership } from "@/lib/hoc/withOwnership";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
  isMine?: boolean; // 소유권 확인용
  showConfirmDialog?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  // HOC에서 주입되는 props
  executeWithOwnership?: (action: () => void) => void;
  isOwner?: boolean;
  isAuthenticated?: boolean;
}

const BaseDeleteButton = ({
  onClick,
  children = "삭제",
  className,
  size = "sm",
  variant = "ghost",
  disabled = false,
  isMine,
  showConfirmDialog = true, // 삭제는 기본적으로 확인 다이얼로그 표시
  confirmTitle = "삭제 확인",
  confirmDescription = "정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
  executeWithOwnership,
  isOwner,
  isAuthenticated,
}: DeleteButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    const executeAction = () => {
      if (showConfirmDialog) {
        setShowDialog(true);
      } else {
        onClick();
      }
    };

    if (executeWithOwnership) {
      executeWithOwnership(executeAction);
    } else {
      executeAction();
    }
  };

  const handleConfirm = () => {
    setShowDialog(false);
    onClick();
  };

  const getTooltipMessage = () => {
    if (!isAuthenticated) return "로그인이 필요합니다";
    if (!isOwner) return "본인의 콘텐츠만 삭제할 수 있습니다";
    return "삭제합니다";
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              className={className}
              variant={variant}
              size={size}
              disabled={disabled}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipMessage()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 확인 다이얼로그 */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const DeleteButton = withOwnership(BaseDeleteButton, {
  resourceName: "콘텐츠",
  showOwnershipModal: true,
});
