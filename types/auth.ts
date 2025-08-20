export type OAuth2Provider = "google" | "kakao";

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  provider?: OAuth2Provider;
  roleType: RoleType;
  profileImageUrl?: string;
  isNewUser?: boolean; // 신규 회원 여부
}

export interface LoginStatusResponse {
  isAuthenticated: boolean;
  memberId: number;
  nickname: string;
  email: string;
  roleType: RoleType;
  profileImageUrl?: string;
  isNewUser?: boolean; // 신규 회원 여부 (추가 정보 입력 필요)
}

export type RoleType = "USER" | "ADMIN" | "GUEST";

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  roleType: RoleType;
}

// 온보딩 프로필 설정 타입
export type PurposeType = "학업" | "자기계발" | "소셜";
export type ToneType =
  | "간결하고 명료한"
  | "친근하고 유머러스한"
  | "진지하고 논리적인"
  | "감성적이고 시적인";
export type AudienceType =
  | "나 자신"
  | "친구나 동료"
  | "불특정 다수"
  | "교수님, 상사";

export interface OnboardingProfile {
  purpose: PurposeType;
  tone: ToneType[];
  audience: AudienceType;
  favoriteAuthor?: string[];
  exclusions?: string[];
}

// 온보딩 프로필 설정 요청
export interface OnboardingRequest {
  nickname: string;
  bio: string;
  interests: string[];
  profileImageUrl?: string;
  profile: OnboardingProfile;
}

// 온보딩 프로필 설정 응답
export interface OnboardingResponse {
  success: boolean;
  message: string;
}
