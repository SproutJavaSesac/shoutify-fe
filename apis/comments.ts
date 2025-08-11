import { api } from "./client";
import {
  CommentCreateContract,
  CommentCreateRequest,
  CommentCreateResponse,
  CommentDeleteContract,
  CommentListContract,
  CommentListRequest,
  CommentListResponse,
  CommentPathParams,
  Comment,
} from "@/types/comments";
import { COMMENT_API_ENDPOINTS } from "@/constants/comments";
import { ApiPaginationArgs, MutationArgs } from "@/types/apis";

/**
 * 게시글을 댓글 목록 조회
 *
 * @param args 댓글 목록 조회 요청 객체
 */
export async function getComments({
  paths,
  queries,
}: ApiPaginationArgs<CommentListContract>): Promise<CommentListResponse> {
  return api.public.get<CommentListResponse>(
    COMMENT_API_ENDPOINTS.COMMENTS({ postId: paths!.postId }),
    queries
  );
}

/**
 * 게시글에 댓글을 작성합니다.
 *
 * @param args 댓글 작성 요청
 */
export async function createComment({
  paths,
  body,
}: MutationArgs<CommentCreateContract>): Promise<CommentCreateResponse> {
  return api.post<CommentCreateResponse>(
    COMMENT_API_ENDPOINTS.COMMENT_CREATE({ postId: paths.postId }),
    body
  );
}

/**
 * 개별 댓글을 조회합니다.
 *
 * @param paths 댓글 조회 경로 파라미터
 */
export async function getComment({
  postId,
  commentId,
}: CommentPathParams): Promise<{ data: Comment }> {
  return api.public.get<{ data: Comment }>(
    COMMENT_API_ENDPOINTS.COMMENT_DETAIL({ postId, commentId })
  );
}

/**
 * 게시글의 댓글을 삭제합니다.
 *
 * @param args 댓글 삭제 요청
 */
export async function deleteComment({
  paths,
}: MutationArgs<CommentDeleteContract>): Promise<string> {
  return api.delete<string>(
    COMMENT_API_ENDPOINTS.COMMENT_DELETE({
      postId: paths.postId,
      commentId: paths.commentId,
    })
  );
}
