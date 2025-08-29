import {
  ApiContract,
  IdType,
  Pagination,
  PaginationParams,
} from "@/types/apis";
import { ReactionDetailCountMap, ReactionLabelType } from "@/types/reactions";

export type PostSortType = "createdAt" | "reactions" | "comments";
// 게시글 작성 관련 타입 정의만 포함

export type ConceptType =
  | "ALL"
  | "ACADEMIC"
  | "INTELLECTUAL_DISPLAY"
  | "PERSONAL_STORY";

export type GenreType =
  | "MODERN_LITERATURE"
  | "CLASSICAL_LITERATURE"
  | "COMMENTARY"
  | "COLUMN"
  | "CONTRIBUTION"
  | "BOOK_REVIEW"
  | "HIPSTER_FEED"
  | "MIDNIGHT_RADIO"
  | "ESSAY";

export type EmotionType =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "EXCITED"
  | "CONFUSED"
  | "PROUD";

// 카테고리 옵션 타입
export interface CategoryOption {
  label: string;
  value: ConceptType;
}

export interface GenreTypeOption {
  label: string;
  value: GenreType;
}

export interface Post {
  postId: IdType;
  authorId?: IdType; // TODO authorId 확정되면 ? 없애기.
  nickname: string;
  beforeTitle?: string; // AI 첨삭 이전 제목
  beforeContent?: string; // AI 첨삭 이전 내용
  afterTitle: string;
  afterContent: string;
  createdAt: Date;
  imgUrl: string;
  reactionCount: number;
  commentCount: number;
  authorSelectEmotion: EmotionType;
  conceptType: ConceptType;
  genreType?: GenreType;
  isDeleted?: boolean;
  isHidden?: boolean;
  isMine?: boolean;
  reactionDetailCount?: ReactionDetailCountMap;
  myReaction?: ReactionLabelType | null; // 내 반응 정보 추가
  // AI 점수 필드들 (옵셔널)
  aiScore?: {
    conceptScore?: number;
    writingScore?: number;
    creativityScore?: number;
    emotionScore?: number;
    genreScore?: number;
    totalScore?: number;
  };
}

export type PaginationParamsType = {
  page?: number;
  size?: number;
  sort?: PostSortType;
  order?: "ASC" | "DESC";
};

export type PostPaginationQueryRequestType = PaginationParams & {
  concept?: ConceptType;
  keyword?: string;
  page: number;
  size: number;
};

/* 게시글 목록 조회 */

export interface PostPaginationQueryRequest extends PaginationParams {
  concept?: ConceptType;
  keyword?: string;
  page: number;
  size: number;
}

export interface PostPaginationResponse {
  pagination: Pagination;
  posts: Post[];
}

/** 게시글 생성 */

export type PostCreateBodyRequest = {
  title: string;
  content: string;
  conceptType: string;
  genreType: string;
  emotionType: string | null;
  imageUrl?: string;
};

export type PostCreateResponse = {
  postId: IdType;
  afterTitle: string;
  afterContent: string;
};

export type PostPreviewBodyRequest = {
  title: string;
  content: string;
  conceptType: string;
  emotionType: string | null;
  imageUrl?: string;
};

export type PostPreviewResponse = {
  beforeTitle: string;
  afterTitle: string;
  beforeContent: string;
  afterContent: string;
};

/** 게시글 상세 조회 */

// API Contract 타입 정의 (올바른 제네릭 순서: P, Q, B, R)
export type PostPaginationContract = ApiContract<
  undefined, // paths
  PostPaginationQueryRequest, // queries
  undefined, // body
  PostPaginationResponse // response
>;

export type PostDetailContract = ApiContract<
  { postId: IdType }, // paths
  undefined, // queries
  undefined, // body
  Post // response
>;

export type PostCreateContract = ApiContract<
  undefined, // paths
  undefined, // queries
  PostCreateBodyRequest, // body
  PostCreateResponse // response
>;

export type PostPreviewContract = ApiContract<
  undefined, // paths
  undefined, // queries
  PostPreviewBodyRequest, // body
  PostPreviewResponse // response
>;

export type PostDeleteContract = ApiContract<
  { postId: IdType }, // paths
  undefined, // queries
  undefined, // body
  string // response
>;

export type PostHideContract = ApiContract<
  { postId: IdType }, // paths
  undefined, // queries
  undefined, // body
  string // response
>;

export type PostUnhideContract = ApiContract<
  { postId: IdType }, // paths
  undefined, // queries
  undefined, // body
  string // response
>;
