import { CONCEPT_OPTIONS, EMOTION_OPTIONS } from "./posts";

export { CONCEPT_OPTIONS, EMOTION_OPTIONS };

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
