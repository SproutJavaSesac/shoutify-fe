// 모든 도메인 타입 re-export
export * from "./posts";
export * from "./comments";
export * from "./users";
export * from "./reactions";
export * from "./rankings";
export * from "./reports";
export * from "./profanities";

// API 클라이언트 타입 re-export (명세서 기준)
export { ApiResponse, ApiError, ErrorCode } from "../apis/client";

// 공통 상수들
export const POST_CATEGORIES = [
  "Classical Poetry",
  "Biblical",
  "Modern Poem",
  "Prose",
  "Haiku",
  "Sonnet",
  "Free Verse",
] as const;

export const POST_EMOTIONS = [
  "joyful",
  "melancholy",
  "romantic",
  "contemplative",
  "inspiring",
  "nostalgic",
  "peaceful",
  "passionate",
] as const;

export const REACTION_EMOJIS = ["❤️", "😊", "😢", "🤔", "👏"] as const;

export const REPORT_REASONS = [
  "Inappropriate language",
  "Hate speech",
  "Spam/Advertisement",
  "Harassment",
  "Copyright violation",
  "Other",
] as const;

export const PROFANITY_SEVERITIES = ["low", "medium", "high"] as const;

// 감정별 색상 매핑
export const EMOTION_COLORS = {
  melancholy: "bg-blue-100 text-blue-800",
  joyful: "bg-yellow-100 text-yellow-800",
  contemplative: "bg-purple-100 text-purple-800",
  romantic: "bg-pink-100 text-pink-800",
  inspiring: "bg-green-100 text-green-800",
  peaceful: "bg-teal-100 text-teal-800",
  nostalgic: "bg-orange-100 text-orange-800",
  passionate: "bg-red-100 text-red-800",
} as const;

// 페이징 기본값
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// API 설정 (명세서 기준 - REST API 준수)
export const API_ENDPOINTS = {
  // 게시글 관련
  POSTS: "/posts",
  POST_DETAIL: "/posts/:id",
  POST_BOOKMARKS: "/posts/:id/bookmarks",
  POST_REACTIONS: "/posts/:id/reactions",

  // 댓글 관련
  COMMENTS: "/comments",
  COMMENT_DETAIL: "/comments/:id",
  COMMENT_REACTIONS: "/comments/:id/reactions",
  POST_COMMENTS: "/posts/:id/comments",

  // 사용자 관련
  USERS: "/users",
  USER_DETAIL: "/users/:id",
  USER_PROFILE: "/users/:id/profile",
  USER_POSTS: "/users/:id/posts",
  USER_COMMENTS: "/users/:id/comments",
  USER_BOOKMARKS: "/users/:id/bookmarks",

  // 인증 관련
  AUTH: "/auth",
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_ME: "/auth/me",

  // 반응 관련
  REACTIONS: "/reactions",

  // 랭킹 관련
  RANKINGS: "/rankings",
  RANKINGS_POSTS: "/rankings/posts",
  RANKINGS_USERS: "/rankings/users",

  // 신고 관련
  REPORTS: "/reports",
  REPORT_DETAIL: "/reports/:id",

  // 비속어 관리 관련
  PROFANITIES: "/profanities",
  PROFANITY_CHECK: "/profanities/check",
  PROFANITY_WORDS: "/profanities/words",
  PROFANITY_FILTERS: "/profanities/filters",
} as const;
