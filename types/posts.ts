import { ReactionDetailCountMap } from "@/types/reactions";
import { Pagination } from "@/types/apis";

export type PostSortType = "createdAt" | "reactions" | "comments";
// 게시글 작성 관련 타입 정의만 포함

export type ConceptType =
  | "ALL"
  | "CLASSICAL_POETRY"
  | "POETRY"
  | "NOVEL"
  | "DRAMA"
  | "ESSAY";

// 카테고리 옵션 타입
export interface CategoryOption {
  label: string;
  value: ConceptType;
}

export interface Post {
  postId: number;
  nickname: string;
  afterTitle: string;
  afterContent: string;
  createdAt: Date;
  imgUrl: string;
  reactionCount: number;
  commentCount: number;
  conceptType: ConceptType;
  isHidden?: boolean;
  isMine?: boolean;
  reactionDetailCount?: ReactionDetailCountMap;
}

export interface PostListResponse {
  nextCursor?: number;
  pagination: Pagination;
  posts: Post[];
}

export interface PostQueryParams {
  sort?: PostSortType;
  concept?: ConceptType;
  cursor?: number;
  page?: number;
  size?: number;
  keyword?: string;
}

export type PostCreateRequest = {
  title: string;
  content: string;
  conceptType: string;
  emotionType: string | null;
  imageUrl?: string;
};

export type PostCreateResponse = {
  postId: number;
  afterTitle: string;
  afterContent: string;
};
