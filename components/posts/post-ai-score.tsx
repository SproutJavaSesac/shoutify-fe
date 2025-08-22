import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SCORE_LEVELS } from "@/constants/proofreads";
import { Post } from "@/types/posts";
import { BarChart3, Heart, PenTool, Sparkles } from "lucide-react";

interface PostAiScoreProps {
  post: Post;
  className?: string;
}

export function PostAiScore({ post, className = "" }: PostAiScoreProps) {
  const { aiScore } = post;

  // AI 점수가 있는지 확인
  const hasAiScores = !!(
    aiScore?.totalScore ||
    aiScore?.conceptScore ||
    aiScore?.writingScore ||
    aiScore?.creativityScore ||
    aiScore?.emotionScore ||
    aiScore?.genreScore
  );

  const getScoreLevel = (score: number) => {
    const levels = Object.values(SCORE_LEVELS);
    return levels.find((level) => score >= level.min) || SCORE_LEVELS.BAD;
  };

  const totalScoreLevel = aiScore?.totalScore
    ? getScoreLevel(aiScore.totalScore)
    : SCORE_LEVELS.GOOD;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-purple-600" />
          AI 분석 점수
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          {/* 점수가 없을 때의 준비중 오버레이 */}
          {!hasAiScores && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  🚀 준비중
                </div>
                <div className="text-xs text-gray-500">
                  AI 분석 기능을 준비하고 있어요
                </div>
              </div>
            </div>
          )}

          {/* 전체 점수 */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                종합 점수
              </span>
              {hasAiScores ? (
                aiScore?.totalScore !== undefined ? (
                  <Badge variant="secondary" className="text-sm">
                    {aiScore.totalScore}점
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-sm text-gray-400">
                    -
                  </Badge>
                )
              ) : (
                <Badge variant="outline" className="text-sm opacity-50">
                  85점
                </Badge>
              )}
            </div>
            <Progress
              value={hasAiScores ? aiScore?.totalScore || 0 : 85}
              className={`w-full h-2 ${!hasAiScores ? "opacity-50" : ""}`}
            />
            {hasAiScores && aiScore?.totalScore && (
              <p className={`text-xs mt-1 ${totalScoreLevel.color}`}>
                {totalScoreLevel.label}
              </p>
            )}
          </div>

          {/* 세부 점수들 - 컴팩트 버전 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <ScoreItem
              label="컨셉"
              score={aiScore?.conceptScore}
              icon={<PenTool className="h-3 w-3" />}
              isAvailable={hasAiScores}
              exampleScore={88}
            />
            <ScoreItem
              label="글쓰기"
              score={aiScore?.writingScore}
              icon={<BarChart3 className="h-3 w-3" />}
              isAvailable={hasAiScores}
              exampleScore={92}
            />
            <ScoreItem
              label="창의성"
              score={aiScore?.creativityScore}
              icon={<Sparkles className="h-3 w-3" />}
              isAvailable={hasAiScores}
              exampleScore={76}
            />
            {(aiScore?.emotionScore || !hasAiScores) && (
              <ScoreItem
                label="감정"
                score={aiScore?.emotionScore}
                icon={<Heart className="h-3 w-3" />}
                isAvailable={hasAiScores}
                exampleScore={81}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ScoreItemProps {
  label: string;
  score?: number;
  icon: React.ReactNode;
  isAvailable: boolean;
  exampleScore: number;
}

function ScoreItem({
  label,
  score,
  icon,
  isAvailable,
  exampleScore,
}: ScoreItemProps) {
  const displayScore = isAvailable ? score || 0 : exampleScore;

  return (
    <div
      className={`flex items-center gap-1 ${!isAvailable ? "opacity-50" : ""}`}
    >
      <div className="text-gray-500">{icon}</div>
      <span className="text-gray-600 text-xs">{label}</span>
      <span className="ml-auto font-medium">
        {isAvailable ? (score !== undefined ? `${score}` : "-") : exampleScore}
      </span>
    </div>
  );
}
