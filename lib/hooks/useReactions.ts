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
  ReactionDetailCountMap,
  ReactionLabelType,
} from "@/types/reactions";
import { useCallback, useState } from "react";
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

// 통합된 낙관적 업데이트를 위한 유틸리티 함수들
export function optimisticUpdateReactions(
  currentReactions: ReactionDetailCountMap,
  currentMyReaction: ReactionLabelType | null,
  newReactionType: ReactionLabelType | null
): {
  reactions: ReactionDetailCountMap;
  myReaction: ReactionLabelType | null;
} {
  const updatedReactions = { ...currentReactions };

  // 이전 반응 제거
  if (currentMyReaction) {
    updatedReactions[currentMyReaction] = Math.max(
      0,
      updatedReactions[currentMyReaction] - 1
    );
  }

  // 새 반응 추가
  if (newReactionType) {
    updatedReactions[newReactionType] =
      (updatedReactions[newReactionType] || 0) + 1;
  }

  return {
    reactions: updatedReactions,
    myReaction: newReactionType,
  };
}

/**
 * 게시글 반응 관리 훅 (POST → GET / PUT → GET / DELETE → GET 패턴)
 */
export function usePostReactionManager(postId: IdType) {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createReactionMutation } = useMutation(createPostReaction);
  const { mutate: updateReactionMutation } = useMutation(updatePostReaction);
  const { mutate: deleteReactionMutation } = useMutation(deletePostReaction);

  const handleReaction = useCallback(
    async (
      reactionType: ReactionLabelType,
      currentMyReaction: ReactionLabelType | null,
      onUpdate: (
        reactions: ReactionDetailCountMap,
        myReaction: ReactionLabelType | null
      ) => void,
      onError: (error: string) => void,
      onSuccess?: () => void
    ) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        // 액션 결정
        let action: "create" | "update" | "delete";

        if (!currentMyReaction) {
          // 첫 반응 → POST (생성)
          action = "create";
        } else if (currentMyReaction === reactionType) {
          // 같은 반응 클릭 → DELETE (삭제)
          action = "delete";
        } else {
          // 다른 반응으로 변경 → PUT (수정)
          action = "update";
        }

        // CUD 작업 수행
        switch (action) {
          case "create":
            await new Promise((resolve, reject) => {
              createReactionMutation(
                {
                  paths: { postId },
                  body: { type: reactionType },
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
            break;
          case "update":
            await new Promise((resolve, reject) => {
              updateReactionMutation(
                {
                  paths: { postId },
                  body: { type: reactionType },
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
            break;
          case "delete":
            await new Promise((resolve, reject) => {
              deleteReactionMutation(
                {
                  paths: { postId },
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
            break;
        }

        // CUD 작업 성공 후 최신 데이터를 GET으로 가져오기
        const latestReactionData = await fetchPostReaction({ postId });

        // 최신 서버 데이터로 UI 업데이트
        onUpdate(
          latestReactionData.reactionDetails,
          latestReactionData.reaction
        );
        onSuccess?.();
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : "반응 처리 중 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      postId,
      createReactionMutation,
      updateReactionMutation,
      deleteReactionMutation,
      isLoading,
    ]
  );

  // DELETE 전용 핸들러 (필요시 사용)
  const handleDeleteReaction = useCallback(
    async (
      onUpdate: (
        reactions: ReactionDetailCountMap,
        myReaction: ReactionLabelType | null
      ) => void,
      onError: (error: string) => void,
      onSuccess?: () => void
    ) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        await new Promise((resolve, reject) => {
          deleteReactionMutation(
            {
              paths: { postId },
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        // DELETE 작업 성공 후 최신 데이터를 GET으로 가져오기
        const latestReactionData = await fetchPostReaction({ postId });

        // 최신 서버 데이터로 UI 업데이트
        onUpdate(
          latestReactionData.reactionDetails,
          latestReactionData.reaction
        );
        onSuccess?.();
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : "반응 삭제 중 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [postId, deleteReactionMutation, isLoading]
  );

  return {
    handleReaction,
    handleDeleteReaction,
    isLoading,
  };
}

/**
 * 댓글 반응 관리 훅 (POST → GET / PUT → GET / DELETE → GET 패턴)
 */
export function useCommentReactionManager(postId: IdType, commentId: IdType) {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createReactionMutation } = useMutation(createCommentReaction);
  const { mutate: updateReactionMutation } = useMutation(updateCommentReaction);
  const { mutate: deleteReactionMutation } = useMutation(deleteCommentReaction);

  const handleReaction = useCallback(
    async (
      reactionType: ReactionLabelType,
      currentMyReaction: ReactionLabelType | null,
      onUpdate: (
        reactions: ReactionDetailCountMap,
        myReaction: ReactionLabelType | null
      ) => void,
      onError: (error: string) => void,
      onSuccess?: () => void
    ) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        // 액션 결정
        let action: "create" | "update" | "delete";

        if (!currentMyReaction) {
          // 첫 반응 → POST (생성)
          action = "create";
        } else if (currentMyReaction === reactionType) {
          // 같은 반응 클릭 → DELETE (삭제)
          action = "delete";
        } else {
          // 다른 반응으로 변경 → PUT (수정)
          action = "update";
        }

        // CUD 작업 수행
        switch (action) {
          case "create":
            await new Promise((resolve, reject) => {
              createReactionMutation(
                {
                  paths: { postId, commentId },
                  body: { type: reactionType },
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
            break;
          case "update":
            await new Promise((resolve, reject) => {
              updateReactionMutation(
                {
                  paths: { postId, commentId },
                  body: { type: reactionType },
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
            break;
          case "delete":
            await new Promise((resolve, reject) => {
              deleteReactionMutation(
                {
                  paths: { postId, commentId },
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
            break;
        }

        // CUD 작업 성공 후 최신 데이터를 GET으로 가져오기
        const latestReactionData = await fetchCommentReaction({
          postId,
          commentId,
        });

        // 최신 서버 데이터로 UI 업데이트
        onUpdate(
          latestReactionData.reactionDetails,
          latestReactionData.reaction
        );
        onSuccess?.();
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : "반응 처리 중 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      postId,
      commentId,
      createReactionMutation,
      updateReactionMutation,
      deleteReactionMutation,
      isLoading,
    ]
  );

  // DELETE 전용 핸들러 (필요시 사용)
  const handleDeleteReaction = useCallback(
    async (
      onUpdate: (
        reactions: ReactionDetailCountMap,
        myReaction: ReactionLabelType | null
      ) => void,
      onError: (error: string) => void,
      onSuccess?: () => void
    ) => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        await new Promise((resolve, reject) => {
          deleteReactionMutation(
            {
              paths: { postId, commentId },
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        // DELETE 작업 성공 후 최신 데이터를 GET으로 가져오기
        const latestReactionData = await fetchCommentReaction({
          postId,
          commentId,
        });

        // 최신 서버 데이터로 UI 업데이트
        onUpdate(
          latestReactionData.reactionDetails,
          latestReactionData.reaction
        );
        onSuccess?.();
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : "반응 삭제 중 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [postId, commentId, deleteReactionMutation, isLoading]
  );

  return {
    handleReaction,
    handleDeleteReaction,
    isLoading,
  };
}
