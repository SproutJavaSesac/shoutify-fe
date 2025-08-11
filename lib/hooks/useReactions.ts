import { useMutation } from "./useApi";
import {
  createCommentReaction,
  createPostReaction,
  deleteCommentReaction,
  deletePostReaction,
  updateCommentReaction,
  updatePostReaction
} from "@/apis/reactions";
import type {
  CommentReactionCreateContract,
  CommentReactionDeleteContract,
  CommentReactionResponse,
  CommentReactionUpdateContract,
  PostReactionCreateContract,
  PostReactionDeleteContract,
  PostReactionResponse,
  PostReactionUpdateContract
} from "@/types/reactions";
import { ApiOptions } from "@/types/apis";

/**
 * 게시글 반응 생성 훅
 */
export function usePostReactionCreate(
  options?: ApiOptions<PostReactionResponse>
) {
  return useMutation<PostReactionCreateContract>(createPostReaction, options);
}

/**
 * 게시글 반응 수정 훅
 */
export function usePostReactionUpdate(
  options?: ApiOptions<PostReactionResponse>
) {
  return useMutation<PostReactionUpdateContract>(updatePostReaction, options);
}

/**
 * 게시글 반응 삭제 훅
 */
export function usePostReactionDelete(
  options?: ApiOptions<PostReactionResponse>
) {
  return useMutation<PostReactionDeleteContract>(deletePostReaction, options);
}

/**
 * 댓글 반응 생성 훅
 */
export function useCommentReactionCreate(
  options?: ApiOptions<CommentReactionResponse>
) {
  return useMutation<CommentReactionCreateContract>(
    createCommentReaction,
    options
  );
}

/**
 * 댓글 반응 수정 훅
 */
export function useCommentReactionUpdate(
  options?: ApiOptions<CommentReactionResponse>
) {
  return useMutation<CommentReactionUpdateContract>(
    updateCommentReaction,
    options
  );
}

/**
 * 댓글 반응 삭제 훅
 */
export function useCommentReactionDelete(
  options?: ApiOptions<CommentReactionResponse>
) {
  return useMutation<CommentReactionDeleteContract>(
    deleteCommentReaction,
    options
  );
}
