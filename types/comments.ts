import { Pagination } from "@/types/apis";
import { ReactionDetailCountMap } from "./reactions";

// comment url 경로 파람 타입
export type CommentPathParams = {
  postId: string | number;
  commentId: string | number;
};

export interface Comment {
  commentId: string | number;
  commenterId: string | number | null;
  commenterNickname: string;
  parentId: string | number | null;
  order: number;
  level: number;
  content: string;
  reactionCount: number;
  reactions: ReactionDetailCountMap;
  isDeleted: boolean;
  isReported: boolean;
  isMine?: boolean; // TODO isMine 추가 시 ? 제거하기
  createdAt: string;
  updatedAt: string;
}

export interface CommentListRequest {
  postId: string | number;
  queryParams: CommentQueryParams;
}

export interface CommentQueryParams {
  page?: number;
  size?: number;
}

export interface CommentListResponse {
  postId: string | number;
  pagination: Pagination;
  comments: Comment[];
}

export interface CommentCreateRequest {
  postId: string | number;
  body: CommentCreateResponseBody;
}

export interface CommentCreateResponseBody {
  content: string;
  parentId?: string | number | null;
}

export type CommentCreateResponse = Comment;
