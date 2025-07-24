export interface Reaction {
  id: number;
  userId: string;
  targetId: number;
  targetType: "post" | "comment";
  emoji: string;
  createdAt: string;
}

export interface ReactionRequest {
  targetId: number;
  targetType: "post" | "comment";
  emoji: string;
}

export interface ReactionsResponse {
  reactions: Record<string, number>;
  userReaction?: string;
}

export interface ReactionStats {
  totalReactions: number;
  reactionBreakdown: Record<string, number>;
  topEmojis: Array<{
    emoji: string;
    count: number;
  }>;
}

export type ReactionTarget = "post" | "comment";

export type EmoticonType =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "EXCITED"
  | "CONFUSED"
  | "PROUD";

export type ReactionEmojiType =
  | "❤️" // happy
  | "😢" // sad
  | "😠" // angry
  | "🎉" // excited
  | "🤔" // confused
  | "👏"; // proud

// 감정 옵션 타입
export interface EmotionOption {
  label: string;
  emotionType: ReactionEmojiType;
  value: EmoticonType;
  color: string;
}

export type ReactionDetailCountMap = {
  [K in EmoticonType]: number;
};

// ✨ 방법 1: EmoticonType을 기반으로 한 Record 타입 (권장)
// export type ReactionDetailCountMap = Record<EmoticonType, number>;
