import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SCORE_LEVELS } from "@/constants/proofreads";
import { ProofreadMetadata } from "@/types/proofreads";
import { BarChart3, Heart, Palette, PenTool, Sparkles } from "lucide-react";

interface ProofreadDashboardProps {
  metadata: ProofreadMetadata;
}

export function ProofreadDashboard({ metadata }: ProofreadDashboardProps) {
  const getScoreLevel = (score: number) => {
    const levels = Object.values(SCORE_LEVELS);
    return levels.find((level) => score >= level.min) || SCORE_LEVELS.BAD;
  };

  // AI 점수가 있는지 확인
  const hasAiScores = !!(
    metadata.totalScore ||
    metadata.conceptScore ||
    metadata.writingScore ||
    metadata.creativityScore ||
    metadata.emotionScore ||
    metadata.genreScore
  );

  const totalScoreLevel = metadata.totalScore
    ? getScoreLevel(metadata.totalScore)
    : SCORE_LEVELS.GOOD;

  return (
    <div className="space-y-6">
      {/* 변환 결과 분석 - 통합 카드 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            변환 결과 분석
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI 점수 섹션 */}
          <div className="relative">
            {/* 점수가 없을 때의 준비중 오버레이 - 우선 시연 위해서 보여줌. */}
            {/* {!hasAiScores && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-600 mb-1">
                    🚀 준비중
                  </div>
                  <div className="text-sm text-gray-500">
                    AI 분석 기능을 준비하고 있어요
                  </div>
                </div>
              </div>
            )} */}

            {/* 전체 점수 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  AI 종합 점수
                </h3>
                {hasAiScores ? (
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {metadata.totalScore}점
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-base px-3 py-1 opacity-50"
                  >
                    85점
                  </Badge>
                )}
              </div>
              <Progress
                value={hasAiScores ? metadata.totalScore : 85}
                className={`w-full h-3 ${!hasAiScores ? "opacity-50" : ""}`}
              />
              {hasAiScores && metadata.totalScore && (
                <p
                  className={`text-sm font-medium mt-1 ${totalScoreLevel.color}`}
                >
                  {totalScoreLevel.label}
                </p>
              )}
            </div>

            {/* 세부 점수들 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              <ScoreCard
                title="컨셉 적합도"
                score={metadata.conceptScore}
                icon={<PenTool className="h-4 w-4 text-purple-600" />}
                description="선택한 컨셉에 얼마나 잘 맞는지"
                isAvailable={hasAiScores}
                exampleScore={88}
              />

              <ScoreCard
                title="글쓰기 품질"
                score={metadata.writingScore}
                icon={<BarChart3 className="h-4 w-4 text-blue-600" />}
                description="문법, 어휘, 문체의 완성도"
                isAvailable={hasAiScores}
                exampleScore={92}
              />

              <ScoreCard
                title="창의성"
                score={metadata.creativityScore}
                icon={<Sparkles className="h-4 w-4 text-yellow-600" />}
                description="독창적이고 흥미로운 표현"
                isAvailable={hasAiScores}
                exampleScore={76}
              />

              {(metadata.emotionScore || !hasAiScores) && (
                <ScoreCard
                  title="감정 표현"
                  score={metadata.emotionScore}
                  icon={<Heart className="h-4 w-4 text-red-600" />}
                  description="감정이 얼마나 잘 드러나는지"
                  isAvailable={hasAiScores}
                  exampleScore={81}
                />
              )}

              {(metadata.genreScore || !hasAiScores) && (
                <ScoreCard
                  title="장르 적합성"
                  score={metadata.genreScore}
                  icon={<Palette className="h-4 w-4 text-green-600" />}
                  description="선택한 장르에 적합한 스타일"
                  isAvailable={hasAiScores}
                  exampleScore={79}
                />
              )}
            </div>
          </div>

          {/* 변경 통계 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              변경 통계
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatItem
                label="전체 글자 수"
                original={metadata.originalLength}
                changed={metadata.convertedLength}
              />
              <StatItem
                label="변경된 단어"
                value={metadata.wordsChanged}
                color="text-blue-600"
              />
              <StatItem
                label="추가된 단어"
                value={metadata.wordsAdded}
                color="text-green-600"
              />
              <StatItem
                label="삭제된 단어"
                value={metadata.wordsRemoved}
                color="text-red-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 개선사항 */}
      {/* {metadata.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              주요 개선사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {metadata.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}

interface ScoreCardProps {
  title: string;
  score?: number;
  icon: React.ReactNode;
  description: string;
  isAvailable: boolean;
  exampleScore: number;
}

function ScoreCard({
  title,
  score,
  icon,
  description,
  isAvailable,
  exampleScore,
}: ScoreCardProps) {
  const displayScore = isAvailable ? score || 0 : exampleScore;
  const scoreLevel =
    Object.values(SCORE_LEVELS).find((level) => displayScore >= level.min) ||
    SCORE_LEVELS.BAD;

  return (
    <Card className={`${!isAvailable ? "opacity-50" : ""}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
          </div>
          {isAvailable ? (
            score !== undefined ? (
              <Badge
                variant="outline"
                className={`${scoreLevel.color} text-xs`}
              >
                {score}점
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-gray-400">
                -
              </Badge>
            )
          ) : (
            <Badge variant="outline" className="text-xs opacity-50">
              {exampleScore}점
            </Badge>
          )}
        </div>
        <Progress value={displayScore} className="h-1.5 mb-2" />
        <p className="text-xs text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
  label: string;
  value?: number;
  original?: number;
  changed?: number;
  color?: string;
}

function StatItem({
  label,
  value,
  original,
  changed,
  color = "text-gray-700",
}: StatItemProps) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>
        {value !== undefined ? value : `${original} → ${changed}`}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
      {original !== undefined && changed !== undefined && (
        <div
          className={`text-xs ${changed > original ? "text-green-600" : changed < original ? "text-red-600" : "text-gray-500"}`}
        >
          {changed > original ? "+" : ""}
          {changed - original}
        </div>
      )}
    </div>
  );
}
