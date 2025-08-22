import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  hidePost,
  unhidePost,
} from "@/apis/posts";
import {
  ApiOptions,
  ApiPaginationArgs,
  IdType,
  MutationArgs,
  PaginationOptions,
} from "@/types/apis";
import {
  PostCreateContract,
  PostCreateResponse,
  PostDeleteContract,
  PostDetailContract,
  PostHideContract,
  PostPaginationContract,
  PostUnhideContract,
} from "@/types/posts";
import { useCallback } from "react";
import { useApi, useMutation, usePagination } from "./useApi";

/**
 * 게시글 목록 조회 훅 (페이지네이션 지원)
 */
export function usePostListFetchEffect(options: PaginationOptions = {}) {
  const fetchFn = useCallback(
    async (queries: ApiPaginationArgs<PostPaginationContract>) => {
      // 이제 queries에 모든 정보가 포함되어 있음
      return await getPosts(queries);
    },
    []
  );

  return usePagination<PostPaginationContract>(fetchFn, {
    size: 10,
    immediate: true,
    ...options,
  });
}

/**
 * 게시글 상세 조회 훅
 */
export function usePostFetchEffect({ postId }: { postId: IdType }) {
  const apiCall = useCallback(
    async () => {
      return await getPost(postId);
    },
    [postId] // postId가 변경될 때마다 새로운 함수 생성
  );

  return useApi<PostDetailContract>(apiCall, {
    immediate: true,
  });
}

/**
 * 게시글 생성 훅
 */
export function usePostCreate(options: ApiOptions<PostCreateResponse> = {}) {
  const mutationFn = useCallback(
    async (args: MutationArgs<PostCreateContract>) => {
      return await createPost(args);
    },
    []
  );

  return useMutation<PostCreateContract>(mutationFn, options);
}

/**
 * 게시글 삭제 훅
 */
export function usePostDelete(options: ApiOptions<string> = {}) {
  const mutationFn = useCallback(
    async ({ paths }: { paths: { postId: IdType } }) => {
      return await deletePost(paths.postId);
    },
    []
  );

  return useMutation<PostDeleteContract>(mutationFn, options);
}

/**
 * 게시글 숨기기 훅
 */
export function usePostHide(options: ApiOptions<string> = {}) {
  const mutationFn = useCallback(
    async ({ paths }: { paths: { postId: IdType } }) => {
      return await hidePost(paths.postId);
    },
    []
  );

  return useMutation<PostHideContract>(mutationFn, options);
}

/**
 * 게시글 숨김 해제 훅
 */
export function usePostUnhide(options: ApiOptions<string> = {}) {
  const mutationFn = useCallback(
    async ({ paths }: { paths: { postId: IdType } }) => {
      return await unhidePost(paths.postId);
    },
    []
  );

  return useMutation<PostUnhideContract>(mutationFn, options);
}
