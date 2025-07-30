// API 클라이언트
import { ApiError } from "@/types/apis";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// 서버 응답 타입
export type Response<T> = {
  isSuccess: boolean;
  result: T;
  message?: string;
  error?: string;
};

class ApiClient {
  private token?: string;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = undefined;
  }

  async get<T>(
    url: string,
    params?: Record<string, any>,
    authenticated = true,
  ): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<T>(`${url}${queryString}`, {
      method: "GET",
      auth: authenticated,
    });
  }

  async post<T>(url: string, data?: any, authenticated = true): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
      auth: authenticated,
    });
  }

  async put<T>(url: string, data?: any, authenticated = true): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      auth: authenticated,
    });
  }

  async patch<T>(url: string, data?: any, authenticated = true): Promise<T> {
    return this.request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
      auth: authenticated,
    });
  }

  async delete<T>(url: string, authenticated = true): Promise<T> {
    return this.request<T>(url, { method: "DELETE", auth: authenticated });
  }

  // 기본 요청 함수
  private async request<T>(
    url: string,
    options: RequestInit & { auth?: boolean },
  ): Promise<T> {
    const { auth = true, ...fetchOptions } = options; // 기본적으로 인증 필요한 요청으로 설정

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    // 인증이 필요하고 토큰이 있는 경우에만 헤더 추가
    if (auth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        ...fetchOptions,
        headers,
        credentials: "include", // 쿠키 포함
      });

      // 500 에러 특별 처리 (백엔드 NullPointerException 등)
      if (response.status === 500) {
        console.error(
          "🚨 백엔드 500 에러: 서버 내부 오류가 발생했습니다. userPrincipal이 null일 수 있습니다.",
        );
        throw new ApiError(
          500,
          "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        );
      }

      const result: Response<T> = await response.json();

      if (!response.ok || !result.isSuccess) {
        const errorMessage =
          result.error || result.message || "알 수 없는 에러";
        console.error(
          `API Error: ${response.status} - ${errorMessage}`,
          result,
        );
        throw new ApiError(response.status, errorMessage, result);
      }

      return result.result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("네트워크 또는 예상치 못한 에러:", error);
      throw new ApiError(
        503,
        "서버에 연결할 수 없거나 응답을 처리할 수 없습니다.",
      );
    }
  }
}

// ApiClient 인스턴스는 내부적으로만 사용합니다.
const client = new ApiClient();

// 외부에는 이 api 객체만 노출하여 일관된 사용법을 제공합니다.
export const api = {
  // 인증이 필요한 API 호출
  get: <T>(url: string, params?: Record<string, any>) =>
    client.get<T>(url, params, true),
  post: <T>(url: string, data?: any) => client.post<T>(url, data, true),
  put: <T>(url: string, data?: any) => client.put<T>(url, data, true),
  delete: <T>(url: string) => client.delete<T>(url, true),
  patch: <T>(url: string, data?: any) => client.patch<T>(url, data, true),

  // 인증이 필요 없는 공개 API 호출
  public: {
    get: <T>(url: string, params?: Record<string, any>) =>
      client.get<T>(url, params, false),
    // 필요하다면 public.post 등 다른 메소드도 추가할 수 있습니다.
  },

  // 토큰 관리
  setToken: (token: string) => client.setToken(token),
  clearToken: () => client.clearToken(),
};
