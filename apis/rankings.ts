import { api } from "./client";
import { RankingListContract, RankingListResponse } from "@/types/rankings";
import { RANKING_API_ENDPOINTS } from "@/constants/rankings";
import { ApiQueryArgs } from "@/types/apis";

/**
 * 전체 랭킹을 조회합니다.
 * @param args 랭킹 조회 쿼리 파라미터
 */
export async function getRankings({
  queries,
}: ApiQueryArgs<RankingListContract>): Promise<RankingListResponse> {
  return api.public.get<RankingListResponse>(
    RANKING_API_ENDPOINTS.RANKINGS,
    queries
  );
}
