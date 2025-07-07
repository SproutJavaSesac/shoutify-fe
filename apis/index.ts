// API 클라이언트 (명세서 기준)
export { apiClient, ApiError, ErrorCode, type ApiResponse } from "./client";

// 게시글 API
export { postsApi, PostsApi } from "./posts";

// 댓글 API
export { commentsApi, CommentsApi } from "./comments";

// 사용자 API
export { usersApi, UsersApi } from "./users";

// 반응 API
export { reactionsApi, ReactionsApi } from "./reactions";

// 랭킹 API
export { rankingsApi, RankingsApi } from "./rankings";

// 신고 API
export { reportsApi, ReportsApi } from "./reports";

// 비속어 관리 API
export { profanitiesApi, ProfanitiesApi } from "./profanities";

// 모든 API를 객체로 한번에 내보내기
export const api = {
  posts: postsApi,
  comments: commentsApi,
  users: usersApi,
  reactions: reactionsApi,
  rankings: rankingsApi,
  reports: reportsApi,
  profanities: profanitiesApi,
};

// API 타입들도 re-export
export type * from "@/types/posts";
export type * from "@/types/comments";
export type * from "@/types/users";
export type * from "@/types/reactions";
export type * from "@/types/rankings";
export type * from "@/types/reports";
export type * from "@/types/profanities";
