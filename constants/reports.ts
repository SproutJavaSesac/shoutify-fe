const REPORTS_MEMBER_BASE_URL = "/reports";
const ADMIN_REPORTS_BASE_URL = "/admin/reports";

export const REPORTS_API_ENDPOINTS = {
  // 관리자
  /**
   * 관리자 신고 목록 조회 API 엔드포인트
   */
  ADMIN_REPORTS: ADMIN_REPORTS_BASE_URL,

  /**
   * 관리자 신고 처리 API 엔드포인트
   */
  ADMIN_REPORTS_PROCESS: (reportId: number): string =>
    `${ADMIN_REPORTS_BASE_URL}/${reportId}`,

  // 회원
  /**
   * 게시글 신고 API 엔드포인트
   */
  REPORT_POST: (postId: number): string =>
    `${REPORTS_MEMBER_BASE_URL}/posts/${postId}`,

  /**
   * 댓글 신고 API 엔드포인트
   */
  REPORT_COMMENT: (commentId: number): string =>
    `${REPORTS_MEMBER_BASE_URL}/comments/${commentId}`,
};
