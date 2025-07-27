import { api } from "./client";
import { RankingListResponse, RankingQueryParams } from "@/types/rankings";
import { RANKING_API_ENDPOINTS } from "@/constants/rankings";

/**
 * 전체 랭킹을 조회합니다.
 * @param params 랭킹 조회 쿼리 파라미터
 */
export async function getRankings(
  params: RankingQueryParams,
): Promise<RankingListResponse> {
  return api.public.get<RankingListResponse>(
    RANKING_API_ENDPOINTS.RANKINGS,
    params,
  );
}
