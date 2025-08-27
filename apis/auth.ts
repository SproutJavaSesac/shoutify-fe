import { api } from "./client";
import type { LoginStatusResponse } from "@/types/auth";
import { AUTH_API_ENDPOINTS } from "@/constants/auth";

// OAuth2 로그인 시작
export function loginWithGoogle(redirectUrl?: string): void {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ??
    "http://localhost:8080";

  let loginUrl = `${backendUrl}${AUTH_API_ENDPOINTS.SOCIAL_LOGIN("google")}`;

  // 리다이렉트 URL이 있으면 state 파라미터로 전달
  if (redirectUrl) {
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    loginUrl += `?state=${encodedRedirectUrl}`;
  }

  window.location.href = loginUrl;
}

export function loginWithKakao(redirectUrl?: string): void {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ??
    "http://localhost:8080";

  let loginUrl = `${backendUrl}${AUTH_API_ENDPOINTS.SOCIAL_LOGIN("kakao")}`;

  if (redirectUrl) {
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    loginUrl += `?state=${encodedRedirectUrl}`;
  }

  window.location.href = loginUrl;
}

// 로그인 상태 확인
export async function checkLoginStatus(): Promise<LoginStatusResponse> {
  try {
    return await api.get<LoginStatusResponse>(
      AUTH_API_ENDPOINTS.CHECK_LOGIN_STATUS,
    );
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
  await api.post(AUTH_API_ENDPOINTS.LOGOUT);
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

// 탈퇴
export async function deleteAccount(): Promise<string> {
  const response = await api.delete<string>(AUTH_API_ENDPOINTS.WITHDRAW);
  removeToken(); // 계정 삭제 후 토큰 제거
  return response;
}
