import { Pagination } from "@/types/commons";

export interface Report {
  reportId: number;
  reportType: ReportType;
  reporterId: number;
  targetId: number;
  reasonCode: ReportCodeType;
  reasonDetail: string;
  createdAt: string;
  postId: number;
  commentId: number;
}

interface ReportCreateResponse {
  reportId: number;
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
  commentId: number;
  body: ReportCommentCreateRequestBody;
}

export interface ReportCommentCreateResponse extends ReportCreateResponse {
  commentId: number;
}

export interface ReportPostCreateRequestBody {
  reasonType: ReportReasonType;
  reasonDetail?: string | null; // 직접 입력일 때 입력.
}

export interface ReportPostCreateRequest {
  postId: number;
  body: ReportPostCreateRequestBody;
}

export interface ReportPostCreateResponse extends ReportCreateResponse {
  postId: number;
}

interface ReportProcessRequestBody {
  action: ReportProcessActionType;
}

export interface ReportProcessRequest {
  reportId: number;
  body: ReportProcessRequestBody;
}

export interface ReportProcessResponse {
  reportId: number;
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
