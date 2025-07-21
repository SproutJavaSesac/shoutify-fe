import { Pagination } from "@/types/commons";

export interface Comment {
  commentId: number;
  commenterId: number | null;
  commenterNickname: string;
  parentId: number | null;
  order: number;
  level: number;
  content: string;
  reactionCount: number;
  reactions: Record<string, number>;
  isDeleted: boolean;
  isReported: boolean;
  isMine?: boolean; // TODO isMine 추가 시 ? 제거하기
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentQueryParams {
  postId: number;
  page?: number;
  size?: number;
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
  postId: number;
  pagination: Pagination;
  comments: Comment[];
}
