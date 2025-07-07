export interface RankedPost {
  id: number;
  title: string;
  author: string;
  authorId?: string;
  emotion: string;
  bookmarks?: number;
  reactions?: number;
  comments?: number;
  score?: number;
  trend: "up" | "down" | "same";
  rank: number;
  previousRank?: number;
}

export interface RankedUser {
  id: string;
  username: string;
  avatar?: string;
  posts: number;
  totalReactions: number;
  totalBookmarks: number;
  totalComments?: number;
  score?: number;
  trend: "up" | "down" | "same";
  rank: number;
  previousRank?: number;
}

export interface RankingsResponse {
  mostBookmarkedPosts: RankedPost[];
  mostReactedPosts: RankedPost[];
  mostActiveUsers: RankedUser[];
  specialScoreUsers: RankedUser[];
}

export interface RankingQueryParams {
  period?: "daily" | "weekly" | "monthly" | "all";
  limit?: number;
  category?: string;
}

export type RankingType =
  | "most_bookmarked"
  | "most_reacted"
  | "most_active_users"
  | "special_score";

export type RankingPeriod = "daily" | "weekly" | "monthly" | "all";
