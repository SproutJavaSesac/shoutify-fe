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
  error: Error | null;
}

/**
 * get이 아닌 http method를 사용하는 API에서 성공, 실패 시 동작을 정의하는 옵션입니다.
 */
export type MutationOptions<R = any, E = any> = {
  onSuccess?: (data?: R) => void;
  onError?: (error: E) => void;
};
