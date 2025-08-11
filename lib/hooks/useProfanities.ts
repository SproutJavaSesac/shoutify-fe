import { useEffect, useState } from "react";
import {
  ProfanityCreateRequest,
  ProfanityCreateResponse,
  ProfanityListResponse,
  ProfanityQueryParams,
  ProfanityUpdateRequest,
  ProfanityUpdateResponse,
} from "@/types/profanities";
import {
  createProfanity,
  deleteProfanity,
  getProfanities,
  updateProfanity,
} from "@/apis/profanities";

/**
 * 금지어 목록 조회 훅
 * @param params 금지어 목록 조회 쿼리 파라미터
 * @return 금지어 목록 조회 결과와 상태
 */
export function useProfanityList(params: ProfanityQueryParams) {
  const [data, setData] = useState<ProfanityListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProfanities(params);
      setData(response);
    } catch (err: any) {
      const errorMessage =
        err.message || "금지어 목록을 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [
    params.page,
    params.size,
    params.sort,
    params.order,
    params.category,
    params.keyword,
  ]);

  return { data, loading, error, refetch };
}

/**
 * 금지어 생성 훅
 * @returns 금지어 생성 함수와 상태 정보
 */
export function useCreateProfanity() {
  const [data, setData] = useState<ProfanityCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    body: ProfanityCreateRequest
  ): Promise<ProfanityCreateResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await createProfanity(body);
      setData(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "금지어 등록 중 오류가 발생했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}

/**
 * 금지어 수정 훅
 * @returns 금지어 수정 함수와 상태 정보
 */
export function useUpdateProfanity() {
  const [data, setData] = useState<ProfanityUpdateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async ({
    profanityId,
    body,
  }: ProfanityUpdateRequest): Promise<ProfanityUpdateResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await updateProfanity({ profanityId, body });
      setData(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "금지어 수정 중 오류가 발생했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}

/**
 * 금지어 삭제 훅
 * @returns 금지어 삭제 함수와 상태 정보
 */
export function useDeleteProfanity() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (profanityId: number): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await deleteProfanity(profanityId);
      setData(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "금지어 삭제 중 오류가 발생했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}
