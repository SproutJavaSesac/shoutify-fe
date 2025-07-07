export interface Report {
  id: number;
  type: "post" | "comment";
  targetId: number;
  title?: string;
  postTitle?: string;
  author: string;
  authorId?: string;
  reporterId: string;
  reportCount: number;
  reasons: string[];
  content: string;
  status: "pending" | "accepted" | "rejected";
  reportedAt: string;
  processedAt?: string;
  processedBy?: string;
  notes?: string;
}

export interface CreateReportRequest {
  type: "post" | "comment";
  targetId: number;
  reason: string;
  description?: string;
}

export interface ProcessReportRequest {
  reportId: number;
  action: "accept" | "reject";
  notes?: string;
}

export interface ReportsResponse {
  reports: Report[];
  totalCount: number;
  pendingCount: number;
  processedCount: number;
}

export interface ReportQueryParams {
  status?: "pending" | "accepted" | "rejected" | "all";
  type?: "post" | "comment";
  page?: number;
  limit?: number;
  sortBy?: "reportedAt" | "reportCount" | "processedAt";
}

export type ReportReason =
  | "Inappropriate language"
  | "Hate speech"
  | "Spam/Advertisement"
  | "Harassment"
  | "Copyright violation"
  | "Other";

export type ReportStatus = "pending" | "accepted" | "rejected";
export type ReportType = "post" | "comment";
