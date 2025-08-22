import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  hidePost,
  previewPost,
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
  PostPreviewContract,
  PostPreviewResponse,
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
 * 게시글 미리보기 훅 (임시 mock 데이터)
 */
export function usePostPreview(options: ApiOptions<PostPreviewResponse> = {}) {
  const mutationFn = useCallback(
    async (args: MutationArgs<PostPreviewContract>) => {
      // Mock 데이터로 임시 대체
      return new Promise<PostPreviewResponse>((resolve) => {
        setTimeout(() => {
          const requestData = args as any; // 임시 타입 캐스팅
          const originalTitle = requestData.title || "원래 제목";
          const originalContent = requestData.content || "원래 내용입니다.";
          
          const mockResponse: PostPreviewResponse = {
            beforeTitle: originalTitle,
            afterTitle: `✨ ${originalTitle}에 담긴 진실한 마음 ✨`,
            beforeContent: originalContent,
            afterContent: `${originalContent}

--- AI 변환 결과 ---

위의 평범한 표현이 AI의 문학적 변환을 거쳐 아래와 같이 재탄생했습니다:

마음 깊은 곳에서 울려 퍼지는 감정의 물결이 
잔잔한 호수면에 일렁이는 파문처럼 
서서히 번져나간다. 

삶의 무게를 견디며 걸어온 발걸음들이 
모래사장에 새겨진 흔적처럼 
뒤돌아보면 아름다운 궤적을 그린다.

시간의 강물 위를 떠다니는 기억들이
별빛에 반사되어 반짝이며
영원한 이야기로 변해간다.`
          };
          resolve(mockResponse);
        }, 1500); // 1.5초 지연으로 로딩 상태 시뮬레이션
      });
    },
    []
  );

  return useMutation<PostPreviewContract>(mutationFn, options);
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
