import { REACTION_API_ENDPOINTS } from "@/constants/reactions";
import type { IdType, MutationArgs } from "@/types/apis";
import type {
  CommentReactionCreateContract,
  CommentReactionDeleteContract,
  CommentReactionResponse,
  CommentReactionUpdateContract,
  PostReactionCreateContract,
  PostReactionDeleteContract,
  PostReactionResponse,
  PostReactionUpdateContract,
} from "@/types/reactions";
import { api } from "./client";

/**
 * 게시글의 반응을 조회합니다.
 */
export async function fetchPostReaction({
  postId,
}: {
  postId: IdType;
}): Promise<PostReactionResponse> {
  try {
    return await api.get<PostReactionResponse>(
      REACTION_API_ENDPOINTS.POST_REACTION({ postId })
    );
  } catch (error) {
    console.warn("게시글 반응 조회 실패:", error);
    throw error;
  }
}

/**
 * 게시글에 반응을 추가합니다.
 */
export async function createPostReaction(
  args: MutationArgs<PostReactionCreateContract>
): Promise<PostReactionResponse> {
  return api.post<PostReactionResponse>(
    REACTION_API_ENDPOINTS.POST_REACTION({ postId: args.paths.postId }),
    args.body
  );
}

/**
 * 게시글의 반응을 수정합니다.
 */
export async function updatePostReaction(
  args: MutationArgs<PostReactionUpdateContract>
): Promise<PostReactionResponse> {
  return api.patch<PostReactionResponse>(
    REACTION_API_ENDPOINTS.POST_REACTION({ postId: args.paths.postId }),
    args.body
  );
}

/**
 * 게시글의 반응을 삭제합니다.
 */
export async function deletePostReaction(
  args: MutationArgs<PostReactionDeleteContract>
): Promise<PostReactionResponse> {
  return api.delete<PostReactionResponse>(
    REACTION_API_ENDPOINTS.POST_REACTION({ postId: args.paths.postId })
  );
}

/**
 * 댓글의 반응을 조회합니다.
 * @param args
 * @returns
 */
export async function fetchCommentReaction({
  postId,
  commentId,
}: {
  postId: IdType;
  commentId: IdType;
}): Promise<CommentReactionResponse> {
  try {
    return await api.get<CommentReactionResponse>(
      REACTION_API_ENDPOINTS.COMMENT_REACTION({ postId, commentId })
    );
  } catch (error) {
    console.warn("댓글 반응 조회 실패:", error);
    throw error;
  }
}

/**
 * 댓글의 반응을 추가합니다.
 */
export async function createCommentReaction(
  args: MutationArgs<CommentReactionCreateContract>
): Promise<CommentReactionResponse> {
  return api.post<CommentReactionResponse>(
    REACTION_API_ENDPOINTS.COMMENT_REACTION({
      postId: args.paths.postId,
      commentId: args.paths.commentId,
    }),
    args.body
  );
}

/**
 * 댓글의 반응을 수정합니다.
 */
export async function updateCommentReaction(
  args: MutationArgs<CommentReactionUpdateContract>
): Promise<CommentReactionResponse> {
  return api.patch<CommentReactionResponse>(
    REACTION_API_ENDPOINTS.COMMENT_REACTION({
      postId: args.paths.postId,
      commentId: args.paths.commentId,
    }),
    args.body
  );
}

/**
 * 댓글의 반응을 삭제합니다.
 */
export async function deleteCommentReaction(
  args: MutationArgs<CommentReactionDeleteContract>
): Promise<CommentReactionResponse> {
  return api.delete<CommentReactionResponse>(
    REACTION_API_ENDPOINTS.COMMENT_REACTION({
      postId: args.paths.postId,
      commentId: args.paths.commentId,
    })
  );
}
