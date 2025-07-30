import { Pagination } from "@/types/commons";

export interface Report {
  reportId: string | number;
  reportType: ReportType;
  reporterId: string | number;
  targetId: string | number;
  reasonCode: ReportCodeType;
  reasonDetail: string;
  createdAt: string;
  postId: string | number;
  commentId: string | number;
}

interface ReportCreateResponse {
  reportId: string | number;
  reportType: ReportType;
  reasonType: ReportReasonType;
  reasonDetail: string | null;
  statusType: ReportStatusType;
  createdAt: string;
}

export interface ReportCommentCreateRequestBody {
  reasonType: ReportReasonType;
  reasonDetail?: string | null; // 직접 입력일 때 입력.
}

export interface ReportCommentCreateRequest {
  commentId: string | number;
  body: ReportCommentCreateRequestBody;
}

export interface ReportCommentCreateResponse extends ReportCreateResponse {
  commentId: string | number;
}

export interface ReportPostCreateRequestBody {
  reasonType: ReportReasonType;
  reasonDetail?: string | null; // 직접 입력일 때 입력.
}

export interface ReportPostCreateRequest {
  postId: string | number;
  body: ReportPostCreateRequestBody;
}

export interface ReportPostCreateResponse extends ReportCreateResponse {
  postId: string | number;
}

interface ReportProcessRequestBody {
  action: ReportProcessActionType;
}

export interface ReportProcessRequest {
  reportId: string | number;
  body: ReportProcessRequestBody;
}

export interface ReportProcessResponse {
  reportId: string | number;
  statusType: ReportStatusType;
  updatedAt: string;
}

export interface ReportQueryParams {
  statusType: ReportStatusType;
  page?: number;
  size?: number | null;
  sort?: ReportSortType | null;
}

export interface ReportListResponse {
  reports: Report[];
  pagination: Pagination;
}

export type ReportReasonType =
  | "부적절한 언어"
  | "혐오 발언"
  | "성적 또는 노골적인 컨텐츠"
  | "스팸 또는 광고"
  | "직접 입력";
export type ReportSortType = "latest" | "oldest";
export type ReportStatusType = "PENDING" | "DECIDED";
export type ReportType = "POST" | "CONTENT";
export type ReportCodeType = "PROFANITY" | "OTHER";
export type ReportProcessActionType = "ACCEPT" | "REJECT";
