import { useEffect, useState } from "react";
import { RankingListResponse, RankingQueryParams } from "@/types/rankings";
import { getRankings } from "@/apis/rankings";

/**
 * 랭킹 목록을 조회하는 훅
 * @param params 랭킹 조회 쿼리 파라미터
 * @returns 랭킹 목록 데이터, 로딩 상태, 에러 정보
 */
export function useRankingList(params: RankingQueryParams) {
  const [data, setData] = useState<RankingListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRankings() {
      try {
        setLoading(true);
        setError(null);

        const response = await getRankings(params);
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, [params.category, params.periodType, params.periodValue]);

  return { data, loading, error };
}
