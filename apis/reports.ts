import { api } from "@/apis/client";
import {
  ReportCommentCreateRequest,
  ReportCommentCreateResponse,
  ReportListResponse,
  ReportPostCreateRequest,
  ReportPostCreateResponse,
  ReportProcessRequest,
  ReportProcessResponse,
  ReportQueryParams,
} from "@/types/reports";
import { REPORTS_API_ENDPOINTS } from "@/constants/reports";
import { cleanApiParams } from "@/lib/utils/api-params";

/**
 * 관리자용 신고 목록을 조회합니다.
 * @param params 신고 목록 조회 쿼리 파라미터
 * @return 신고 목록 조회 결과
 */
export async function getReports(
  params: ReportQueryParams
): Promise<ReportListResponse> {
  // 빈 문자열과 null/undefined 값을 제거
  const cleanParams = cleanApiParams(params);

  console.log({ params, cleanParams });
  return api.get<ReportListResponse>(
    REPORTS_API_ENDPOINTS.ADMIN_REPORTS,
    cleanParams
  );
}

/**
 * 관리자가 신고를 처리합니다.
 * @param reportId 처리할 신고 ID
 * @param body 신고 처리 요청 본문
 * @return 신고 처리 결과
 */
export async function processReport({
  reportId,
  body,
}: ReportProcessRequest): Promise<ReportProcessResponse> {
  return api.patch<ReportProcessResponse>(
    REPORTS_API_ENDPOINTS.ADMIN_REPORTS_PROCESS(reportId),
    body
  );
}

/**
 * 게시글을 신고합니다.
 * @param postId 신고할 게시글 ID
 * @param body 신고 요청 본문
 * @return 신고 접수 결과
 */
export async function createPostReport({
  postId,
  body,
}: ReportPostCreateRequest): Promise<ReportPostCreateResponse> {
  return api.post<ReportPostCreateResponse>(
    REPORTS_API_ENDPOINTS.REPORT_POST(postId),
    body
  );
}

/**
 * 댓글을 신고합니다.
 * @param commentId 신고할 댓글 ID
 * @param body 신고 요청 본문
 * @return 신고 접수 결과
 */
export async function createCommentReport({
  commentId,
  body,
}: ReportCommentCreateRequest): Promise<ReportCommentCreateResponse> {
  return api.post<ReportCommentCreateResponse>(
    REPORTS_API_ENDPOINTS.REPORT_COMMENT(commentId),
    body
  );
}
