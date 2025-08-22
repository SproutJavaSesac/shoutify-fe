"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ConversionMetadata } from "@/types/ai";
import {
  Activity,
  BookOpen,
  Clock,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";

interface ConversionDashboardProps {
  metadata: ConversionMetadata;
}

export function ConversionDashboard({ metadata }: ConversionDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🚀";
    if (score >= 80) return "⭐";
    if (score >= 70) return "👍";
    if (score >= 60) return "📈";
    return "💪";
  };

  return (
    <div className="space-y-6">
      {/* 총점 및 기본 정보 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-600" />
            <span>변환 결과 분석</span>
            <Badge variant="secondary" className="ml-auto">
              세션 {metadata.sessionId}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getScoreColor(metadata.totalScore)}`}
              >
                {metadata.totalScore}
                <span className="text-lg ml-1">
                  {getScoreEmoji(metadata.totalScore)}
                </span>
              </div>
              <p className="text-sm text-gray-600 font-medium">총점</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-700 flex items-center justify-center gap-1">
                <Clock className="h-4 w-4" />
                {metadata.processingTime}ms
              </div>
              <p className="text-sm text-gray-600">처리 시간</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">
                {metadata.wordsChanged}
              </div>
              <p className="text-sm text-gray-600">변경된 단어</p>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-700">
                <span className="text-green-600 font-semibold">
                  +{metadata.wordsAdded}
                </span>
                {" / "}
                <span className="text-red-600 font-semibold">
                  -{metadata.wordsRemoved}
                </span>
              </div>
              <p className="text-sm text-gray-600">추가/삭제</p>
            </div>
          </div>

          {/* 길이 변화 */}
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-sm font-medium text-gray-700 mb-2">
              글 길이 변화
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">
                원본:{" "}
                <span className="font-medium">{metadata.originalLength}자</span>
              </span>
              <span className="text-blue-600">→</span>
              <span className="text-blue-600">
                변환:{" "}
                <span className="font-medium">
                  {metadata.convertedLength}자
                </span>
              </span>
              <span
                className={`font-medium ${
                  metadata.convertedLength > metadata.originalLength
                    ? "text-green-600"
                    : metadata.convertedLength < metadata.originalLength
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                ({metadata.convertedLength > metadata.originalLength ? "+" : ""}
                {metadata.convertedLength - metadata.originalLength}자)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 세부 점수 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-gray-800">컨셉 적용도</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold text-purple-600">
                  {metadata.conceptScore}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
              <Progress value={metadata.conceptScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-800">글쓰기 점수</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {metadata.writingScore}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
              <Progress value={metadata.writingScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-gray-800">창의성</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold text-yellow-600">
                  {metadata.creativityScore}
                </span>
                <span className="text-sm text-gray-500">/100</span>
              </div>
              <Progress value={metadata.creativityScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {metadata.emotionScore && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-red-600" />
                <span className="font-medium text-gray-800">감정 표현</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold text-red-600">
                    {metadata.emotionScore}
                  </span>
                  <span className="text-sm text-gray-500">/100</span>
                </div>
                <Progress value={metadata.emotionScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {metadata.genreScore && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-800">장르 적합도</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {metadata.genreScore}
                  </span>
                  <span className="text-sm text-gray-500">/100</span>
                </div>
                <Progress value={metadata.genreScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 개선 사항 */}
      {metadata.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              AI가 개선한 부분들
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metadata.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{improvement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
