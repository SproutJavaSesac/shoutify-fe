import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  ApiOptions,
  ApiState,
  MutationState,
  Pagination,
  PaginationOptions,
  PaginationParams,
  PaginationState,
} from "@/types/apis";

/**
 * 범용적인 API 호출 훅.
 * 사실상 조회(fetch)용으로 주로 사용하다가, 필요하다면 재호출도 할 수 있고, 즉시 실행 여부도 조절 가능함.
 *
 * @param apiCall API 호출을 수행하는 함수. Promise를 반환해야 합니다.
 * @param options API 호출 옵션 객체입니다.
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: ApiOptions<T> = {},
): ApiState<T> {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "An unexpected error occurred";

      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

/**
 * 사용자 정의 뮤테이션 훅.
 * <ul>
 *   <li>T - 반환되는 데이터 타입</li>
 *   <li>P - 뮤테이션 함수에 전달되는 인자 타입, 대부분 body 1개 사용.</li>
 * </ul>
 *
 * @param mutationFn - 뮤테이션을 수행하는 함수. Promise를 반환해야 합니다.
 * @param options - 뮤테이션 성공 및 실패 시 호출되는 콜백 함수들을 포함하는 옵션 객체입니다.
 */
export function useMutation<T, P>(
  mutationFn: (args: P) => Promise<T>,
  options: ApiOptions<T> = {},
): MutationState<T> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (args: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await mutationFn(args);
        setData(result);
        onSuccess?.(result);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "An unexpected error occurred";

        setError(errorMessage);
        onError?.(errorMessage);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, onSuccess, onError],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

/**
 * 범용적인 페이지네이션 훅.
 * @param fetchFn 페이지네이션된 데이터를 가져오는 함수.
 * @param options 페이지네이션 옵션 객체입니다.
 */
export function usePagination<T>(
  fetchFn: (params: PaginationParams) => Promise<any>,
  options: PaginationOptions = {},
): PaginationState<T> {
  const { size = 10, immediate = true, page = 0, sort, order } = options;

  const [data, setData] = useState<T[]>([]);
  const [paginationData, setPaginationData] = useState<Pagination>({
    currentPage: page,
    totalPages: 0,
    totalCount: 0,
    pageSize: size,
    hasNext: false,
    hasPrevious: false,
  });
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (pageNumber: number) => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFn({
          page: pageNumber,
          size: paginationData.pageSize,
          sort,
          order,
        });

        // 응답 구조를 자동으로 감지하여 데이터 추출
        let extractedData: T[];
        let paginationInfo: any;

        paginationInfo = result.pagination;

        // 데이터 배열 추출 - 다양한 키 이름 지원
        if (result.data) {
          extractedData = result.data;
        } else if (result.comments) {
          extractedData = result.comments;
        } else if (result.posts) {
          extractedData = result.posts;
        } else if (result.profanities) {
          extractedData = result.profanities;
        } else if (result.members) {
          extractedData = result.members;
        } else {
          // 다른 가능한 키들을 찾아서 배열인 것을 선택
          const possibleDataKey = Object.keys(result).find(
            (key) => key !== "pagination" && Array.isArray(result[key]),
          );
          extractedData = possibleDataKey ? result[possibleDataKey] : [];
        }

        setData(extractedData);

        // 모든 pagination 정보를 한 번에 업데이트 (성능 개선)
        setPaginationData({
          currentPage: pageNumber,
          totalPages: paginationInfo.totalPages ?? 0,
          totalCount: paginationInfo.totalCount ?? 0,
          pageSize: paginationData.pageSize,
          hasNext: pageNumber < (paginationInfo.totalPages ?? 0) - 1,
          hasPrevious: pageNumber > 0,
        });
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "An unexpected error occurred";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, paginationData.pageSize, sort, order],
  );

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 0 && pageNumber < paginationData.totalPages) {
        fetchData(pageNumber);
      }
    },
    [fetchData, paginationData.totalPages],
  );

  const nextPage = useCallback(() => {
    if (paginationData.hasNext) {
      goToPage(paginationData.currentPage + 1);
    }
  }, [paginationData.hasNext, paginationData.currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (paginationData.hasPrevious) {
      goToPage(paginationData.currentPage - 1);
    }
  }, [paginationData.hasPrevious, paginationData.currentPage, goToPage]);

  const refetch = useCallback(() => {
    fetchData(paginationData.currentPage);
  }, [fetchData, paginationData.currentPage]);

  useEffect(() => {
    if (immediate) {
      fetchData(page);
    }
  }, [fetchData, immediate, page]);

  return {
    data,
    loading,
    error,
    ...paginationData, // Pagination 객체의 모든 속성을 spread
    goToPage,
    nextPage,
    prevPage,
    refetch,
  };
}
