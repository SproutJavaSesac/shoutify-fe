// 게시글 관련 상수 정의
import {
  CategoryOption,
  ConceptType,
  EmotionOption,
  EmotionType,
} from "@/types/posts";

// 카테고리 옵션 (화면 표시용 한국어 → API 통신용 영어)
export const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "고전 시", value: "CLASSICAL_POETRY" },
  { label: "현대 시", value: "POETRY" },
  { label: "소설", value: "NOVEL" },
  { label: "희곡", value: "DRAMA" },
  { label: "에세이", value: "ESSAY" },
];

// 감정 옵션 (화면 표시용 한국어 → API 통신용 영어)
export const EMOTION_OPTIONS: EmotionOption[] = [
  { label: "기쁨", value: "HAPPY", color: "bg-yellow-100 text-yellow-800" },
  { label: "슬픔", value: "SAD", color: "bg-blue-100 text-blue-800" },
  { label: "분노", value: "ANGRY", color: "bg-red-100 text-red-800" },
  { label: "흥분", value: "EXCITED", color: "bg-orange-100 text-orange-800" },
  { label: "혼란", value: "CONFUSED", color: "bg-purple-100 text-purple-800" },
  { label: "자부심", value: "PROUD", color: "bg-green-100 text-green-800" },
];

// API 엔드포인트 - 함수 기반 (타입 안전성 + 재사용성)
export const API_ENDPOINTS = {
  // 기본 엔드포인트들
  POSTS: "/posts",
  POSTS_CREATE: "/posts",

  // 동적 파라미터를 받는 함수들
  POST_DETAIL: (id: number | string) => `/posts/${id}`,
  POST_UPDATE: (id: number | string) => `/posts/${id}`,
  POST_DELETE: (id: number | string) => `/posts/${id}`,
  POST_BOOKMARKS: (id: number | string) => `/posts/${id}/bookmarks`,
  POST_REACTIONS: (id: number | string) => `/posts/${id}/reactions`,
  POST_COMMENTS: (id: number | string) => `/posts/${id}/comments`,

  // 검색 엔드포인트
  POSTS_SEARCH: (
    query: string,
    category?: ConceptType,
    emotion?: EmotionType,
  ) => {
    const params = new URLSearchParams();
    params.append("q", query);
    if (category) params.append("category", category);
    if (emotion) params.append("emotion", emotion);
    return `/posts/search?${params.toString()}`;
  },
} as const;
