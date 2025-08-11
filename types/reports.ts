import { IdType, Pagination, PaginationParams } from "@/types/apis";

/**
 * 신고 정보
 */
export interface Report {
  reportId: string | number;
  reportType: ReportType; // 신고 대상 타입 (게시글/댓글)
  reporterId: string | number; // 신고자 ID
  reporterNickname?: string; // 신고자 닉네임 TODO 생기면 삭제.
  postId?: IdType;
  commentId?: IdType;
  reasonType: ReportReasonType; // 신고 사유 타입 (reasonCode에서 변경)
  reasonDetail: string; // 신고 상세 사유
  statusType: ReportStatusType; // 처리 상태
  createdAt: string;
  updatedAt?: string;
  reportCount: number;
}

/**
 * 신고 생성 응답 기본 인터페이스
 */
interface ReportCreateResponse {
  reportId: string | number;
  reportType: ReportType;
  reasonType: ReportReasonType;
  reasonDetail: string | null;
  statusType: ReportStatusType;
  createdAt: string;
}

/**
 * 댓글 신고 요청 본문
 */
export interface ReportCommentCreateRequestBody {
  reasonType: ReportReasonType;
  reasonDetail?: string | null; // 기타 선택 시 상세 내용
}

/**
 * 댓글 신고 요청
 */
export interface ReportCommentCreateRequest {
  commentId: string | number;
  body: ReportCommentCreateRequestBody;
}

/**
 * 댓글 신고 응답
 */
export interface ReportCommentCreateResponse extends ReportCreateResponse {
  commentId: string | number;
}

/**
 * 게시글 신고 요청 본문
 */
export interface ReportPostCreateRequestBody {
  reasonType: ReportReasonType;
  reasonDetail?: string | null; // 기타 선택 시 상세 내용
}

/**
 * 게시글 신고 요청
 */
export interface ReportPostCreateRequest {
  postId: string | number;
  body: ReportPostCreateRequestBody;
}

/**
 * 게시글 신고 응답
 */
export interface ReportPostCreateResponse extends ReportCreateResponse {
  postId: string | number;
}

/**
 * 신고 처리 요청 본문 (관리자용)
 */
interface ReportProcessRequestBody {
  action: ReportProcessActionType; // 처리 액션
  adminNote?: string; // 관리자 메모 (선택사항)
}

/**
 * 신고 처리 요청 (관리자용)
 */
export interface ReportProcessRequest {
  reportId: string | number;
  body: ReportProcessRequestBody;
}

/**
 * 신고 목록 요청 (관리자용)
 */
export interface ReportListRequest extends PaginationParams {
  sort?: ReportSortType;
  statusType?: ReportStatusType;
  reasonType?: ReportReasonType;
  keyword?: string;
}

/**
 * 신고 목록 응답 (관리자용)
 */
export interface ReportListResponse {
  reports: Report[];
  pagination: Pagination;
}

/**
 * 신고 처리 응답
 */
export interface ReportProcessResponse {
  reportId: string | number;
  statusType: ReportStatusType;
  processedAt: string;
  adminNote?: string;
}

/**
 * 신고 목록 조회 파라미터
 */
export interface ReportQueryParams extends PaginationParams {
  statusType?: ReportStatusType | null; // 처리 상태별 필터
  reportType?: ReportType | null; // 신고 타입별 필터
  reasonType?: ReportReasonType | null; // 신고 사유별 필터
  sort?: ReportSortType;
  // order는 PaginationParams에서 상속받음 ("ASC" | "DESC")
  keyword?: string; // 검색 키워드
}

/**
 * 신고 목록 응답
 */
export interface ReportListResponse {
  reports: Report[];
  pagination: Pagination;
  summary?: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

// ==================== 타입 정의 ====================

/**
 * 신고 사유 타입
 */
export type ReportReasonType =
  | "SPAM" // 스팸/광고
  | "ABUSIVE_LANGUAGE" // 욕설/비방
  | "SEXUAL_CONTENT" // 성적인 내용
  | "HATE_SPEECH" // 혐오 표현
  | "PRIVACY_VIOLATION" // 개인정보 노출
  | "COPYRIGHT_VIOLATION" // 저작권 침해
  | "MISINFORMATION" // 거짓 정보
  | "OTHER"; // 기타

export type ReportReasonTypeOption = {
  label: string;
  value: ReportReasonType;
};
/**
 * 신고 정렬 타입
 */
export type ReportSortType = "createdAt" | "updatedAt";

/**
 * 신고 정렬 옵션
 */
export type ReportSortTypeOption = {
  label: string;
  value: ReportSortType;
};

/**
 * 신고 상태 타입
 */
export type ReportStatusType =
  | "PENDING" // 대기 중
  | "ACCEPTED" // 승인됨
  | "REJECTED"; // 거부됨

export type ReportStatusTypeOption = {
  label: string;
  value: ReportStatusType;
};

/**
 * 신고 대상 타입
 */
export type ReportType = "POST" | "COMMENT";

export type ReportTypeOption = {
  label: string;
  value: ReportType;
};
/**
 * 신고 처리 액션 타입
 */
export type ReportProcessActionType =
  | "ACCEPTED" // 콘텐츠 삭제
  | "REJECTED"; // 신고 기각

export type ReportProcessActionTypeOption = {
  label: string;
  value: ReportProcessActionType;
};
