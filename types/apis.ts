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
 * API Contract는 API 엔드포인트의 요청 및 응답 형식을 정의합니다.
 * 각 엔드포인트에서 사용할 쿼리, 파라미터, 바디, 응답 타입을 제네릭으로 정의합니다.
 *
 * @template Q - 쿼리 파라미터 타입
 * @template P - URL 파라미터 타입
 * @template B - 요청 바디 타입
 * @template R - 응답 데이터 타입
 */
export interface ApiContract<P = any, Q = any, B = any, R = any> {
  paths?: P;
  queries?: Q;
  body?: B;
  response?: R;
}

/** 개별 엔드포인트에서 사용할 헬퍼 */
export type Endpoint<C extends ApiContract> = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
} & C;

// ===== 유틸리티 타입들 =====

/** PaginationParams의 키들을 추출하는 타입 */
type PaginationKeys = keyof PaginationParams;

/** ApiContract에서 각 속성을 안전하게 추출하는 헬퍼 타입들 */
export type ExtractQueries<T extends ApiContract> =
  T extends ApiContract<any, infer Q, any, any> ? Q : never;
export type ExtractPaths<T extends ApiContract> =
  T extends ApiContract<infer P, any, any, any> ? P : never;
export type ExtractBody<T extends ApiContract> =
  T extends ApiContract<any, any, infer B, any> ? B : never;
export type ExtractResponse<T extends ApiContract> =
  T extends ApiContract<any, any, any, infer R> ? R : never;

/** GET 요청 (useApi)에서 사용하는 인자 타입 */
export type ApiQueryArgs<T extends ApiContract> = {
  [K in keyof Pick<T, "queries" | "paths"> as T[K] extends undefined
    ? never
    : K]: T[K];
};

/** 페이지네이션을 포함한 GET 요청에서 사용하는 인자 타입 */
export type ApiPaginationArgs<T extends ApiContract<any, any, any, any>> = {
  [K in keyof Pick<T, "paths"> as T[K] extends undefined ? never : K]: T[K];
} & {
  queries?: (T extends ApiContract<any, infer Q, any, any> ? Q : never) &
    PaginationParams;
};

/** 페이지네이션을 제외한 쿼리 필터만 추출하는 타입 */
export type ApiQueryFilters<T extends ApiContract<any, any, any, any>> = Omit<
  NonNullable<ApiPaginationArgs<T>["queries"]>,
  PaginationKeys
>;

/** 페이지네이션 관련 매개변수만 추출하는 타입 */
export type ApiPaginationParams<T extends ApiContract<any, any, any, any>> =
  Pick<NonNullable<ApiPaginationArgs<T>["queries"]>, PaginationKeys>;

/** Mutation 요청에서 사용하는 인자 타입 */
export type MutationArgs<T extends ApiContract> = {
  [K in keyof Pick<T, "queries" | "paths" | "body"> as T[K] extends undefined
    ? never
    : K]: NonNullable<T[K]>;
} & {
  // 실제로 정의된 속성들을 필수로 만듦
  [K in keyof T as T[K] extends undefined
    ? never
    : K extends "paths" | "queries" | "body"
      ? K
      : never]-?: NonNullable<T[K]>;
};

/** Mutation, Delete 요청 (useMutation)에서 사용하는 path만 있는 인자 타입 */
export type ApiPathArgs<T extends ApiContract> = {
  [K in keyof Pick<T, "paths"> as T[K] extends undefined ? never : K]: T[K];
};

/** Pagination이 포함된 ApiContract 타입 체크 */
export type IsPaginatedContract<T extends ApiContract> =
  ExtractResponse<T> extends { pagination: any } ? true : false;

/** Pagination에서 데이터 배열을 추출하는 타입 */
export type ExtractPaginatedData<T extends ApiContract> =
  ExtractResponse<T> extends { pagination: any }
    ? ExtractResponse<T> extends Record<string, any>
      ? {
          [K in keyof ExtractResponse<T>]: ExtractResponse<T>[K] extends Array<
            infer U
          >
            ? U
            : never;
        }[keyof ExtractResponse<T>]
      : never
    : never;

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

export type IdType = string | number;

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
 * 기본 페이지네이션 API 응답 구조
 * @template T - 데이터 배열의 아이템 타입
 */
export interface BasePaginationResponse<T> {
  pagination: Pagination;
}

/**
 * 동적 키를 가진 페이지네이션 응답 타입 생성 유틸리티
 * @template T - 데이터 배열의 아이템 타입
 * @template K - 데이터 배열을 담는 키 이름 (예: 'posts', 'comments', 'profanities')
 */
export type PaginationResponse<
  T,
  K extends string,
> = BasePaginationResponse<T> & {
  [Key in K]: T[];
};

// 각 도메인별 응답 타입 정의를 위한 헬퍼 타입들
export type PostsPaginationResponse<T> = PaginationResponse<T, "posts">;
export type CommentsPaginationResponse<T> = PaginationResponse<T, "comments">;
export type ProfanitiesPaginationResponse<T> = PaginationResponse<
  T,
  "profanities"
>;
export type MembersPaginationResponse<T> = PaginationResponse<T, "members">;

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
