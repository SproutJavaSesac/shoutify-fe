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
 * 비속어 목록 조회 훅
 * @param params 비속어 목록 조회 쿼리 파라미터
 * @return 비속어 목록 조회 결과와 상태
 */
export function useProfanityList(params: ProfanityQueryParams) {
  const [data, setData] = useState<ProfanityListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfanities() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProfanities(params);
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfanities();
  }, [params.page, params.size, params.sort]);

  return { data, loading, error };
}

/**
 * 비속어 생성 훅
 * @returns 비속어 생성 함수와 상태 정보
 */
export function useCreateProfanity() {
  const [data, setData] = useState<ProfanityCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createProfanityHook = async (
    body: ProfanityCreateRequest,
  ): Promise<ProfanityCreateResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await createProfanity(body);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProfanity: createProfanityHook, data, loading, error };
}

/**
 * 비속어 수정 훅
 *
 * @returns 비속어 수정 함수와 상태 정보
 */
export function useUpdateProfanity() {
  const [data, setData] = useState<ProfanityUpdateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfanityHook = async ({
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
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfanity: updateProfanityHook, data, loading, error };
}

/**
 * 비속어 삭제 훅
 * @returns 비속어 삭제 함수와 상태 정보
 */
export function useDeleteProfanity() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteProfanityHook = async (
    profanityId: number,
  ): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      // 비속어 삭제 API 호출
      const response = await deleteProfanity(profanityId);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProfanity: deleteProfanityHook, data, loading, error };
}
