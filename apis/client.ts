// API Base URL - 환경변수나 설정에서 가져오기 (v1 포함)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// 공통 응답 모델 (명세서 기준)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

// 공통 에러 코드 (명세서 기준)
export enum ErrorCode {
  // 400번대 클라이언트 에러
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
  CONFLICT = "CONFLICT",
  VALIDATION_ERROR = "VALIDATION_ERROR",

  // 500번대 서버 에러
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",

  // 도메인 특화 에러
  PROFANITY_DETECTED = "PROFANITY_DETECTED",
  CONTENT_MODERATION_FAILED = "CONTENT_MODERATION_FAILED",
  AI_TRANSFORMATION_FAILED = "AI_TRANSFORMATION_FAILED",
}

// API 에러 타입 (명세서 기준)
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: ErrorCode,
    public data?: any,
    public timestamp?: string,
    public path?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// 공통 API 클라이언트
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // 인증 토큰 설정
  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // 인증 토큰 제거
  removeAuthToken() {
    delete this.defaultHeaders["Authorization"];
  }

  // 공통 요청 메서드
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || response.statusText,
          errorData.code as ErrorCode,
          errorData,
          errorData.timestamp,
          errorData.path,
        );
      }

      const result: ApiResponse<T> = await response.json();

      if (!result.success) {
        throw new ApiError(
          400,
          result.error || "API request failed",
          undefined,
          result,
          result.timestamp,
          result.path,
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Network error or unexpected response");
    }
  }

  // HTTP 메서드들
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const headers =
      data instanceof FormData
        ? {} // FormData는 브라우저가 자동으로 Content-Type 설정
        : { "Content-Type": "application/json" };

    return this.request<T>(endpoint, {
      method: "POST",
      body,
      headers,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// 기본 API 클라이언트 인스턴스
export const apiClient = new ApiClient();

// 로컬 스토리지에서 토큰 가져와서 설정 (브라우저에서만)
if (typeof window !== "undefined") {
  const token = localStorage.getItem("auth_token");
  if (token) {
    apiClient.setAuthToken(token);
  }
}
