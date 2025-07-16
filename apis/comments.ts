import { api } from "./client";
import type {
  Comment,
  CommentsResponse,
  CreateCommentRequest,
} from "@/types/comments";

// 게시글의 댓글 목록 조회
export async function getComments(postId: number): Promise<CommentsResponse> {
  return api.public.get<CommentsResponse>(`/posts/${postId}/comments`);
}

// 댓글 작성
export async function createComment(
  data: CreateCommentRequest,
): Promise<Comment> {
  return api.post<Comment>("/comments", data);
}

// 댓글 수정
export async function updateComment(
  commentId: number,
  content: string,
): Promise<Comment> {
  return api.put<Comment>(`/comments/${commentId}`, { content });
}

// 댓글 삭제
export async function deleteComment(commentId: number): Promise<void> {
  return api.delete<void>(`/comments/${commentId}`);
}

// 댓글에 반응하기
export async function addReaction(
  commentId: number,
  emoji: string,
): Promise<void> {
  return api.post<void>(`/comments/${commentId}/reactions`, { emoji });
}

// 댓글 반응 제거
export async function removeReaction(
  commentId: number,
  emoji: string,
): Promise<void> {
  return api.delete<void>(`/comments/${commentId}/reactions/${emoji}`);
}

// 댓글 신고
export async function reportComment(
  commentId: number,
  reason: string,
  description?: string,
): Promise<void> {
  return api.post<void>(`/comments/${commentId}/report`, {
    reason,
    description,
  });
}
