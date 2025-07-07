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
export type ReactionEmoji = "❤️" | "😊" | "😢" | "🤔" | "👏";
