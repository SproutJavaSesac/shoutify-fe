import { useState, useEffect } from "react";
import { MembersAPI } from "@/apis";
import type {
  MyInfoGetResponse,
  MyInfoEditRequest,
  MyInfoEditResponse,
  MyPostListResponse,
  MyCommentListResponse,
  PaginationParams,
} from "@/types";

// 내 정보 조회 훅
export function useMyInfo() {
  const [data, setData] = useState<MyInfoGetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await MembersAPI.getMyInfo();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("내 정보 조회 실패"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInfo();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchMyInfo,
  };
}

// 내 정보 수정 훅
export function useUpdateMyInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateMyInfo = async (
    data: MyInfoEditRequest,
  ): Promise<MyInfoEditResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await MembersAPI.updateMyInfo(data);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("내 정보 수정 실패");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateMyInfo,
    loading,
    error,
  };
}

// 내 게시글 목록 조회 훅
export function useMyPosts(params: PaginationParams = {}) {
  const [data, setData] = useState<MyPostListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyPosts = async (newParams?: PaginationParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await MembersAPI.getMyPosts(newParams || params);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("내 게시글 조회 실패"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [params.page, params.size]);

  // 페이지 변경
  const changePage = (page: number) => {
    fetchMyPosts({ ...params, page });
  };

  return {
    data,
    loading,
    error,
    refetch: () => fetchMyPosts(),
    changePage,
  };
}

// 내 댓글 목록 조회 훅
export function useMyComments(params: PaginationParams = {}) {
  const [data, setData] = useState<MyCommentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMyComments = async (newParams?: PaginationParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await MembersAPI.getMyComments(newParams || params);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("내 댓글 조회 실패"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComments();
  }, [params.page, params.size]);

  // 페이지 변경
  const changePage = (page: number) => {
    fetchMyComments({ ...params, page });
  };

  return {
    data,
    loading,
    error,
    refetch: () => fetchMyComments(),
    changePage,
  };
}

// 통합 마이페이지 데이터 훅
export function useMyPageData() {
  const myInfo = useMyInfo();
  const myPosts = useMyPosts({ page: 0, size: 5 }); // 최신 5개만
  const myComments = useMyComments({ page: 0, size: 5 }); // 최신 5개만

  const refetchAll = () => {
    myInfo.refetch();
    myPosts.refetch();
    myComments.refetch();
  };

  return {
    myInfo,
    myPosts,
    myComments,
    refetchAll,
    loading: myInfo.loading || myPosts.loading || myComments.loading,
  };
}
