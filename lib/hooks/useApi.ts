import { useCallback, useEffect, useState } from "react";
import {
  ApiError,
  ApiOptions,
  ApiState,
  MutationState,
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
  options: ApiOptions = {},
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
  options: ApiOptions = {},
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
  const { size = 10, immediate = true, page = 1, sort, order } = options;

  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(size);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFn({
          page,
          size: pageSize,
          sort,
          order,
        });

        setData(result.data);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
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
    [fetchFn, pageSize, sort, order],
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        fetchData(page);
      }
    },
    [fetchData, totalPages],
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  const refetch = useCallback(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  useEffect(() => {
    if (immediate) {
      fetchData(currentPage - 1);
    }
  }, [fetchData, immediate, currentPage]);

  return {
    data,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    loading,
    error,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  };
}
