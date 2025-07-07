export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  provider: "google" | "kakao";
  bio?: string;
  posts: number;
  totalReactions: number;
  totalBookmarks: number;
  totalComments: number;
  joinDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  posts: number;
  totalReactions: number;
  totalBookmarks: number;
  totalComments: number;
  badges: Badge[];
  joinDate: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
  earnedAt?: string;
}

export interface LoginRequest {
  provider: "google" | "kakao";
}

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  bio?: string;
  avatar?: File;
}

export interface UserStats {
  postsCount: number;
  reactionsCount: number;
  bookmarksCount: number;
  commentsCount: number;
}

export interface UserActivity {
  id: number;
  type: "post" | "comment" | "reaction" | "bookmark";
  targetId: number;
  targetTitle?: string;
  createdAt: string;
}
