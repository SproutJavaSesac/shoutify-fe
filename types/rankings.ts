export interface Ranking {
  memberId: number;
  memberNickname: string;
  memberProfileImageUrl: string;
  categoryValue: number;
  rank: number;
  previousRank: number;
  rankChange: string; // +2, -, -3, NEW
  createdAt: string;
}

export interface RankingListResponse {
  category: RankingCategoryType;
  periodType: RankingPeriodType;
  periodValue: string; // '2025-07-14' 형식
  rankings: Ranking[];
}

export interface RankingQueryParams {
  category: RankingCategoryType;
  periodType: RankingPeriodType;
  periodValue: string; // '2025-07-14' 형식
}

export type RankingCategoryType = "POST";

export interface RankingCategoryOption {
  label: string;
  value: RankingCategoryType;
}

export type RankingPeriodType = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface RankingPeriodTypeOption {
  label: string;
  value: RankingPeriodType;
}
