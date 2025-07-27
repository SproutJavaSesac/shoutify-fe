import { api } from "./client";
import {
  CommentCreateRequest,
  CommentCreateResponse,
  CommentListRequest,
  CommentListResponse,
  CommentPathParams,
} from "@/types/comments";
import { COMMENT_API_ENDPOINTS } from "@/constants/comments";

/**
 * 게시글을 댓글 목록 조회
 *
 * @param request 댓글 목록 조회 요청 객체
 */
export async function getComments({
  postId,
  queryParams,
}: CommentListRequest): Promise<CommentListResponse> {
  return api.public.get<CommentListResponse>(
    COMMENT_API_ENDPOINTS.COMMENTS({ postId }),
    queryParams,
  );
}

/**
 * 게시글에 댓글을 작성합니다.
 *
 * @param postId 게시글 ID
 * @param body 댓글 작성 요청 본문
 */
export async function createComment({
  postId,
  body,
}: CommentCreateRequest): Promise<CommentCreateResponse> {
  return api.post<CommentCreateResponse>(
    COMMENT_API_ENDPOINTS.COMMENT_CREATE({ postId }),
    body,
  );
}

/**
 * 게시글의 댓글을 삭제합니다.
 *
 * @param postId 게시글 ID
 * @param commentId 댓글 ID
 */
export async function deleteComment({
  postId,
  commentId,
}: CommentPathParams): Promise<string> {
  return api.delete<string>(
    COMMENT_API_ENDPOINTS.COMMENT_DELETE({ postId, commentId }),
  );
}
