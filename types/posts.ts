export interface Post {
  id: number;
  title: string;
  author: string;
  authorId?: string;
  time: string;
  emotion: string;
  category: string;
  preview: string;
  content?: string;
  originalContent?: string;
  transformedContent?: string;
  totalReactions: number;
  comments: number;
  bookmarks?: number;
  hasImage: boolean;
  imageUrl?: string;
  isHidden?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  emotion?: string;
  image?: File;
}

export interface UpdatePostRequest {
  id: number;
  title?: string;
  content?: string;
  category?: string;
  emotion?: string;
  isHidden?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  emotion?: string;
  search?: string;
  author?: string;
  sortBy?: "latest" | "reactions" | "bookmarks" | "comments";
}

export type PostCategory =
  | "Classical Poetry"
  | "Biblical"
  | "Modern Poem"
  | "Prose"
  | "Haiku"
  | "Sonnet"
  | "Free Verse";

export type PostEmotion =
  | "joyful"
  | "melancholy"
  | "romantic"
  | "contemplative"
  | "inspiring"
  | "nostalgic"
  | "peaceful"
  | "passionate";
