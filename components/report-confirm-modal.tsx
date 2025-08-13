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
import { AlertTriangle } from "lucide-react";

interface ReportConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "post" | "comment";
  targetTitle?: string;
  loading?: boolean;
}

export function ReportConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  targetTitle,
  loading = false,
}: ReportConfirmModalProps) {
  const typeText = type === "post" ? "게시글" : "댓글";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>{typeText} 신고 확인</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            <div className="space-y-2">
              <p>이 {typeText}을(를) 신고하시겠습니까?</p>
              {targetTitle && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">대상 {typeText}:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {targetTitle}
                  </p>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                신고된 내용은 관리자가 검토한 후 적절한 조치를 취합니다. 허위
                신고 시 제재를 받을 수 있습니다.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={loading}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "신고 중..." : "신고하기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
