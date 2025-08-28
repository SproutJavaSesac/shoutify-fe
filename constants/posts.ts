// 게시글 관련 상수 정의
import { CategoryOption, GenreTypeOption } from "@/types/posts";
import { EmotionOption } from "@/types/reactions";

// 카테고리 옵션 (화면 표시용 한국어 → API 통신용 영어)
export const GENRE_OPTIONS: GenreTypeOption[] = [
  { label: "현대 문학", value: "MODERN_LITERATURE" },
  { label: "고전 문학", value: "CLASSICAL_LITERATURE" },
  { label: "논평", value: "COMMENTARY" },
  { label: "칼럼", value: "COLUMN" },
  { label: "기고", value: "CONTRIBUTION" },
  { label: "서평", value: "BOOK_REVIEW" },
  { label: "힙스터 피드", value: "HIPSTER_FEED" },
  { label: "한밤중의 라디오", value: "MIDNIGHT_RADIO" },
  { label: "수필", value: "ESSAY" },
];

export const CONCEPT_OPTIONS: CategoryOption[] = [
  { label: "전체", value: "ALL" },
  {
    label: "학술/리포트",
    value: "ACADEMIC",
  },
  { label: "지적 허영/과시", value: "INTELLECTUAL_DISPLAY" },
  { label: "내 얘기를 재밌게 (SNS용)", value: "PERSONAL_STORY" },
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
