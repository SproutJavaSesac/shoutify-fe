export type OAuth2Provider = "google" | "kakao";

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  provider?: OAuth2Provider;
  roleType: RoleType;
}

export interface LoginStatusResponse {
  isAuthenticated: boolean;
  memberId: number;
  nickname: string;
  email: string;
  roleType: RoleType;
}

export type RoleType = "USER" | "ADMIN" | "GUEST";

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  roleType: RoleType;
}
