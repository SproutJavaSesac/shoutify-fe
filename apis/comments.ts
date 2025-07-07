import { apiClient } from "./client";
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentsResponse,
  CommentReactionRequest,
} from "@/types/comments";

export class CommentsApi {
  private readonly basePath = "/comments";

  // 게시글의 댓글 목록 조회
  async getComments(postId: number): Promise<CommentsResponse> {
    return apiClient.get<CommentsResponse>(`/posts/${postId}/comments`);
  }

  // 댓글 상세 조회
  async getComment(id: number): Promise<Comment> {
    return apiClient.get<Comment>(`${this.basePath}/${id}`);
  }

  // 댓글 작성
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(this.basePath, data);
  }

  // 댓글 수정
  async updateComment(data: UpdateCommentRequest): Promise<Comment> {
    const { id, ...updateData } = data;
    return apiClient.put<Comment>(`${this.basePath}/${id}`, updateData);
  }

  // 댓글 삭제
  async deleteComment(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // 대댓글 조회
  async getReplies(commentId: number): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`${this.basePath}/${commentId}/replies`);
  }

  // 댓글에 반응하기
  async addReaction(data: CommentReactionRequest): Promise<void> {
    const { commentId, emoji } = data;
    return apiClient.post<void>(`${this.basePath}/${commentId}/reactions`, {
      emoji,
    });
  }

  // 댓글 반응 제거
  async removeReaction(commentId: number, emoji: string): Promise<void> {
    return apiClient.delete<void>(
      `${this.basePath}/${commentId}/reactions/${emoji}`,
    );
  }

  // 사용자의 댓글 목록 조회
  async getUserComments(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<CommentsResponse> {
    const params = { page, limit };
    return apiClient.get<CommentsResponse>(`/users/${userId}/comments`, params);
  }

  // 댓글 신고
  async reportComment(
    commentId: number,
    reason: string,
    description?: string,
  ): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/${commentId}/report`, {
      reason,
      description,
    });
  }

  // 최근 댓글 조회
  async getRecentComments(limit?: number): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`${this.basePath}/recent`, { limit });
  }

  // 인기 댓글 조회 (반응이 많은 댓글)
  async getPopularComments(
    postId?: number,
    limit?: number,
  ): Promise<Comment[]> {
    const params = { postId, limit };
    return apiClient.get<Comment[]>(`${this.basePath}/popular`, params);
  }
}

// API 인스턴스 생성 및 내보내기
export const commentsApi = new CommentsApi();
