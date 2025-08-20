// API 엔드포인트 - 함수 기반 (타입 안전성 + 재사용성)
import { CommentPathParams } from "@/types/comments";

export const COMMENT_API_ENDPOINTS = {
  COMMENTS: ({ postId }: { postId: string | number }) =>
    `/posts/${postId}/comments`,
  COMMENT_CREATE: ({ postId }: { postId: string | number }) =>
    `/posts/${postId}/comments`,
  COMMENT_DETAIL_FOR_ADMIN: (params: CommentPathParams) =>
    `/admin/posts/${params.postId}/comments/${params.commentId}`,
  COMMENT_DELETE: (params: CommentPathParams) =>
    `/posts/${params.postId}/comments/${params.commentId}`,
} as const;

// 댓글 관련 프론트 url 경로
export const COMMENT_ROUTES = {
  SECTION: (postId: string | number) => `/posts/${postId}#comments`,
} as const;
