import { useEffect, useState } from "react";
import {
  getMemberInfo,
  getMyBadges,
  getMyComments,
  getMyPosts,
  getMyRanking,
  updateMyInfo,
} from "@/apis/members";
import type {
  MyBadgeListResponse,
  MyCommentListResponse,
  MyInfoEditRequest,
  MyInfoEditResponse,
  MyInfoGetResponse,
  MyPostListResponse,
  MyRankingListResponse,
  MyRankingQueryParams,
  PaginationParams,
} from "@/types/members";

/**
 * 내 정보 조회 훅
 * @returns 내 정보 데이터, 로딩 상태, 에러 정보
 */
export function useMyInfo() {
  const [data, setData] = useState<MyInfoGetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMyInfo() {
      try {
        const response = await getMemberInfo();
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyInfo();
  }, []);

  return { data, loading, error };
}

/**
 * 내 정보 수정 훅
 * @returns 내 정보 수정 함수, 수정된 데이터, 로딩 상태, 에러 정보
 */
export function useUpdateMyInfo() {
  const [data, setData] = useState<MyInfoEditResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateMyInfoHook = async (
    data: MyInfoEditRequest,
  ): Promise<MyInfoEditResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await updateMyInfo(data);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateMyInfo: updateMyInfoHook, data, loading, error };
}

/**
 * 내 게시글 목록 조회 훅
 * @param params 페이징 파라미터
 * @return 내 게시글 목록 데이터, 로딩 상태, 에러 정보
 */
export function useMyPosts(params: PaginationParams = {}) {
  const [data, setData] = useState<MyPostListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        const response = await getMyPosts(params);
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyPosts();
  }, [params.page, params.size]);

  return { data, loading, error };
}

/**
 * 내 댓글 목록 조회 훅
 * @param params 페이징 파라미터
 * @return 내 댓글 목록 데이터, 로딩 상태, 에러 정보
 */
export function useMyComments(params: PaginationParams = {}) {
  const [data, setData] = useState<MyCommentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMyComments() {
      try {
        const response = await getMyComments(params);
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyComments();
  }, [params.page, params.size]);

  return { data, loading, error };
}

/**
 * 내 배지 목록 조회 훅
 * @param params 페이징 파라미터
 * @return 내 배지 목록 데이터, 로딩 상태, 에러 정보
 */
export function useMyBadges(params: PaginationParams = {}) {
  const [data, setData] = useState<MyBadgeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMyBadges() {
      try {
        const response = await getMyBadges(params);
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyBadges();
  }, []);

  return { data, loading, error };
}

/**
 * 내 랭킹 목록 조회 훅
 * @param params 랭킹 조회 파라미터
 * @return 내 랭킹 목록 데이터, 로딩 상태, 에러 정보
 */
export function useMyRanking(params: MyRankingQueryParams) {
  const [data, setData] = useState<MyRankingListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMyRanking() {
      try {
        const response = await getMyRanking(params);
        setData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyRanking();
  }, [params.category, params.period, params.periodType]);

  return { data, loading, error };
}
