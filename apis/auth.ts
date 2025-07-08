import { api } from "./client";
import type { LoginStatusResponse, OAuth2Provider } from "@/types/auth";

// OAuth2 로그인 시작
export function loginWithGoogle(): void {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
    "http://localhost:8080";
  window.location.href = `${backendUrl}/api/oauth2/authorization/google`;
}

// 로그인 상태 확인
export async function checkLoginStatus(): Promise<LoginStatusResponse> {
  try {
    return await api.get<LoginStatusResponse>("/auth/status");
  } catch (error: any) {
    // 500/401 에러는 로그인하지 않은 상태로 처리 (백엔드 NullPointerException)
    if (error.status === 500 || error.status === 401) {
      console.log("인증 상태: 로그인되지 않음 (userPrincipal null)");
      return { isAuthenticated: false };
    }
    throw error;
  }
}

// 로그아웃
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  api.clearToken();
}

// 토큰 저장 (로그인 후 호출)
export function saveToken(token: string): void {
  api.setToken(token);
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

// 토큰 제거 (로그아웃 시 호출)
export function removeToken(): void {
  api.clearToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

// 토큰 자동 복원 (앱 시작 시 호출)
export function restoreToken(): void {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      api.setToken(token);
    }
  }
}
