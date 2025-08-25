import {
  ApiContract,
  CommentsPaginationResponse,
  Pagination,
  PaginationParams,
} from "@/types/apis";
import { ReactionDetailCountMap } from "./reactions";

export type CommentSortType = "createdAt" | "reactions" | "comments";

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

// 마이페이지 댓글 목록에서 사용할 댓글 타입
export interface MyComment {
  commentId: string | number;
  postId: string | number;
  postTitle: string;
  beforeContent?: string; // AI 첨삭 이전 내용
  afterContent: string; // AI 첨삭 후 내용
  reactionCount: number;
  createdAt: string;
  isDeleted?: boolean;
  isMine?: boolean;
}

export interface CommentListRequest {
  postId: string | number;
  paginationParams: PaginationParams;
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

export interface CommentFetchResponse {
  postId: string | number;
  comment: Comment;
}

export interface CommentCreateResponseBody {
  content: string;
  parentId?: string | number | null;
}

export type CommentCreateResponse = Comment;

// ===== API Contract 정의 =====

/** 댓글 목록 조회 API 계약 */
export type CommentListContract = ApiContract<
  { postId: string | number },
  PaginationParams,
  never,
  CommentsPaginationResponse<Comment>
>;

/** 댓글 작성 API 계약 */
export type CommentCreateContract = ApiContract<
  CommentPathParams,
  never,
  CommentCreateResponseBody,
  CommentCreateResponse
>;

/** 댓글 삭제 API 계약 */
export type CommentDeleteContract = ApiContract<
  CommentPathParams,
  never,
  never,
  string
>;
