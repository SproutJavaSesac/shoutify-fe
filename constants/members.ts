const MEMBER_API_BASE_URL = "/members";

export const MEMBER_API_ENDPOINTS = {
  /**
   * 회원 정보 조회 API 엔드포인트
   */
  MEMBER_INFO: `${MEMBER_API_BASE_URL}/me`,

  /**
   * 회원 정보 수정 API 엔드포인트
   */
  MEMBER_INFO_UPDATE: `${MEMBER_API_BASE_URL}/me`,

  /**
   * 내 게시글 목록 조회 API 엔드포인트
   */
  MEMBER_POSTS: `${MEMBER_API_BASE_URL}/me/posts`,

  /**
   * 내 댓글 목록 조회 API 엔드포인트
   */
  MEMBER_COMMENTS: `${MEMBER_API_BASE_URL}/me/comments`,

  /**
   * 내 배지 조회 API 엔드포인트
   */
  MEMBER_BADGES: `${MEMBER_API_BASE_URL}/badges`,

  /**
   * 내 랭킹 조회 API 엔드포인트
   */
  MEMBER_RANKING: `${MEMBER_API_BASE_URL}/me/rankings`,
};

export const MEMBER_ROUTES = {
  /**
   * 내 정보 수정 페이지 경로
   */
  MY_INFO_EDIT: "/profile/edit",

  /**
   * 특정 회원의 프로필 페이지 경로
   */
  MEMBER_PROFILE: (memberId: number): string => `/profile/member/${memberId}`,
};
