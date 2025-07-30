export type ReactionActionType = "add" | "remove";

export interface Reaction {
  status: ReactionActionType;
  reaction: EmoticonType;
  reactionCount: number;
  reactionDetails: ReactionDetailCountMap;
}

export interface PostReactionRequest {
  postId: string | number;
  body: PostReactionRequestBody;
}

interface ReactionRequestBody {
  emotion: EmoticonType;
  action: ReactionActionType;
}

export interface PostReactionRequestBody extends ReactionRequestBody {}

export interface CommentReactionRequest {
  postId: string | number;
  commentId: string | number;
  body: CommentReactionRequestBody;
}

export interface CommentReactionRequestBody extends ReactionRequestBody {}

interface ReactionResponse extends Reaction {}

export interface PostReactionResponse extends ReactionResponse {}

export interface CommentReactionResponse extends ReactionResponse {}

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
