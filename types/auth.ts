export type OAuth2Provider = "google" | "kakao";

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  provider?: OAuth2Provider;
}

export interface LoginStatusResponse {
  isAuthenticated: boolean;
  memberId?: number;
  nickname?: string;
  email?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
}
