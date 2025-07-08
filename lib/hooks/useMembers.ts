import { useState, useEffect } from "react";
import {
  getMyInfo,
  updateMyInfo,
  getMyPosts,
  getMyComments,
} from "@/apis/members";
import type {
  MyInfoGetResponse,
  MyInfoEditRequest,
  MyInfoEditResponse,
  MyPostListResponse,
  MyCommentListResponse,
  PaginationParams,
} from "@/types/members";

// 내 정보 조회 훅
export function useMyInfo() {
  const [data, setData] = useState<MyInfoGetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMyInfo() {
      try {
        const response = await getMyInfo();
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

// 내 정보 수정 훅
export function useUpdateMyInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<MyInfoEditResponse | null>(null);

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

// 내 게시글 목록 조회 훅
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

// 내 댓글 목록 조회 훅
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
