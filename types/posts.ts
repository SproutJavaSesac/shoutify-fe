export type PostSortType = "latest" | "reactions" | "comments";

export type ConceptType =
  | "all"
  | "classical_poetry"
  | "poetry"
  | "novel"
  | "drama"
  | "essay";

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
