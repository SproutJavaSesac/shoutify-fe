export const AUTH_API_ENDPOINTS = {
  /**
   * 소셜 로그인 API 엔드포인트
   */
  SOCIAL_LOGIN: (provider: string): string =>
    `/oauth2/authorization/${provider}`,

  /**
   * 로그아웃 API 엔드포인트
   */
  LOGOUT: "/auth/logout",

  /**
   * 로그인 상태 확인 API 엔드포인트
   */
  CHECK_LOGIN_STATUS: "/auth/status",

  /**
   * 회원 탈퇴 API 엔드포인트
   */
  WITHDRAW: "/members",

  /**
   * 온보딩 프로필 설정 API 엔드포인트
   */
  COMPLETE_ONBOARDING: "/auth/onboarding",
};
