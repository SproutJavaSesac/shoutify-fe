// 내 정보 조회 응답
import { ApiContract, IdType, Pagination } from "@/types/apis";
import { RankingCategoryType, RankingPeriodType } from "@/types/rankings";

export interface MyInfoGetResponse {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string; // TODO 추후 ? 제거 필요.
  postCount: number;
  reactionCount: number; // 임시: 하드코딩된 값
  commentCount: number;
}

// 내 정보 수정 요청
export interface MyInfoEditRequest {
  nickname: string;
}

// 내 정보 수정 응답
export interface MyInfoEditResponse {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string; // TODO 추후 ? 제거 필요.
}

// 내 게시글 요약 정보
export interface MyPostSummary {
  postId: number;
  beforeTitle: string;
  afterTitle: string;
  beforeContent: string;
  afterContent: string;
  createdAt: string;
  emotionType: string;
  conceptType: string;
  reactionCount: number; // 임시: 하드코딩된 값
  commentCount: number; // 임시: 하드코딩된 값
  imageUrl?: string; // TODO 추후 ? 제거 필요.
  isHidden: boolean;
}

// 내 게시글 목록 응답
export interface MyPostListResponse {
  posts: MyPostSummary[];
  pagination: Pagination;
}

// 내 댓글 요약 정보
export interface MyCommentSummary {
  commentId: number;
  postId: number;
  postTitle: string;
  beforeContent: string;
  afterContent: string;
  reactionCount: number; // 임시: 하드코딩된 값
  createdAt: string;
}

// 내 댓글 목록 응답
export interface MyCommentListResponse {
  comments: MyCommentSummary[];
  pagination: Pagination;
}

export interface MyBadgeSummary {
  badgeId: number;
  name: string;
  description: string;
  iconUrl: string;
  isEarned: boolean; // 배지가 획득되었는지 여부
  createdAt?: string | null; // 배지를 획득한 날짜 (선택적)
}

export interface MyBadgeTotalSummary {
  totalBadges: number; // 총 배지 개수
  earnedBadges: number; // 획득한 배지 개수
}

// 내 배지 목록 응답
export interface MyBadgeListResponse {
  summaries: MyBadgeTotalSummary[];
  badges: MyBadgeSummary[];
}

export interface MyRankingQueryParams {
  category: RankingCategoryType;
  period: number; // 랭킹 조회 기간 (최대 30개)
  periodType: RankingPeriodType;
}

export interface RankingSummary {
  categoryValue: number;
  rank: number;
  previousRank: number;
  rankChange: string;
}

// 내 랭킹 목록 응답
export interface MyRankingListResponse {
  category: RankingCategoryType;
  maxCount: number;
  periodType: RankingPeriodType;
  rankings: RankingSummary[];
}

// 페이지네이션 쿼리 파라미터
export interface PaginationParams {
  page?: number;
  size?: number;
}

// ===== API Contract 정의 =====

/** 내 정보 조회 API 계약 */
export type MyInfoGetContract = ApiContract<
  never,
  never,
  never,
  MyInfoGetResponse
>;

/** 사용자 정보 조회 API 계약 */
export type UserInfoGetContract = ApiContract<
  { memberId: IdType },
  never,
  never,
  MyInfoGetResponse
>;

/** 내 정보 수정 API 계약 */
export type MyInfoEditContract = ApiContract<
  never,
  never,
  MyInfoEditRequest,
  MyInfoEditResponse
>;

/** 내 게시글 목록 조회 API 계약 */
export type MyPostListContract = ApiContract<
  never,
  PaginationParams,
  never,
  MyPostListResponse
>;

/** 사용자 게시글 목록 조회 API 계약 */
export type UserPostListContract = ApiContract<
  { memberId: IdType },
  PaginationParams,
  never,
  MyPostListResponse
>;

/** 내 댓글 목록 조회 API 계약 */
export type MyCommentListContract = ApiContract<
  never,
  PaginationParams,
  never,
  MyCommentListResponse
>;

/** 내 배지 목록 조회 API 계약 */
export type MyBadgeListContract = ApiContract<
  never,
  PaginationParams,
  never,
  MyBadgeListResponse
>;

/** 사용자 배지 목록 조회 API 계약 */
export type UserBadgeListContract = ApiContract<
  { memberId: IdType },
  PaginationParams,
  never,
  MyBadgeListResponse
>;

/** 내 랭킹 조회 API 계약 */
export type MyRankingListContract = ApiContract<
  never,
  MyRankingQueryParams,
  never,
  MyRankingListResponse
>;

/** 사용자 랭킹 조회 API 계약 */
export type UserRankingListContract = ApiContract<
  { memberId: IdType },
  MyRankingQueryParams,
  never,
  MyRankingListResponse
>;
