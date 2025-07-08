export type PostSortType = "latest" | "reactions" | "comments";

export type ConceptType =
  | "all"
  | "classical_poetry"
  | "poetry"
  | "novel"
  | "drama"
  | "essay";

export interface Post {
  postId: number;
  nickname: string;
  afterTitle: string;
  afterContent: string;
  createdAt: string;
  reactionCount: number;
  commentCount: number;
  conceptType: ConceptType;
  imageUrl: string;
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
