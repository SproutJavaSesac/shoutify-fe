// API 클라이언트
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// 서버 응답 타입
export type Response<T> = {
  isSuccess: boolean;
  result: T;
  message?: string;
  error?: string;
};

export class FetchError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = "FetchError";
  }
}

class SimpleClient {
  private token?: string;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = undefined;
  }

  // 기본 요청 함수
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // 토큰이 있으면 추가
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    // 디버깅: 쿠키 정보 출력
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      const cookies = document.cookie;
      const hasJSessionId = cookies.includes("JSESSIONID");
      console.log("🍪 현재 쿠키:", cookies);
      console.log("🔑 JSESSIONID 존재:", hasJSessionId);
    }

    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: "include", // 쿠키 포함
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // 500 에러 특별 처리 (백엔드 NullPointerException)
        if (response.status === 500) {
          console.warn(
            "🚨 백엔드 500 에러: userPrincipal null (로그인되지 않은 상태)",
          );
          // 로그인되지 않은 상태로 간주
          throw new FetchError(401, "로그인이 필요합니다");
        }

        throw new FetchError(
          response.status,
          errorData.message || response.statusText,
          errorData,
        );
      }

      const result: Response<T> = await response.json();

      if (!result.isSuccess) {
        throw new FetchError(400, result.error || "요청이 실패했습니다");
      }

      return result.result;
    } catch (error) {
      if (error instanceof FetchError) throw error;

      // 네트워크 에러
      if (error instanceof TypeError) {
        throw new FetchError(500, "서버에 연결할 수 없습니다");
      }

      throw new FetchError(500, "알 수 없는 오류가 발생했습니다");
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const queryString = params ? `?${new URLSearchParams(params)}` : "";
    return this.request<T>(`${url}${queryString}`, { method: "GET" });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: "DELETE" });
  }

  // 인증 없이 요청 (공개 API용)
  async getPublic<T>(url: string, params?: Record<string, any>): Promise<T> {
    const originalToken = this.token;
    this.token = undefined;

    try {
      return await this.get<T>(url, params);
    } finally {
      this.token = originalToken;
    }
  }
}

export const client = new SimpleClient();

export const api = {
  get: <T>(url: string, params?: Record<string, any>) =>
    client.get<T>(url, params),
  post: <T>(url: string, data?: any) => client.post<T>(url, data),
  put: <T>(url: string, data?: any) => client.put<T>(url, data),
  delete: <T>(url: string) => client.delete<T>(url),
  getPublic: <T>(url: string, params?: Record<string, any>) =>
    client.getPublic<T>(url, params),
  setToken: (token: string) => client.setToken(token),
  clearToken: () => client.clearToken(),
};
