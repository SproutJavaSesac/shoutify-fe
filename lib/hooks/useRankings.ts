import { useCallback } from "react";
import { useApi } from "./useApi";
import { getRankings } from "@/apis/rankings";
import { RankingListContract, RankingQueryParams } from "@/types/rankings";
import { ApiOptions, ExtractResponse } from "@/types/apis";

/**
 * 랭킹 목록을 조회하는 훅
 * @param params 랭킹 조회 쿼리 파라미터
 * @param options API 옵션
 * @returns 랭킹 목록 데이터, 로딩 상태, 에러 정보
 */
export function useRankingList(
  params: RankingQueryParams,
  options: ApiOptions<ExtractResponse<RankingListContract>> = {}
) {
  const fetchFn = useCallback(() => {
    return getRankings({
      queries: params,
    });
  }, [params.category, params.periodType, params.periodValue]);

  return useApi<RankingListContract>(fetchFn, {
    immediate: true,
    ...options,
  });
}
