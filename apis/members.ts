import { api } from "./client";
import type {
  MyBadgeListResponse,
  MyCommentListResponse,
  MyInfoEditRequest,
  MyInfoEditResponse,
  MyInfoGetResponse,
  MyPostListResponse,
  MyRankingListResponse,
  PaginationParams,
} from "@/types/members";
import { MEMBER_API_ENDPOINTS } from "@/constants/members";

/**
 * 내 정보 조회
 * @returns 내 정보 데이터
 */
export const getMemberInfo = async (): Promise<MyInfoGetResponse> => {
  return api.get<MyInfoGetResponse>(MEMBER_API_ENDPOINTS.MEMBER_INFO);
};

/**
 * 내 정보 수정
 * @param data 수정할 내 정보 데이터
 * @returns 수정된 내 정보 데이터
 */
export async function updateMyInfo(
  data: MyInfoEditRequest,
): Promise<MyInfoEditResponse> {
  return api.put<MyInfoEditResponse>(
    MEMBER_API_ENDPOINTS.MEMBER_INFO_UPDATE,
    data,
  );
}

/**
 * 내 게시글 목록 조회
 * @param params 페이징 파라미터
 * @returns 내 게시글 목록 데이터
 */
export async function getMyPosts(
  params: PaginationParams,
): Promise<MyPostListResponse> {
  return api.get<MyPostListResponse>(MEMBER_API_ENDPOINTS.MEMBER_POSTS, params);
}

/**
 * 내 댓글 목록 조회
 * @param params 페이징 파라미터
 * @returns 내 댓글 목록 데이터
 */
export async function getMyComments(
  params: PaginationParams,
): Promise<MyCommentListResponse> {
  return api.get<MyCommentListResponse>(
    MEMBER_API_ENDPOINTS.MEMBER_COMMENTS,
    params,
  );
}

/**
 * 내 배지 목록 조회
 * @param params 페이징 파라미터
 * @returns 내 배지 목록 데이터
 */
export async function getMyBadges(
  params: PaginationParam,
): Promise<MyBadgeListResponse> {
  return api.get(MEMBER_API_ENDPOINTS.MEMBER_BADGES, params);
}

/**
 * 내 랭킹 조회
 * @param params 랭킹 조회 쿼리 파라미터
 * @returns 내 랭킹 목록 데이터
 */
export async function getMyRanking(
  params: MyRankingQueryParam,
): Promise<MyRankingListResponse> {
  return api.get(MEMBER_API_ENDPOINTS.MEMBER_RANKING, params);
}
