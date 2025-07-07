export interface Comment {
  id: number;
  postId: number;
  author: string;
  authorId?: string;
  time: string;
  content: string;
  reactions: Record<string, number>;
  replies?: Comment[];
  parentId?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentId?: number;
}

export interface UpdateCommentRequest {
  id: number;
  content: string;
}

export interface CommentReactionRequest {
  commentId: number;
  emoji: string;
}

export interface CommentsResponse {
  comments: Comment[];
  totalCount: number;
}

export type ReactionEmoji = "❤️" | "😊" | "😢" | "🤔" | "👏";
