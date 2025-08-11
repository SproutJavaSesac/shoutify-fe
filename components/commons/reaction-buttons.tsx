"use client";

import { Button } from "@/components/ui/button";
import { EMOTION_TO_EMOJI_MAP } from "@/constants/reactions";
import { ReactionLabelType, ReactionDetailCountMap } from "@/types/reactions";

interface ReactionButtonsProps {
  // 현재 반응 상태
  reactions: ReactionDetailCountMap;
  // 현재 사용자의 선택된 반응
  myReaction?: ReactionLabelType | null;
  // 반응 클릭 핸들러
  onReactionClick: (reactionType: ReactionLabelType) => void;
  // 로그인 여부
  isAuthenticated: boolean;
  // 스타일 옵션
  size?: "sm" | "default" | "lg";
  className?: string;
  // 모든 반응을 항상 표시할지, 아니면 카운트가 있는 것만 표시할지
  showAllReactions?: boolean;
  // 새로운 반응을 추가할 수 있는지 (댓글용)
  enableNewReactions?: boolean;
}

export function ReactionButtons({
  reactions,
  myReaction = null,
  onReactionClick,
  isAuthenticated,
  size = "sm",
  className = "",
  showAllReactions = true,
  enableNewReactions = false,
}: Readonly<ReactionButtonsProps>) {
  // 안전한 반응 데이터 생성 - API에서 누락된 반응들을 0으로 채움
  const safeReactions: ReactionDetailCountMap = {
    HAPPY: reactions.HAPPY || 0,
    SAD: reactions.SAD || 0,
    ANGRY: reactions.ANGRY || 0,
    EXCITED: reactions.EXCITED || 0,
    CONFUSED: reactions.CONFUSED || 0,
    PROUD: reactions.PROUD || 0,
  };

  // 표시할 반응 목록 계산
  const getReactionsToShow = () => {
    if (showAllReactions) {
      // 모든 반응을 순서대로 표시 (게시글용)
      return Object.keys(EMOTION_TO_EMOJI_MAP) as ReactionLabelType[];
    }

    // 댓글용: 카운트가 있거나 사용자가 선택한 반응만 표시하되,
    // EMOTION_TO_EMOJI_MAP의 순서를 유지
    const reactionsWithCountOrSelected = (
      Object.keys(EMOTION_TO_EMOJI_MAP) as ReactionLabelType[]
    ).filter(
      (reactionType) =>
        safeReactions[reactionType] > 0 || myReaction === reactionType
    );

    return reactionsWithCountOrSelected;
  };

  const reactionsToShow = getReactionsToShow();

  const getButtonSize = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6 p-0 text-xs";
      case "lg":
        return "h-10 w-10 p-0 text-lg";
      default:
        return "h-8 w-8 p-0";
    }
  };

  const getCountTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        {reactionsToShow.map((reactionType) => {
          const count = safeReactions[reactionType];
          const isSelected = myReaction === reactionType;
          const emoji = EMOTION_TO_EMOJI_MAP[reactionType];

          return (
            <div key={reactionType} className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`${getButtonSize()} ${
                  isSelected ? "bg-blue-100 ring-1 ring-blue-300" : ""
                } hover:bg-gray-100`}
                onClick={() => onReactionClick(reactionType)}
                disabled={!isAuthenticated}
              >
                {emoji}
              </Button>
              <span className={`${getCountTextSize()} text-gray-500 ml-1`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* 새로운 반응들 (댓글용 - 아직 선택되지 않은 반응들을 반투명하게 표시) */}
      {enableNewReactions && isAuthenticated && (
        <div className="flex items-center space-x-1">
          {(Object.keys(EMOTION_TO_EMOJI_MAP) as ReactionLabelType[])
            .filter(
              (reactionType) =>
                // 이미 표시된 반응은 제외
                !reactionsToShow.includes(reactionType)
            )
            .map((reactionType) => {
              const emoji = EMOTION_TO_EMOJI_MAP[reactionType];

              return (
                <Button
                  key={`new-${reactionType}`}
                  variant="ghost"
                  size="sm"
                  className={`${getButtonSize()} opacity-50 hover:opacity-100 hover:bg-gray-100`}
                  onClick={() => onReactionClick(reactionType)}
                >
                  {emoji}
                </Button>
              );
            })}
        </div>
      )}
    </div>
  );
}
