// 게시글 관련 상수 정의
import { CategoryOption } from "@/types/posts";
import { EmotionOption } from "@/types/reactions";

// 카테고리 옵션 (화면 표시용 한국어 → API 통신용 영어)
export const CONCEPT_OPTIONS: CategoryOption[] = [
  { label: "전체", value: "ALL" },
  { label: "고전 시가", value: "CLASSICAL_POETRY" },
  { label: "시", value: "POETRY" },
  { label: "소설", value: "NOVEL" },
  { label: "희곡", value: "DRAMA" },
  { label: "에세이", value: "ESSAY" },
];

// 감정 옵션 (화면 표시용 한국어 → API 통신용 영어)
export const EMOTICON_OPTIONS: EmotionOption[] = [
  {
    label: "기쁨",
    emotionType: "❤️",
    value: "HAPPY",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    label: "슬픔",
    emotionType: "😢",
    value: "SAD",
    color: "bg-blue-100 text-blue-800",
  },
  {
    label: "분노",
    emotionType: "😠",
    value: "ANGRY",
    color: "bg-red-100 text-red-800",
  },
  {
    label: "흥분",
    emotionType: "🎉",
    value: "EXCITED",
    color: "bg-orange-100 text-orange-800",
  },
  {
    label: "혼란",
    emotionType: "🤔",
    value: "CONFUSED",
    color: "bg-purple-100 text-purple-800",
  },
  {
    label: "자부심",
    emotionType: "👏",
    value: "PROUD",
    color: "bg-green-100 text-green-800",
  },
];

// API 엔드포인트 - 함수 기반 (타입 안전성 + 재사용성)
export const POST_API_ENDPOINTS = {
  // 기본 엔드포인트들
  POSTS: "/posts",
  POSTS_CREATE: "/posts",
  POSTS_PREVIEW: "/posts/preview",

  // 동적 파라미터를 받는 함수들
  POST_DETAIL: (id: number | string): string => `/posts/${id}`,
  POST_DELETE: (id: number | string): string => `/posts/${id}`,
  POST_HIDE: (id: number | string): string => `/posts/${id}/hide`,
  POST_UNHIDE: (id: number | string): string => `/posts/${id}/unhide`,
} as const;

// 게시글 관련 프론트 url 경로
export const POST_ROUTES = {
  LIST: "/posts",
  CREATE: "/posts/write",
  DETAIL: (postId: number | string) => `/posts/${postId}`,
} as const;
