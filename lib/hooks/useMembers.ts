import { useCallback } from "react";
import { useApi, useMutation } from "./useApi";
import {
  getMemberInfo,
  getMyBadges,
  getMyComments,
  getMyPosts,
  getMyRanking,
  getUserBadges,
  getUserInfo,
  getUserPosts,
  getUserRanking,
  updateMyInfo
} from "@/apis/members";
import type {
  MyBadgeListContract,
  MyBadgeListResponse,
  MyCommentListContract,
  MyCommentListResponse,
  MyInfoEditContract,
  MyInfoEditResponse,
  MyInfoGetContract,
  MyInfoGetResponse,
  MyPostListContract,
  MyPostListResponse,
  MyRankingListContract,
  MyRankingListResponse,
  MyRankingQueryParams,
  PaginationParams,
  UserBadgeListContract,
  UserInfoGetContract,
  UserPostListContract,
  UserRankingListContract
} from "@/types/members";
import { ApiOptions, IdType } from "@/types/apis";

/**
 * 내 정보 조회 훅
 */
export function useMyInfo(options?: ApiOptions<MyInfoGetResponse>) {
  return useApi<MyInfoGetContract>(getMemberInfo, options);
}

/**
 * 사용자 정보 조회 훅
 */
export function useUserInfo(
  memberId: IdType,
  options?: ApiOptions<MyInfoGetResponse>
) {
  return useApi<UserInfoGetContract>(
    (args) => getUserInfo({ ...args, paths: { memberId } }),
    { ...options, immediate: !!memberId }
  );
}

/**
 * 내 정보 수정 훅
 */
export function useUpdateMyInfo(options?: ApiOptions<MyInfoEditResponse>) {
  return useMutation<MyInfoEditContract>((args) => updateMyInfo(args), options);
}

/**
 * 내 게시글 목록 조회 훅
 */
export function useMyPosts(
  params?: PaginationParams,
  options?: ApiOptions<MyPostListResponse>
) {
  const apiCall = useCallback(
    (args: any) => getMyPosts({ ...args, queries: params }),
    [params?.page, params?.size]
  );

  return useApi<MyPostListContract>(apiCall, options);
}

/**
 * 사용자 게시글 목록 조회 훅
 */
export function useUserPosts(
  memberId: IdType,
  params?: PaginationParams,
  options?: ApiOptions<MyPostListResponse>
) {
  return useApi<UserPostListContract>(
    (args) => getUserPosts({ ...args, paths: { memberId }, queries: params }),
    { ...options, immediate: !!memberId }
  );
}

/**
 * 내 댓글 목록 조회 훅
 */
export function useMyComments(
  params?: PaginationParams,
  options?: ApiOptions<MyCommentListResponse>
) {
  const apiCall = useCallback(
    (args: any) => getMyComments({ ...args, queries: params }),
    [params?.page, params?.size]
  );

  return useApi<MyCommentListContract>(apiCall, options);
}

/**
 * 내 배지 목록 조회 훅
 */
export function useMyBadges(
  params?: PaginationParams,
  options?: ApiOptions<MyBadgeListResponse>
) {
  return useApi<MyBadgeListContract>(
    (args) => getMyBadges({ ...args, queries: params }),
    options
  );
}

/**
 * 사용자 배지 목록 조회 훅
 */
export function useUserBadges(
  memberId: IdType,
  params?: PaginationParams,
  options?: ApiOptions<MyBadgeListResponse>
) {
  return useApi<UserBadgeListContract>(
    (args) => getUserBadges({ ...args, paths: { memberId }, queries: params }),
    { ...options, immediate: !!memberId }
  );
}

/**
 * 내 랭킹 조회 훅
 */
export function useMyRanking(
  params?: MyRankingQueryParams,
  options?: ApiOptions<MyRankingListResponse>
) {
  return useApi<MyRankingListContract>(
    (args) => getMyRanking({ ...args, queries: params }),
    options
  );
}

/**
 * 사용자 랭킹 조회 훅
 */
export function useUserRanking(
  memberId: IdType,
  params?: MyRankingQueryParams,
  options?: ApiOptions<MyRankingListResponse>
) {
  return useApi<UserRankingListContract>(
    (args) => getUserRanking({ ...args, paths: { memberId }, queries: params }),
    { ...options, immediate: !!memberId }
  );
}
