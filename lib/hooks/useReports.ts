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
import { useEffect, useState } from "react";
import {
  createCommentReport,
  createPostReport,
  getReports,
  processReport,
} from "@/apis/reports";

/**
 * 신고 전체 목록을 조회하는 훅
 * @param params 신고 목록 조회 쿼리 파라미터
 * @return 신고 목록 조회 결과와 상태
 */
export function useReportList(params: ReportQueryParams) {
  const [data, setData] = useState<ReportListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);

        const response = await getReports(params);
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [params.statusType, params.page, params.size, params.sort]);

  return { data, loading, error };
}

/**
 * 신고를 처리하는 훅
 * @returns 신고 처리 함수와 성공, 로딩, 실패 상태 정보
 */
export function useProcessReport() {
  const [data, setData] = useState<ReportProcessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const processReportHook = async ({
    reportId,
    body,
  }: ReportProcessRequest): Promise<ReportProcessResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await processReport({ reportId, body });
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { processReport: processReportHook, data, loading, error };
}

/**
 * 게시글 신고하기 훅
 * @returns 게시글 신고 함수와 성공, 로딩, 실패 상태 정보
 */
export function useCreatePostReport() {
  const [data, setData] = useState<ReportPostCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPostReportHook = async ({
    postId,
    body,
  }: ReportPostCreateRequest): Promise<ReportPostCreateResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await createPostReport({ postId, body });
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createPostReport: createPostReportHook, data, loading, error };
}

/**
 * 댓글 신고하기 훅
 * @returns 댓글 신고 함수와 성공, 로딩, 실패 상태 정보
 */
export function useCreateCommentReport() {
  const [data, setData] = useState<ReportCommentCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCommentReportHook = async ({
    commentId,
    body,
  }: ReportCommentCreateRequest): Promise<ReportCommentCreateResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await createCommentReport({ commentId, body });
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createCommentReport: createCommentReportHook, data, loading, error };
}
