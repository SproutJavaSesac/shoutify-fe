"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DiffChange } from "@/types/ai";
import { Eye, EyeOff, FileText, Sparkles } from "lucide-react";
import { useState } from "react";

interface DiffViewerProps {
  changes: DiffChange[];
  className?: string;
  showTooltips?: boolean;
}

export function DiffViewer({
  changes,
  className,
  showTooltips = true,
}: DiffViewerProps) {
  if (!changes || changes.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>변경사항이 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "font-mono text-sm leading-relaxed whitespace-pre-wrap",
        className
      )}
    >
      {changes.map((change, index) => (
        <span
          key={index}
          className={cn("transition-all duration-200 relative group", {
            // 동일한 텍스트 (변경 없음)
            "text-gray-800": change.type === "EQUAL",
            // 삭제된 텍스트 (빨간색 배경)
            "bg-red-100 text-red-800 line-through decoration-red-500 decoration-2 px-1 rounded":
              change.type === "DELETE",
            // 추가된 텍스트 (초록색 배경)
            "bg-green-100 text-green-800 font-medium px-1 rounded border border-green-300":
              change.type === "INSERT",
          })}
          title={
            showTooltips
              ? change.reason ||
                (change.type === "DELETE"
                  ? "삭제된 내용"
                  : change.type === "INSERT"
                    ? "추가된 내용"
                    : undefined)
              : undefined
          }
        >
          {change.text}
          {/* 호버 시 툴팁 */}
          {showTooltips && change.reason && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-xs whitespace-normal">
              <div className="font-sans font-normal">{change.reason}</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </span>
      ))}
    </div>
  );
}

interface ComprehensiveDiffViewProps {
  originalTitle: string;
  transformedTitle: string;
  originalContent: string;
  transformedContent: string;
  titleDiff: DiffChange[];
  contentDiff: DiffChange[];
  sessionId: string;
  onToggleView?: () => void;
  showComparison?: boolean;
}

export function ComprehensiveDiffView({
  originalTitle,
  transformedTitle,
  originalContent,
  transformedContent,
  titleDiff,
  contentDiff,
  sessionId,
  onToggleView,
  showComparison = false,
}: ComprehensiveDiffViewProps) {
  const [activeTab, setActiveTab] = useState<"title" | "content">("title");

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        {onToggleView && (
          <Button
            onClick={onToggleView}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {showComparison ? (
              <>
                <EyeOff className="w-4 h-4" />
                단일 뷰로 보기
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                원본과 나란히 비교하기
              </>
            )}
          </Button>
        )}
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>세션 ID:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
            {sessionId}
          </code>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("title")}
            className={cn(
              "pb-2 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "title"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            제목 변환
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={cn(
              "pb-2 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "content"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            내용 변환
          </button>
        </div>
      </div>

      {/* 제목 변환 탭 */}
      {activeTab === "title" && (
        <div className="space-y-4">
          {showComparison ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    변환 전
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg border text-gray-800 font-medium">
                    {originalTitle}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    변환 후
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 font-medium">
                    {transformedTitle}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {titleDiff.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-4 h-4 bg-gradient-to-r from-red-400 to-green-400 rounded"></span>
                  변경사항 하이라이트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white rounded-lg border">
                  <DiffViewer changes={titleDiff} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 내용 변환 탭 */}
      {activeTab === "content" && (
        <div className="space-y-4">
          {showComparison ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    변환 전
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 rounded-lg border max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-gray-800 text-sm">
                      {originalContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    변환 후
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 max-h-80 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-blue-900 text-sm font-medium">
                      {transformedContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {contentDiff.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-4 h-4 bg-gradient-to-r from-red-400 to-green-400 rounded"></span>
                  변경사항 하이라이트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-white rounded-lg border max-h-80 overflow-y-auto">
                  <DiffViewer changes={contentDiff} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 범례 */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-800">
              🎨 변경사항 색상 가이드
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 border border-green-400">
                추가됨
              </Badge>
              <span className="text-gray-600">새로 추가된 단어나 문구</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800 border border-red-400 line-through">
                삭제됨
              </Badge>
              <span className="text-gray-600">원본에서 제거된 내용</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-800 border border-gray-300">
                변경 없음
              </Badge>
              <span className="text-gray-600">그대로 유지된 부분</span>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-500 bg-white p-3 rounded-lg border">
            💡 <strong>사용 팁:</strong> 하이라이트된 부분에 마우스를 올리면
            변경 이유를 상세히 볼 수 있습니다.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
