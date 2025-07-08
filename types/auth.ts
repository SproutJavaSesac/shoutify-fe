// 인증 관련 타입들 (백엔드 API 기준)

// 로그인 상태 확인 응답 (임시 API)
export interface LoginStatusResponse {
  isAuthenticated: boolean;
  memberId?: number; // 로그인하지 않은 경우 undefined
  nickname?: string; // 로그인하지 않은 경우 undefined
  email?: string; // 로그인하지 않은 경우 undefined
}

// OAuth2 로그인 타입
export type OAuth2Provider = "google" | "kakao";

// 로그인 상태
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
}

// 인증된 사용자 정보
export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}
