import { MEMBER_API_ENDPOINTS } from "@/constants/members";
import { ApiQueryArgs, MutationArgs } from "@/types/apis";
import type {
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
  UserBadgeListContract,
  UserInfoGetContract,
  UserPostListContract,
  UserRankingListContract,
} from "@/types/members";
import { api } from "./client";

/**
 * 내 정보 조회
 */
export const getMemberInfo = async (
  args?: ApiQueryArgs<MyInfoGetContract>
): Promise<MyInfoGetResponse> => {
  return api.get<MyInfoGetResponse>(MEMBER_API_ENDPOINTS.MEMBER_INFO);
};

/**
 * 사용자 정보 조회
 */
export const getUserInfo = async (
  args: ApiQueryArgs<UserInfoGetContract>
): Promise<MyInfoGetResponse> => {
  return api.public.get<MyInfoGetResponse>(`/members/${args.paths?.memberId}`);
};

/**
 * 내 정보 수정
 */
export async function updateMyInfo(
  args: MutationArgs<MyInfoEditContract>
): Promise<MyInfoEditResponse> {
  return api.put<MyInfoEditResponse>(
    MEMBER_API_ENDPOINTS.MEMBER_INFO_UPDATE,
    args.body
  );
}

/**
 * 내 게시글 목록 조회
 */
export async function getMyPosts(
  args?: ApiQueryArgs<MyPostListContract>
): Promise<MyPostListResponse> {
  return api.get<MyPostListResponse>(
    MEMBER_API_ENDPOINTS.MEMBER_POSTS,
    args?.queries
  );
}

/**
 * 사용자 게시글 목록 조회
 */
export async function getUserPosts(
  args: ApiQueryArgs<UserPostListContract>
): Promise<MyPostListResponse> {
  return api.public.get<MyPostListResponse>(
    `/members/${args.paths?.memberId}/posts`,
    args.queries
  );
}

/**
 * 내 댓글 목록 조회
 */
export async function getMyComments(
  args?: ApiQueryArgs<MyCommentListContract>
): Promise<MyCommentListResponse> {
  return api.get<MyCommentListResponse>(
    MEMBER_API_ENDPOINTS.MEMBER_COMMENTS,
    args?.queries
  );
}

/**
 * 내 배지 목록 조회
 */
export async function getMyBadges(): Promise<MyBadgeListResponse> {
  return api.get(MEMBER_API_ENDPOINTS.MEMBER_BADGES);
}

/**
 * 사용자 배지 목록 조회
 */
export async function getUserBadges(
  args: ApiQueryArgs<UserBadgeListContract>
): Promise<MyBadgeListResponse> {
  return api.public.get(
    `/members/${args.paths?.memberId}/badges`,
    args.queries
  );
}

/**
 * 내 랭킹 조회
 */
export async function getMyRanking(
  args?: ApiQueryArgs<MyRankingListContract>
): Promise<MyRankingListResponse> {
  return api.get(MEMBER_API_ENDPOINTS.MEMBER_RANKING, args?.queries);
}

/**
 * 사용자 랭킹 조회
 */
export async function getUserRanking(
  args: ApiQueryArgs<UserRankingListContract>
): Promise<MyRankingListResponse> {
  return api.public.get(
    `/members/${args.paths?.memberId}/rankings`,
    args.queries
  );
}
