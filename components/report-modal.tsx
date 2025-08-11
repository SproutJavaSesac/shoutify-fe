"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Flag, AlertTriangle } from "lucide-react";
import {
  useCreatePostReport,
  useCreateCommentReport,
} from "@/lib/hooks/useReports";
import { REPORT_REASON_OPTIONS } from "@/constants/reports";
import { ReportReasonType } from "@/types/reports";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "post" | "comment";
  targetId: string | number;
  targetTitle?: string;
  targetContent?: string;
}

export function ReportModal({
  isOpen,
  onClose,
  type,
  targetId,
  targetTitle,
  targetContent,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReasonType | "">(
    ""
  );
  const [customReason, setCustomReason] = useState("");
  const { toast } = useToast();

  const { mutate: reportPost, loading: postLoading } = useCreatePostReport();
  const { mutate: reportComment, loading: commentLoading } =
    useCreateCommentReport();

  const isSubmitting = postLoading || commentLoading;

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        title: "신고 사유를 선택해 주세요",
        description: "신고하려는 이유를 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (selectedReason === "OTHER" && !customReason.trim()) {
      toast({
        title: "상세 사유를 입력해 주세요",
        description: "기타를 선택하신 경우 구체적인 사유를 작성해 주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reportData = {
        reasonType: selectedReason,
        reasonDetail: selectedReason === "OTHER" ? customReason.trim() : null,
      };

      if (type === "post") {
        await reportPost({
          postId: targetId,
          body: reportData,
        });
      } else {
        await reportComment({
          commentId: targetId,
          body: reportData,
        });
      }

      toast({
        title: "신고가 접수되었습니다",
        description:
          "신고해 주셔서 감사합니다. 관리팀에서 검토 후 조치할 예정입니다.",
      });

      handleClose();
    } catch (error) {
      toast({
        title: "신고 접수 실패",
        description:
          "신고 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setSelectedReason("");
    setCustomReason("");
  };

  const getReasonLabel = (value: ReportReasonType) => {
    return (
      REPORT_REASON_OPTIONS.find((option) => option.value === value)?.label ||
      value
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-500" />
            <span>{type === "post" ? "게시글" : "댓글"} 신고하기</span>
          </DialogTitle>
          {targetTitle && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              "{targetTitle}"
            </p>
          )}
          {targetContent && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-3 bg-gray-50 p-2 rounded">
              {targetContent}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium">
              이 {type === "post" ? "게시글" : "댓글"}을 신고하는 이유는
              무엇인가요?
            </Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={(value) =>
                setSelectedReason(value as ReportReasonType)
              }
              className="mt-3 space-y-2"
            >
              {REPORT_REASON_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="text-sm cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "OTHER" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                구체적인 사유를 알려주세요
              </Label>
              <Textarea
                id="custom-reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="신고 사유를 상세히 작성해 주세요..."
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {500 - customReason.length}자 남음
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800 space-y-1">
                <p>
                  <strong>주의사항:</strong>
                </p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>허위 신고 시 계정 이용이 제한될 수 있습니다.</li>
                  <li>신고는 24시간 내에 검토됩니다.</li>
                  <li>신고자 정보는 보호됩니다.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "신고 접수 중..." : "신고하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
