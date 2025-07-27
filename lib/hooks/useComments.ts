import {
  CommentCreateRequest,
  CommentCreateResponse,
  CommentListRequest,
  CommentListResponse,
  CommentPathParams,
} from "@/types/comments";
import { useEffect, useState } from "react";
import { createComment, deleteComment, getComments } from "@/apis/comments";

/**
 * 댓글 조회 훅
 *
 * @param request 댓글 목록 조회 요청 객체
 * @return 댓글 목록 조회 결과와 상태
 */
export function useCommentList({ postId, queryParams }: CommentListRequest) {
  const [data, setData] = useState<CommentListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        setError(null);

        const response = await getComments({ postId, queryParams });
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postId, queryParams]);

  return { data, loading, error };
}

/**
 * 댓글 작성 훅
 *
 * @returns 댓글 작성 함수와 성공, 로딩, 실패 상태 정보
 */
export function useCreateComment() {
  const [data, setData] = useState<CommentCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCommentHook = async ({ postId, body }: CommentCreateRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await createComment({ postId, body });
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { createComment: createCommentHook, data, loading, error };
}

/**
 * 댓글 삭제 훅
 *
 * @returns 댓글 삭제 함수와 상태 정보
 */
export function useDeleteComment() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteCommentHook = async ({
    postId,
    commentId,
  }: CommentPathParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await deleteComment({ postId, commentId });

      setData(response);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteComment: deleteCommentHook, data, loading, error };
}
