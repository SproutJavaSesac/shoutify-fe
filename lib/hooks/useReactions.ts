import {
  createCommentReaction,
  createPostReaction,
  deleteCommentReaction,
  deletePostReaction,
  fetchCommentReaction,
  fetchPostReaction,
  updateCommentReaction,
  updatePostReaction,
} from "@/apis/reactions";
import { ApiOptions, IdType } from "@/types/apis";
import type {
  CommentReactionCreateContract,
  CommentReactionDeleteContract,
  CommentReactionFetchContract,
  CommentReactionResponse,
  CommentReactionUpdateContract,
  PostReactionCreateContract,
  PostReactionDeleteContract,
  PostReactionFetchContract,
  PostReactionResponse,
  PostReactionUpdateContract,
} from "@/types/reactions";
import { useCallback } from "react";
import { useApi, useMutation } from "./useApi";

/**
 * 게시글 반응 조회 훅
 */
export function usePostReactionFetchEffect(postId: IdType) {
  const apiCall = useCallback(
    async () => {
      return await fetchPostReaction({ postId });
    },
    [postId] // postId가 변경될 때마다 새로운 함수 생성
  );

  return useApi<PostReactionFetchContract>(apiCall, {
    immediate: true,
  });
}

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
 * 댓글 반응 조회 훅
 */
export function useCommentReactionFetchEffect({
  postId,
  commentId,
}: {
  postId: IdType;
  commentId: IdType;
}) {
  const apiCall = useCallback(
    async () => {
      return await fetchCommentReaction({ postId, commentId });
    },
    [postId, commentId] // postId 또는 commentId가 변경될 때마다 새로운 함수 생성
  );

  return useApi<CommentReactionFetchContract>(apiCall, {
    immediate: true,
  });
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
