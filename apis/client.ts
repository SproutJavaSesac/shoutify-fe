// API 클라이언트
import { ApiError, ApiErrorResponse } from "@/types/apis";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

// 서버 응답 타입
type Response<T> = {
  isSuccess: boolean;
  result?: T;
  error?: ApiErrorResponse;
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

      // JSON 파싱 시도
      let result: Response<T>;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error("JSON 파싱 에러:", jsonError);
        throw new ApiError(response.status || 500, url, {
          name: "JSON_PARSE_ERROR",
          message: "서버 응답을 처리할 수 없습니다.",
          param: "",
          timestamp: new Date().toISOString(),
        });
      }

      // 500대 에러 처리 - 서버에서 온 에러 메시지 그대로 사용
      if (response.status >= 500) {
        console.error(`🚨 서버 에러 ${response.status}:`, result.error);
        throw new ApiError(
          response.status,
          url,
          result.error ?? {
            name: `CLIENT__HTTP_${response.status}`,
            param: "알 수 없음",
            message: "서버에 문제가 발생했습니다.",
            timestamp: new Date().toISOString(),
          },
        );
      }

      // 기타 HTTP 에러 처리
      if (!response.ok || !result.isSuccess || !result.result) {
        console.error(`API 에러 ${response.status}:`, result.error);
        throw new ApiError(
          response.status,
          url,
          result.error ?? {
            name: `CLIENT__HTTP_${response.status}`,
            param: "알 수 없음",
            message: "요청 처리 중 오류가 발생했습니다.",
            timestamp: new Date().toISOString(),
          },
        );
      }

      return result.result;
    } catch (error) {
      // 이미 ApiError인 경우 그대로 전파
      if (error instanceof ApiError) {
        throw error;
      }

      // fetch 자체의 네트워크 에러 (연결 실패, CORS 등)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("네트워크 연결 에러:", error);
        throw new ApiError(0, url, {
          name: "CLIENT__NETWORK_ERROR",
          param: "알 수 없음.",
          message: "서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.",
          timestamp: new Date().toISOString(),
        });
      }

      // 기타 예상치 못한 에러
      console.error("예상치 못한 에러:", error);
      throw new ApiError(500, url, {
        name: "CLIENT__UNKNOWN_ERROR",
        param: "알 수 없음.",
        message: "예상치 못한 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      });
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
