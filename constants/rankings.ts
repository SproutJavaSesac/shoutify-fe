import {
  RankingCategoryOption,
  RankingPeriodTypeOption,
} from "@/types/rankings";

/**
 * 랭킹 관련 API 엔드포인트
 */
export const RANKING_API_ENDPOINTS = {
  /**
   * 전체 랭킹 조회 API 엔드포인트
   */
  RANKINGS: "/rankings",
};

/**
 * 랭킹 관련 프론트 URL 경로
 */
export const RANKING_ROUTES = {
  /**
   * 전체 랭킹 페이지 URL
   */
  LIST: "/ranking",
};

/**
 * 랭킹 카테고리 옵션 정의
 */
export const RANKING_CATEGORY_OPTIONS: RankingCategoryOption[] = [
  { label: "게시글", value: "POST" },
] as const;

/**
 * 랭킹 기간 옵션 정의
 */
export const RANKING_PERIOD_OPTIONS: RankingPeriodTypeOption[] = [
  { label: "일간", value: "DAILY" },
  { label: "주간", value: "WEEKLY" },
  { label: "월간", value: "MONTHLY" },
  { label: "연간", value: "YEARLY" },
] as const;
