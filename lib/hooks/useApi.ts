import { useCallback, useEffect, useState } from "react";
import {
  ApiContract,
  ApiError,
  ApiOptions,
  ApiPaginationArgs,
  ApiQueryArgs,
  ApiQueryFilters,
  ApiState,
  ExtractPaginatedData,
  ExtractResponse,
  MutationArgs,
  MutationState,
  Pagination,
  PaginationOptions,
  PaginationState,
} from "@/types/apis";

/**
 * 범용적인 API 조회 훅
 * GET 요청에 최적화되어 있으며, queries와 paths만 인자로 받습니다.
 */
export function useApi<T extends ApiContract<any, any, any, any>>(
  apiCall: (args?: ApiQueryArgs<T>) => Promise<ExtractResponse<T>>,
  options: ApiOptions<ExtractResponse<T>> = {},
): ApiState<ExtractResponse<T>> {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<ExtractResponse<T> | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (args?: ApiQueryArgs<T>) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiCall(args);
        setData(result);
        onSuccess?.(result);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : "An unexpected error occurred";

        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, onSuccess, onError],
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: () => execute(),
  };
}

/**
 * 뮤테이션 훅 (POST, PUT, PATCH, DELETE)
 * queries, paths, body를 모두 인자로 받을 수 있습니다.
 */
export function useMutation<T extends ApiContract<any, any, any, any>>(
  mutationFn: (args: MutationArgs<T>) => Promise<ExtractResponse<T>>,
  options: ApiOptions<ExtractResponse<T>> = {},
): MutationState<ExtractResponse<T>> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<ExtractResponse<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (args: MutationArgs<T>): Promise<ExtractResponse<T> | null> => {
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
 * 페이지네이션 전용 훅
 * ApiContract가 pagination 응답을 포함하는 경우에만 사용 가능합니다.
 */
export function usePagination<T extends ApiContract<any, any, any, any>>(
  fetchFn: (args: ApiPaginationArgs<T>) => Promise<ExtractResponse<T>>,
  options: PaginationOptions = {},
): PaginationState<ExtractPaginatedData<T>> {
  type DataType = ExtractPaginatedData<T>;

  const { size = 10, immediate = true, page = 0, sort, order } = options;

  const [data, setData] = useState<DataType[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<Pagination>({
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
    async (pageNumber: number, extraArgs?: ApiQueryFilters<T>) => {
      try {
        setLoading(true);
        setError(null);

        const queriesWithPagination = {
          ...extraArgs,
          page: pageNumber,
          size, // ← 무한 렌더링 방지 위해 결과값 paginationInfo.pageSize 대신 외부값 options.size 사용
          sort,
          order,
        };

        const result = await fetchFn({
          queries: queriesWithPagination,
        } as ApiPaginationArgs<T>);

        // 응답에서 pagination 정보 추출
        const paginationData = (result as any).pagination as Pagination;

        // 데이터 배열 추출 (pagination을 제외한 배열 속성 찾기)
        const dataArrayKey = Object.keys(result as any).find(
          (key) => key !== "pagination" && Array.isArray((result as any)[key]),
        );

        const extractedData: DataType[] = dataArrayKey
          ? (result as any)[dataArrayKey]
          : [];

        setData(extractedData);
        setPaginationInfo({
          currentPage: pageNumber,
          totalPages: paginationData.totalPages ?? 0,
          totalCount: paginationData.totalCount ?? 0,
          pageSize: size, // ← 여기도 수정
          hasNext: pageNumber < (paginationData.totalPages ?? 0) - 1,
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
    [fetchFn, size, sort, order], // ← paginationInfo.pageSize 제거
  );

  const goToPage = useCallback(
    (pageNumber: number, extraArgs?: ApiQueryFilters<T>) => {
      if (pageNumber >= 0 && pageNumber < paginationInfo.totalPages) {
        fetchData(pageNumber, extraArgs);
      }
    },
    [fetchData, paginationInfo.totalPages],
  );

  const nextPage = useCallback(
    (extraArgs?: ApiQueryFilters<T>) => {
      if (paginationInfo.hasNext) {
        goToPage(paginationInfo.currentPage + 1, extraArgs);
      }
    },
    [paginationInfo.hasNext, paginationInfo.currentPage, goToPage],
  );

  const prevPage = useCallback(
    (extraArgs?: ApiQueryFilters<T>) => {
      if (paginationInfo.hasPrevious) {
        goToPage(paginationInfo.currentPage - 1, extraArgs);
      }
    },
    [paginationInfo.hasPrevious, paginationInfo.currentPage, goToPage],
  );

  const refetch = useCallback(
    (extraArgs?: ApiQueryFilters<T>) => {
      fetchData(paginationInfo.currentPage, extraArgs);
    },
    [fetchData, paginationInfo.currentPage],
  );

  useEffect(() => {
    if (immediate) {
      fetchData(page);
    }
  }, [fetchData, immediate, page]);

  return {
    data,
    loading,
    error,
    ...paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  };
}
