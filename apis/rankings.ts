import { api } from "./client";
import type {
  RankedPost,
  RankedUser,
  RankingsResponse,
  RankingQueryParams,
  RankingType,
  RankingPeriod,
} from "@/types/rankings";

export class RankingsApi {
  private readonly basePath = "/rankings";

  // 전체 랭킹 데이터 조회
  async getRankings(params?: RankingQueryParams): Promise<RankingsResponse> {
    return api.public.get<RankingsResponse>(this.basePath, params);
  }

  // 가장 북마크가 많은 게시글 랭킹
  async getMostBookmarkedPosts(
    params?: RankingQueryParams,
  ): Promise<RankedPost[]> {
    return api.public.get<RankedPost[]>(
      `${this.basePath}/posts/bookmarks`,
      params,
    );
  }

  // 가장 반응이 많은 게시글 랭킹
  async getMostReactedPosts(
    params?: RankingQueryParams,
  ): Promise<RankedPost[]> {
    return api.public.get<RankedPost[]>(
      `${this.basePath}/posts/reactions`,
      params,
    );
  }

  // 가장 활발한 사용자 랭킹
  async getMostActiveUsers(params?: RankingQueryParams): Promise<RankedUser[]> {
    return api.public.get<RankedUser[]>(
      `${this.basePath}/users/active`,
      params,
    );
  }

  // 특별 점수 사용자 랭킹
  async getSpecialScoreUsers(
    params?: RankingQueryParams,
  ): Promise<RankedUser[]> {
    return api.public.get<RankedUser[]>(
      `${this.basePath}/users/special-score`,
      params,
    );
  }

  // 특정 타입의 랭킹 조회
  async getRankingByType(
    type: RankingType,
    params?: RankingQueryParams,
  ): Promise<RankedPost[] | RankedUser[]> {
    return api.public.get(`${this.basePath}/${type}`, params);
  }

  // 카테고리별 게시글 랭킹
  async getPostRankingsByCategory(
    category: string,
    params?: Omit<RankingQueryParams, "category">,
  ): Promise<RankedPost[]> {
    return api.public.get<RankedPost[]>(
      `${this.basePath}/posts/category/${category}`,
      params,
    );
  }

  // 감정별 게시글 랭킹
  async getPostRankingsByEmotion(
    emotion: string,
    params?: RankingQueryParams,
  ): Promise<RankedPost[]> {
    return api.public.get<RankedPost[]>(
      `${this.basePath}/posts/emotion/${emotion}`,
      params,
    );
  }

  // 신규 작가 랭킹 (최근 가입한 사용자 중 활발한 사용자)
  async getNewWriterRankings(
    params?: RankingQueryParams,
  ): Promise<RankedUser[]> {
    return api.public.get<RankedUser[]>(
      `${this.basePath}/users/new-writers`,
      params,
    );
  }

  // 급상승 게시글 랭킹 (최근 반응이 크게 늘어난 게시글)
  async getTrendingPosts(params?: RankingQueryParams): Promise<RankedPost[]> {
    return api.public.get<RankedPost[]>(
      `${this.basePath}/posts/trending`,
      params,
    );
  }

  // 사용자의 랭킹 위치 조회
  async getUserRanking(
    userId: string,
    type: "active" | "special-score",
  ): Promise<{
    rank: number;
    score: number;
    percentile: number;
    totalUsers: number;
  }> {
    return api.public.get(`${this.basePath}/users/${userId}/rank/${type}`);
  }

  // 게시글의 랭킹 위치 조회
  async getPostRanking(
    postId: number,
    type: "bookmarks" | "reactions",
  ): Promise<{
    rank: number;
    score: number;
    percentile: number;
    totalPosts: number;
  }> {
    return api.public.get(`${this.basePath}/posts/${postId}/rank/${type}`);
  }

  // 랭킹 히스토리 조회 (시간에 따른 랭킹 변화)
  async getRankingHistory(
    id: string | number,
    type: "user" | "post",
    rankingType: string,
    period: RankingPeriod = "weekly",
  ): Promise<
    Array<{
      date: string;
      rank: number;
      score: number;
    }>
  > {
    return api.public.get(
      `${this.basePath}/history/${type}/${id}/${rankingType}`,
      { period },
    );
  }

  // 랭킹 알림 설정
  async setRankingNotification(
    type: "user" | "post",
    id: string | number,
    enabled: boolean,
  ): Promise<void> {
    return api.post<void>(`${this.basePath}/notifications`, {
      type,
      id,
      enabled,
    });
  }

  // 랭킹 통계 조회
  async getRankingStats(): Promise<{
    totalPosts: number;
    totalUsers: number;
    mostPopularCategory: string;
    mostPopularEmotion: string;
    averageReactionsPerPost: number;
    averageBookmarksPerPost: number;
  }> {
    return api.public.get(`${this.basePath}/stats`);
  }
}

// API 인스턴스 생성 및 내보내기
export const rankingsApi = new RankingsApi();
