import { useState } from "react";
import {
  CommentReactionRequest,
  CommentReactionResponse,
  PostReactionRequest,
  PostReactionResponse,
} from "@/types/reactions";
import { doCommentReaction, doPostReaction } from "@/apis/reactions";

/**
 * 게시글에 반응하는 훅
 *
 * @returns 게시글 반응 함수와 성공, 로딩, 실패 상태 정보
 */
export function useDoPostReaction() {
  const [data, setData] = useState<PostReactionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const doPostReactionHook = async ({ postId, body }: PostReactionRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await doPostReaction({ postId, body });
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { doPostReaction: doPostReactionHook, data, loading, error };
}

/**
 * 댓글에 반응하는 훅
 *
 * @returns 댓글 반응 함수와 성공, 로딩, 실패 상태 정보
 */
export function useDoCommentReaction() {
  const [data, setData] = useState<CommentReactionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const doCommentReactionHook = async ({
    postId,
    commentId,
    body,
  }: CommentReactionRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await doCommentReaction({ postId, commentId, body });
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { doCommentReaction: doCommentReactionHook, data, loading, error };
}
