import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIFF_COLORS } from "@/constants/proofreads";
import { DiffSegment } from "@/types/proofreads";
import { Eye, EyeOff, GitCompare } from "lucide-react";
import { useState } from "react";

interface ProofreadDiffViewProps {
  originalTitle: string;
  originalContent: string;
  modifiedTitle: string;
  modifiedContent: string;
  titleDiff: DiffSegment[];
  contentDiff: DiffSegment[];
}

export function ProofreadDiffView({
  originalTitle,
  originalContent,
  modifiedTitle,
  modifiedContent,
  titleDiff,
  contentDiff,
}: ProofreadDiffViewProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">(
    "side-by-side"
  );
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  return (
    <div className="space-y-6">
      {/* 컨트롤 버튼들 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "side-by-side" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("side-by-side")}
          >
            나란히 비교
          </Button>
          <Button
            variant={viewMode === "unified" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("unified")}
          >
            통합 보기
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDiffOnly(!showDiffOnly)}
          className="flex items-center gap-2"
        >
          {showDiffOnly ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {showDiffOnly ? "전체 보기" : "변경사항만"}
        </Button>
      </div>

      {/* 색상 가이드 */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
              <span>추가됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span>삭제됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-transparent border border-gray-200 rounded"></div>
              <span>변경 없음</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "side-by-side" ? (
        <SideBySideView
          originalTitle={originalTitle}
          originalContent={originalContent}
          modifiedTitle={modifiedTitle}
          modifiedContent={modifiedContent}
          titleDiff={titleDiff}
          contentDiff={contentDiff}
          showDiffOnly={showDiffOnly}
        />
      ) : (
        <UnifiedView
          titleDiff={titleDiff}
          contentDiff={contentDiff}
          showDiffOnly={showDiffOnly}
        />
      )}
    </div>
  );
}

interface SideBySideViewProps {
  originalTitle: string;
  originalContent: string;
  modifiedTitle: string;
  modifiedContent: string;
  titleDiff: DiffSegment[];
  contentDiff: DiffSegment[];
  showDiffOnly: boolean;
}

function SideBySideView({
  originalTitle,
  originalContent,
  modifiedTitle,
  modifiedContent,
  titleDiff,
  contentDiff,
  showDiffOnly,
}: SideBySideViewProps) {
  // Diff를 원본과 수정본으로 분리
  const {
    originalParts: originalTitleParts,
    modifiedParts: modifiedTitleParts,
  } = separateDiffParts(titleDiff);
  const {
    originalParts: originalContentParts,
    modifiedParts: modifiedContentParts,
  } = separateDiffParts(contentDiff);

  return (
    <div className="space-y-6">
      {/* 제목 비교 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          제목 변환
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 원본 제목 */}
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 pb-3">
              <CardTitle className="text-sm font-medium text-red-700">
                변환 전
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-3 bg-white border rounded-lg min-h-[60px]">
                {showDiffOnly ? (
                  <DiffContent segments={originalTitleParts} />
                ) : (
                  <span className="text-gray-800">{originalTitle}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 수정된 제목 */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 pb-3">
              <CardTitle className="text-sm font-medium text-green-700">
                변환 후
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-3 bg-white border rounded-lg min-h-[60px]">
                {showDiffOnly ? (
                  <DiffContent segments={modifiedTitleParts} />
                ) : (
                  <span className="text-gray-800 font-medium">
                    {modifiedTitle}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 제목 변경사항 통합 보기 */}
        {/* {titleDiff.some((d) => d.type !== "EQUAL") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                제목 변경사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 border rounded-lg">
                <DiffContent segments={titleDiff} showDiffOnly={showDiffOnly} />
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>

      {/* 내용 비교 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          내용 변환
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 원본 내용 */}
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 pb-3">
              <CardTitle className="text-sm font-medium text-red-700">
                변환 전
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-3 bg-white border rounded-lg min-h-[200px] max-h-96 overflow-y-auto">
                {showDiffOnly ? (
                  <DiffContent segments={originalContentParts} />
                ) : (
                  <span className="text-gray-800 whitespace-pre-wrap">
                    {originalContent}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 수정된 내용 */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 pb-3">
              <CardTitle className="text-sm font-medium text-green-700">
                변환 후
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="p-3 bg-white border rounded-lg min-h-[200px] max-h-96 overflow-y-auto">
                {showDiffOnly ? (
                  <DiffContent segments={modifiedContentParts} />
                ) : (
                  <span className="text-gray-800 whitespace-pre-wrap font-medium">
                    {modifiedContent}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 내용 변경사항 통합 보기 */}
        {/* {contentDiff.some((d) => d.type !== "EQUAL") && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                내용 변경사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-50 border rounded-lg min-h-[200px] max-h-96 overflow-y-auto">
                <DiffContent
                  segments={contentDiff}
                  showDiffOnly={showDiffOnly}
                />
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </div>
  );
}

interface UnifiedViewProps {
  titleDiff: DiffSegment[];
  contentDiff: DiffSegment[];
  showDiffOnly: boolean;
}

function UnifiedView({
  titleDiff,
  contentDiff,
  showDiffOnly,
}: UnifiedViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          통합 변경사항
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-600 text-sm mb-2">
            제목 변경사항
          </h4>
          <div className="p-3 bg-gray-50 border rounded-lg">
            <DiffContent segments={titleDiff} showDiffOnly={showDiffOnly} />
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-600 text-sm mb-2">
            내용 변경사항
          </h4>
          <div className="p-3 bg-gray-50 border rounded-lg min-h-[200px] max-h-96 overflow-y-auto">
            <DiffContent segments={contentDiff} showDiffOnly={showDiffOnly} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DiffContentProps {
  segments: DiffSegment[];
  showDiffOnly?: boolean;
}

function DiffContent({ segments, showDiffOnly = false }: DiffContentProps) {
  const filteredSegments = showDiffOnly
    ? segments.filter((segment) => segment.type !== "EQUAL")
    : segments;

  return (
    <span className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
      {filteredSegments.map((segment, index) => {
        const className = DIFF_COLORS[segment.type];

        return (
          <span
            key={index}
            className={`${className} ${segment.reason ? "cursor-help" : ""} transition-colors duration-200`}
            title={segment.reason}
          >
            {segment.text}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Diff 세그먼트를 원본과 수정본으로 분리
 */
function separateDiffParts(diff: DiffSegment[]) {
  const originalParts: DiffSegment[] = [];
  const modifiedParts: DiffSegment[] = [];

  diff.forEach((segment) => {
    if (segment.type === "DELETE" || segment.type === "EQUAL") {
      originalParts.push(segment);
    }
    if (segment.type === "INSERT" || segment.type === "EQUAL") {
      modifiedParts.push(segment);
    }
  });

  return {
    originalParts,
    modifiedParts,
  };
}
