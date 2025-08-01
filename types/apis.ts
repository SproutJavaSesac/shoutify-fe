/**
 * Api 호출 시 발생하는 에러를 나타내는 클래스입니다.
 */
export class ApiError extends Error {
  public readonly statusCode: number; // HTTP 상태 코드
  public readonly url: string; // 에러가 발생한 URL
  public readonly name: string;
  public readonly message: string;
  public readonly param?: string; // 에러가 발생한 파라미터 (선택적)
  public readonly timestamp: string; // 에러 발생 시간 (ISO 8601 형식)

  /**
   * ApiError 생성자
   *
   * @param statusCode - HTTP 상태 코드 (예: 404, 500 등)
   * @param url - 에러가 발생한 API URL
   * @param apiErrorResponse - API에서 반환된 에러 응답 객체
   */
  constructor(
    statusCode: number,
    url: string,
    apiErrorResponse: ApiErrorResponse,
  ) {
    super(apiErrorResponse.message);
    this.statusCode = statusCode;
    this.url = url;
    this.param = apiErrorResponse.param;
    this.name = apiErrorResponse.name;
    this.message = apiErrorResponse.message;
    this.timestamp = apiErrorResponse.timestamp || new Date().toISOString();
  }
}

/**
 * API 500대에서 사용하는 공통 에러 형식입니다.
 */
export interface ApiErrorResponse {
  name: string;
  param: string;
  message: string;
  timestamp: string;
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
 *
 * @template R - API 호출의 성공 시 반환되는 데이터 타입
 */
export interface ApiOptions<R> {
  immediate?: boolean;
  onSuccess?: (data: R) => void;
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
 * Pagination hook에서 반환하는 상태를 정의합니다.
 * Pagination 정보와 함께 데이터 조회 상태 및 액션들을 포함합니다.
 *
 * @template T - 페이지네이션된 데이터의 타입
 */
export interface PaginationState<T> extends Pagination {
  /** 현재 페이지의 데이터 배열 */
  data: T[];
  /** 데이터 로딩 상태 */
  loading: boolean;
  /** 에러 메시지 (에러가 없으면 null) */
  error: string | null;
  /** 특정 페이지로 이동하는 함수 */
  goToPage: (page: number) => void;
  /** 다음 페이지로 이동하는 함수 */
  nextPage: () => void;
  /** 이전 페이지로 이동하는 함수 */
  prevPage: () => void;
  /** 현재 페이지 데이터를 다시 불러오는 함수 */
  refetch: () => void;
}
