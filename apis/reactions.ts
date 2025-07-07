import { apiClient } from "./client";
import type {
  Reaction,
  ReactionRequest,
  ReactionsResponse,
  ReactionStats,
  ReactionTarget,
  ReactionEmoji,
} from "@/types/reactions";

export class ReactionsApi {
  private readonly basePath = "/reactions";

  // 게시글/댓글 반응 조회
  async getReactions(
    targetId: number,
    targetType: ReactionTarget,
  ): Promise<ReactionsResponse> {
    return apiClient.get<ReactionsResponse>(
      `${this.basePath}/${targetType}/${targetId}`,
    );
  }

  // 반응 추가/수정
  async addReaction(data: ReactionRequest): Promise<void> {
    return apiClient.post<void>(this.basePath, data);
  }

  // 반응 제거
  async removeReaction(
    targetId: number,
    targetType: ReactionTarget,
  ): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${targetType}/${targetId}`);
  }

  // 사용자의 반응 목록 조회
  async getUserReactions(
    userId: string,
    targetType?: ReactionTarget,
    page?: number,
    limit?: number,
  ): Promise<Reaction[]> {
    const params = { targetType, page, limit };
    return apiClient.get<Reaction[]>(`${this.basePath}/user/${userId}`, params);
  }

  // 반응 통계 조회
  async getReactionStats(
    targetId: number,
    targetType: ReactionTarget,
  ): Promise<ReactionStats> {
    return apiClient.get<ReactionStats>(
      `${this.basePath}/${targetType}/${targetId}/stats`,
    );
  }

  // 전체 반응 통계 조회
  async getGlobalReactionStats(
    period?: "daily" | "weekly" | "monthly",
  ): Promise<{
    totalReactions: number;
    topEmojis: Array<{ emoji: string; count: number }>;
    trendingPosts: Array<{
      postId: number;
      title: string;
      reactionCount: number;
    }>;
  }> {
    return apiClient.get(`${this.basePath}/stats/global`, { period });
  }

  // 가장 많은 반응을 받은 컨텐츠 조회
  async getMostReactedContent(
    targetType: ReactionTarget,
    period?: "daily" | "weekly" | "monthly",
    limit?: number,
  ): Promise<
    Array<{
      targetId: number;
      title?: string;
      author?: string;
      reactionCount: number;
      topEmoji: string;
    }>
  > {
    const params = { period, limit };
    return apiClient.get(`${this.basePath}/most-reacted/${targetType}`, params);
  }

  // 특정 이모지로 반응한 사용자 목록 조회
  async getReactionUsers(
    targetId: number,
    targetType: ReactionTarget,
    emoji: ReactionEmoji,
  ): Promise<
    Array<{
      userId: string;
      username: string;
      avatar?: string;
      reactedAt: string;
    }>
  > {
    return apiClient.get(
      `${this.basePath}/${targetType}/${targetId}/users/${emoji}`,
    );
  }

  // 사용자가 특정 컨텐츠에 한 반응 조회
  async getUserReaction(
    targetId: number,
    targetType: ReactionTarget,
  ): Promise<{ emoji: string } | null> {
    try {
      return await apiClient.get<{ emoji: string }>(
        `${this.basePath}/${targetType}/${targetId}/my-reaction`,
      );
    } catch (error) {
      // 반응이 없는 경우 404가 될 수 있으므로 null 반환
      return null;
    }
  }

  // 반응 가능한 이모지 목록 조회
  async getAvailableEmojis(): Promise<
    Array<{
      emoji: string;
      name: string;
      description: string;
      order: number;
    }>
  > {
    return apiClient.get(`${this.basePath}/emojis`);
  }

  // 벌크 반응 추가 (여러 컨텐츠에 한번에 반응)
  async addBulkReactions(reactions: ReactionRequest[]): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/bulk`, { reactions });
  }

  // 벌크 반응 제거
  async removeBulkReactions(
    targets: Array<{ targetId: number; targetType: ReactionTarget }>,
  ): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/bulk/remove`, { targets });
  }
}

// API 인스턴스 생성 및 내보내기
export const reactionsApi = new ReactionsApi();
