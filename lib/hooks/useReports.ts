import {
  createCommentReport,
  createPostReport,
  getReports,
  processReport,
} from "@/apis/reports";
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

/**
 * 신고 목록을 조회하는 훅
 * @param params 신고 목록 조회 쿼리 파라미터
 * @return 신고 목록 조회 결과와 상태
 */
export function useReportList(params: ReportQueryParams) {
  const [data, setData] = useState<ReportListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getReports(params);
      setData(response);
    } catch (err: any) {
      const errorMessage =
        err.message || "신고 목록을 불러오는 중 오류가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [
    params.statusType,
    params.page,
    params.size,
    params.sort,
    params.order,
    params.reasonType,
    params.keyword,
    params.reportType,
  ]);

  return { data, loading, error, refetch };
}

/**
 * 신고를 처리하는 훅 (관리자용)
 * @returns 신고 처리 함수와 상태 정보
 */
export function useProcessReport() {
  const [data, setData] = useState<ReportProcessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async ({
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
      const errorMessage = err.message || "신고 처리 중 오류가 발생했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}

/**
 * 게시글을 신고하는 훅
 * @returns 게시글 신고 함수와 상태 정보
 */
export function useCreatePostReport() {
  const [data, setData] = useState<ReportPostCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async ({
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
      const errorMessage = err.message || "게시글 신고 중 오류가 발생했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}

/**
 * 댓글을 신고하는 훅
 * @returns 댓글 신고 함수와 상태 정보
 */
export function useCreateCommentReport() {
  const [data, setData] = useState<ReportCommentCreateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async ({
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
      const errorMessage = err.message || "댓글 신고 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.log({ error });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}
