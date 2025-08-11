import { useCallback } from "react";
import { useMutation, usePagination } from "./useApi";
import { createComment, deleteComment, getComments } from "@/apis/comments";
import {
  CommentCreateContract,
  CommentDeleteContract,
  CommentListContract,
} from "@/types/comments";
import { ApiOptions, ExtractResponse, PaginationOptions } from "@/types/apis";

// 댓글 조회 - usePagination 사용
export function useCommentList({
  postId,
  ...paginationOptions
}: { postId: string | number } & PaginationOptions) {
  const fetchFn = useCallback(
    (args: any) => {
      return getComments({
        paths: { postId },
        queries: args.queries,
      });
    },
    [postId],
  );

  return usePagination<CommentListContract>(fetchFn, {
    immediate: true,
    ...paginationOptions,
  });
}

// 댓글 작성 - 낙관적 업데이트 지원
export function useCommentCreate(
  options?: ApiOptions<ExtractResponse<CommentCreateContract>>,
) {
  return useMutation<CommentCreateContract>(createComment, options);
}

// 댓글 삭제
export function useCommentDelete(
  options?: ApiOptions<ExtractResponse<CommentDeleteContract>>,
) {
  return useMutation<CommentDeleteContract>(deleteComment, options);
}
