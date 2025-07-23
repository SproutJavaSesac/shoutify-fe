export type PostSortType = "latest" | "reactions" | "comments";
// 게시글 작성 관련 타입 정의만 포함

export type ConceptType =
  | "CLASSICAL_POETRY"
  | "POETRY"
  | "NOVEL"
  | "DRAMA"
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

// 감정 옵션 타입
export interface EmotionOption {
  label: string;
  value: EmotionType;
  color: string;
}

interface ReactionDetailCountMap {
  happy: number;
  sad: number;
  angry: number;
  excited: number;
  confused: number;
  proud: number;
}

export interface Post {
  postId: number;
  nickname: string;
  afterTitle: string;
  afterContent: string;
  createdAt: Date;
  reactionCount: number;
  commentCount: number;
  conceptType: ConceptType;
  imgUrl: string;
  isHidden?: boolean;
  isMine: boolean;
  reactionDetailCount: ReactionDetailCountMap;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PostsResult {
  nextCursor?: number;
  pagination: Pagination;
  posts: Post[];
}

export interface PostsApiResponse {
  isSuccess: boolean;
  result: PostsResult;
}

export interface PostQueryParams {
  sort?: PostSortType;
  concept?: ConceptType;
  cursor?: number;
  page?: number;
  limit?: number;
  keyword?: string;
}

export type CreatePostRequest = {
  title: string;
  content: string;
  conceptType: string;
  emotionType: string | null;
  imageUrl?: string;
};

export type CreatePostResponse = {
  postId: number;
  afterTitle: string;
  afterContent: string;
};
