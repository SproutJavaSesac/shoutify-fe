import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/apis/client";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// 기본 API 훅
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {},
): UseApiState<T> {
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

// 뮤테이션 훅 (POST, PUT, DELETE 등)
export interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useMutation<T, P extends any[]>(
  mutationFn: (...args: P) => Promise<T>,
  options: UseApiOptions = {},
): UseMutationState<T> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (...args: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await mutationFn(...args);
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

// 페이지네이션 훅
export interface UsePaginationOptions<T> {
  pageSize?: number;
  immediate?: boolean;
}

export interface UsePaginationState<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  loading: boolean;
  error: string | null;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
}

export function usePagination<T>(
  fetchFn: (
    page: number,
    limit: number,
  ) => Promise<{
    data: T[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>,
  options: UsePaginationOptions<T> = {},
): UsePaginationState<T> {
  const { pageSize = 10, immediate = true } = options;

  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchFn(page, pageSize);

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
    [fetchFn, pageSize],
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
      fetchData(1);
    }
  }, [fetchData, immediate]);

  return {
    data,
    currentPage,
    totalPages,
    totalCount,
    loading,
    error,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  };
}
