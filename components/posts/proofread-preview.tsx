import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDiffStats, generateDiff } from "@/lib/utils/diff";
import { ConceptType } from "@/types/posts";
import { ProofreadCreateResponse } from "@/types/proofreads";
import { ArrowLeft, PenTool, RefreshCw, Send } from "lucide-react";
import { useMemo } from "react";
import { ProofreadDashboard } from "./proofread-dashboard";
import { ProofreadDiffView } from "./proofread-diff-view";

interface ProofreadPreviewProps {
  proofreadResult: ProofreadCreateResponse;
  originalTitle: string;
  originalContent: string;
  conceptType: ConceptType;
  onBackToEdit: () => void;
  onRetryProofread: () => void;
  onPublishProofread: () => void;
  isPublishing: boolean;
  isRetrying: boolean;
}

export function ProofreadPreview({
  proofreadResult,
  originalTitle,
  originalContent,
  conceptType,
  onBackToEdit,
  onRetryProofread,
  onPublishProofread,
  isPublishing,
  isRetrying,
}: ProofreadPreviewProps) {
  // Diff 생성
  const titleDiff = useMemo(
    () => generateDiff(originalTitle, proofreadResult.afterTitle),
    [originalTitle, proofreadResult.afterTitle]
  );

  const contentDiff = useMemo(
    () => generateDiff(originalContent, proofreadResult.afterContent),
    [originalContent, proofreadResult.afterContent]
  );

  // Diff 통계 계산
  const titleStats = useMemo(() => calculateDiffStats(titleDiff), [titleDiff]);
  const contentStats = useMemo(
    () => calculateDiffStats(contentDiff),
    [contentDiff]
  );

  // 메타데이터 생성 (실제로는 서버에서 받아와야 함)
  // AI 점수가 없는 상태로 테스트
  const metadata = useMemo(
    () => ({
      sessionId: proofreadResult.taskUuid,
      processingTime: 2000,
      // AI 점수들을 주석처리해서 없는 상태로 테스트
      // conceptScore: 85,
      // writingScore: 92,
      // creativityScore: 88,
      // emotionScore: 90,
      // genreScore: 87,
      // totalScore: 89,
      improvements: [
        "문장 구조를 더 세련되게 개선했습니다",
        "감정 표현을 더 풍부하게 만들었습니다",
        "어휘 선택을 문학적으로 향상시켰습니다",
      ],
      originalLength: originalTitle.length + originalContent.length,
      convertedLength:
        proofreadResult.afterTitle.length + proofreadResult.afterContent.length,
      wordsChanged: titleStats.changedWords + contentStats.changedWords,
      wordsAdded: titleStats.addedChars + contentStats.addedChars,
      wordsRemoved: titleStats.deletedChars + contentStats.deletedChars,
    }),
    [proofreadResult, originalTitle, originalContent, titleStats, contentStats]
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">AI 첨삭 결과</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            첨삭 완료
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToEdit}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />글 수정하기
        </Button>
      </div>

      {/* 점수 및 통계 대시보드 */}
      <ProofreadDashboard metadata={metadata} />

      {/* Diff 뷰어 */}
      <ProofreadDiffView
        originalTitle={originalTitle}
        originalContent={originalContent}
        modifiedTitle={proofreadResult.afterTitle}
        modifiedContent={proofreadResult.afterContent}
        titleDiff={titleDiff}
        contentDiff={contentDiff}
      />

      {/* 메타 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">첨삭 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">컨셉:</span>
              <Badge variant="outline" className="ml-2">
                {conceptType}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-gray-600">첨삭자:</span>
              <span className="ml-2 font-medium">
                {proofreadResult.nickname}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">첨삭 ID:</span>
              <span className="ml-2 text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                #{proofreadResult.attemptId}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t">
        <Button
          onClick={onBackToEdit}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <PenTool className="h-5 w-5" />
          다시 글 다듬기
        </Button>

        <Button
          onClick={onRetryProofread}
          disabled={isRetrying}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-5 w-5 ${isRetrying ? "animate-spin" : ""}`}
          />
          다시 첨삭하기
        </Button>

        <Button
          onClick={onPublishProofread}
          disabled={isPublishing}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Send className={`h-5 w-5 ${isPublishing ? "animate-pulse" : ""}`} />
          {isPublishing ? "발행 중..." : "이대로 발행하기"}
        </Button>
      </div>
    </div>
  );
}
