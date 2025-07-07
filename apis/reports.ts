import { apiClient } from "./client";
import type {
  Report,
  CreateReportRequest,
  ProcessReportRequest,
  ReportsResponse,
  ReportQueryParams,
  ReportReason,
  ReportStatus,
  ReportType,
} from "@/types/reports";

export class ReportsApi {
  private readonly basePath = "/reports";

  // 신고 목록 조회 (관리자용)
  async getReports(params?: ReportQueryParams): Promise<ReportsResponse> {
    return apiClient.get<ReportsResponse>(this.basePath, params);
  }

  // 신고 상세 조회
  async getReport(id: number): Promise<Report> {
    return apiClient.get<Report>(`${this.basePath}/${id}`);
  }

  // 신고 접수
  async createReport(data: CreateReportRequest): Promise<Report> {
    return apiClient.post<Report>(this.basePath, data);
  }

  // 신고 처리 (관리자용)
  async processReport(data: ProcessReportRequest): Promise<Report> {
    const { reportId, ...processData } = data;
    return apiClient.put<Report>(
      `${this.basePath}/${reportId}/process`,
      processData,
    );
  }

  // 신고 삭제 (관리자용)
  async deleteReport(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // 대기 중인 신고 목록 조회
  async getPendingReports(
    page?: number,
    limit?: number,
  ): Promise<ReportsResponse> {
    return apiClient.get<ReportsResponse>(`${this.basePath}/pending`, {
      page,
      limit,
    });
  }

  // 처리된 신고 목록 조회
  async getProcessedReports(
    page?: number,
    limit?: number,
  ): Promise<ReportsResponse> {
    return apiClient.get<ReportsResponse>(`${this.basePath}/processed`, {
      page,
      limit,
    });
  }

  // 특정 게시글에 대한 신고 목록 조회
  async getPostReports(postId: number): Promise<Report[]> {
    return apiClient.get<Report[]>(`${this.basePath}/post/${postId}`);
  }

  // 특정 댓글에 대한 신고 목록 조회
  async getCommentReports(commentId: number): Promise<Report[]> {
    return apiClient.get<Report[]>(`${this.basePath}/comment/${commentId}`);
  }

  // 특정 사용자가 받은 신고 목록 조회 (관리자용)
  async getUserReports(
    userId: string,
    params?: ReportQueryParams,
  ): Promise<ReportsResponse> {
    return apiClient.get<ReportsResponse>(
      `${this.basePath}/user/${userId}`,
      params,
    );
  }

  // 사용자가 한 신고 목록 조회
  async getMyReports(params?: ReportQueryParams): Promise<ReportsResponse> {
    return apiClient.get<ReportsResponse>(
      `${this.basePath}/my-reports`,
      params,
    );
  }

  // 신고 이유 목록 조회
  async getReportReasons(): Promise<
    Array<{
      value: ReportReason;
      label: string;
      description: string;
    }>
  > {
    return apiClient.get(`${this.basePath}/reasons`);
  }

  // 신고 통계 조회 (관리자용)
  async getReportStats(period?: "daily" | "weekly" | "monthly"): Promise<{
    totalReports: number;
    pendingReports: number;
    processedReports: number;
    reportsByType: Record<ReportType, number>;
    reportsByReason: Record<string, number>;
    reportsByStatus: Record<ReportStatus, number>;
    mostReportedUsers: Array<{
      userId: string;
      username: string;
      reportCount: number;
    }>;
    mostReportedPosts: Array<{
      postId: number;
      title: string;
      reportCount: number;
    }>;
  }> {
    return apiClient.get(`${this.basePath}/stats`, { period });
  }

  // 벌크 신고 처리 (관리자용)
  async processBulkReports(
    reportIds: number[],
    action: "accept" | "reject",
    notes?: string,
  ): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/bulk-process`, {
      reportIds,
      action,
      notes,
    });
  }

  // 신고 반려 (관리자용)
  async rejectReport(reportId: number, notes?: string): Promise<Report> {
    return apiClient.put<Report>(`${this.basePath}/${reportId}/reject`, {
      notes,
    });
  }

  // 신고 승인 (관리자용)
  async acceptReport(reportId: number, notes?: string): Promise<Report> {
    return apiClient.put<Report>(`${this.basePath}/${reportId}/accept`, {
      notes,
    });
  }

  // 자동 신고 규칙 조회 (관리자용)
  async getAutoReportRules(): Promise<
    Array<{
      id: number;
      name: string;
      condition: string;
      action: "flag" | "hide" | "delete";
      isActive: boolean;
    }>
  > {
    return apiClient.get(`${this.basePath}/auto-rules`);
  }

  // 신고된 컨텐츠 자동 처리 상태 조회
  async getAutoProcessingStatus(): Promise<{
    enabled: boolean;
    rules: Array<{
      reportCount: number;
      action: "hide" | "delete";
      timeWindow: number;
    }>;
  }> {
    return apiClient.get(`${this.basePath}/auto-processing/status`);
  }
}

// API 인스턴스 생성 및 내보내기
export const reportsApi = new ReportsApi();
