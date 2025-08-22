export type ReactionActionType = "add" | "remove";

import { ApiContract, IdType } from "./apis";

export interface Reaction {
  type: ReactionLabelType; // 내가 누른 리액션
  reactionTotalCount: number;
  reactionDetails: ReactionDetailCountMap;
}

export interface PostReactionRequest {
  postId: string | number;
  body: PostReactionRequestBody;
}

interface ReactionRequestBody {
  type: ReactionLabelType;
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

// API Contract 타입들
export type PostReactionFetchContract = ApiContract<
  { postId: IdType },
  never,
  never,
  PostReactionResponse
>;

export type PostReactionCreateContract = ApiContract<
  { postId: IdType },
  never,
  { type: ReactionLabelType },
  PostReactionResponse
>;

export type PostReactionUpdateContract = ApiContract<
  { postId: IdType },
  never,
  { type: ReactionLabelType },
  PostReactionResponse
>;

export type PostReactionDeleteContract = ApiContract<
  { postId: IdType; type: ReactionLabelType },
  never,
  never,
  PostReactionResponse
>;

export type CommentReactionFetchContract = ApiContract<
  { postId: IdType; commentId: IdType },
  never,
  never,
  CommentReactionResponse
>;

export type CommentReactionCreateContract = ApiContract<
  { postId: IdType; commentId: IdType },
  never,
  { type: ReactionLabelType },
  CommentReactionResponse
>;

export type CommentReactionUpdateContract = ApiContract<
  { postId: IdType; commentId: IdType },
  never,
  { type: ReactionLabelType },
  CommentReactionResponse
>;

export type CommentReactionDeleteContract = ApiContract<
  { postId: IdType; commentId: IdType; type: ReactionLabelType },
  never,
  never,
  CommentReactionResponse
>;

export type EmoticonType =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "EXCITED"
  | "CONFUSED"
  | "PROUD";

export type ReactionLabelType =
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
  value: ReactionLabelType;
  color: string;
}

export type ReactionDetailCountMap = {
  [K in ReactionLabelType]: number;
};

export type ReactionLabelEmojiMap = {
  [K in ReactionLabelType]: ReactionEmojiType;
};
