/**
 * Api 호출 시 발생하는 에러를 나타내는 클래스입니다.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * API 호출 hooks에서 사용하는 공통 응답 형식입니다.
 */
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * get이 아닌 http method를 사용하는 API에서 성공, 실패 시 동작을 정의하는 옵션입니다.
 */
export interface ApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Mutation 훅에서 사용하는 상태 형식입니다.
 * 예: POST, PUT, DELETE 요청 등
 */
export interface MutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  mutate: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Pagination hook에서 사용하는 옵션을 정의합니다.
 */
export interface PaginationOptions {
  size?: number;
  page?: number;
  sort?: string;
  order?: "ASC" | "DESC";
  immediate?: boolean;
}

/**
 * PaginationParams는 페이지네이션 요청 시 필요한 파라미터를 정의합니다.
 */
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

/**
 * API에서 공통으로 반환받는 페이지네이션 정보를 정의합니다.
 */
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * PaginationState는 hook에서 반환하는 페이지네이션 상태를 정의합니다.
 */
export interface PaginationState<T> extends Pagination {
  data: T[];
  loading: boolean;
  error: string | null;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refetch: () => void;
}
