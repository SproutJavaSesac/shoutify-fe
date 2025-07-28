import { api } from "./client";
import { REACTION_API_ENDPOINTS } from "@/constants/reactions";
import {
  CommentReactionRequest,
  CommentReactionResponse,
  PostReactionRequest,
  PostReactionResponse,
} from "@/types/reactions";

/**
 * 게시글에 반응을 추가/수정/삭제합니다.
 *
 * @param postId 게시글 ID
 * @param body 반응 요청 본문
 */
export async function doPostReaction({
  postId,
  body,
}: PostReactionRequest): Promise<PostReactionResponse> {
  return api.post<PostReactionResponse>(
    REACTION_API_ENDPOINTS.POST_REACTION({ postId }),
    { body },
  );
}

/**
 * 댓글의 반응을 추가/수정/삭제합니다.
 *
 * @param postId 게시글 ID
 * @param commentId 댓글 ID
 * @param body 반응 요청 본문
 */
export async function doCommentReaction({
  postId,
  commentId,
  body,
}: CommentReactionRequest): Promise<CommentReactionResponse> {
  return api.post<CommentReactionResponse>(
    REACTION_API_ENDPOINTS.COMMENT_REACTION({ postId, commentId }),
    body,
  );
}
