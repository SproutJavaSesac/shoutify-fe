import {
  ReportProcessActionTypeOption,
  ReportReasonTypeOption,
  ReportStatusTypeOption,
} from "@/types/reports";

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
  ADMIN_REPORTS_PROCESS: (reportId: string | number): string =>
    `${ADMIN_REPORTS_BASE_URL}/${reportId}`,

  // 회원
  /**
   * 게시글 신고 API 엔드포인트
   */
  REPORT_POST: (postId: string | number): string =>
    `${REPORTS_MEMBER_BASE_URL}/posts/${postId}`,

  /**
   * 댓글 신고 API 엔드포인트
   */
  REPORT_COMMENT: (commentId: string | number): string =>
    `${REPORTS_MEMBER_BASE_URL}/comments/${commentId}`,
};

/**
 * 신고 사유 옵션
 */
export const REPORT_REASON_OPTIONS: ReportReasonTypeOption[] = [
  { label: "스팸/광고", value: "SPAM" },
  { label: "욕설/비방", value: "ABUSIVE_LANGUAGE" },
  { label: "성적인 내용", value: "SEXUAL_CONTENT" },
  { label: "혐오 표현", value: "HATE_SPEECH" },
  { label: "개인정보 노출", value: "PRIVACY_VIOLATION" },
  { label: "저작권 침해", value: "COPYRIGHT_VIOLATION" },
  { label: "거짓 정보", value: "MISINFORMATION" },
  { label: "기타", value: "OTHER" },
];

/**
 * 신고 상태 옵션
 */
export const REPORT_STATUS_OPTIONS: ReportStatusTypeOption[] = [
  { label: "대기 중", value: "PENDING" },
  { label: "승인됨", value: "ACCEPTED" },
  { label: "거부됨", value: "REJECTED" },
];

/**
 * 신고 처리 결과 옵션
 */
export const REPORT_ACTION_OPTIONS: ReportProcessActionTypeOption[] = [
  { label: "승인", value: "ACCEPTED" },
  { label: "거부", value: "REJECTED" },
];
