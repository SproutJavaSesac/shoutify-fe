// 첨삭 관련 상수들
export const PROOFREAD_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type ProofreadStatus =
  (typeof PROOFREAD_STATUS)[keyof typeof PROOFREAD_STATUS];

export const PROOFREAD_MESSAGES = {
  LOADING: "AI가 첨삭 중입니다...",
  SUCCESS: "첨삭이 완료되었습니다!",
  ERROR: "첨삭 중 오류가 발생했습니다.",
  RETRY: "다시 첨삭하기",
  ACCEPT: "첨삭 결과로 발행하기",
  EDIT: "다시 글 다듬기",
} as const;

// Diff 관련 상수
export const DIFF_COLORS = {
  EQUAL: "bg-transparent",
  INSERT: "bg-green-100 text-green-800",
  DELETE: "bg-red-100 text-red-800 line-through",
} as const;

export const DIFF_LABELS = {
  EQUAL: "변경 없음",
  INSERT: "추가됨",
  DELETE: "삭제됨",
} as const;

// 점수 평가 기준
export const SCORE_LEVELS = {
  EXCELLENT: { min: 90, label: "매우 좋음", color: "text-emerald-600" },
  GOOD: { min: 80, label: "좋음", color: "text-green-600" },
  FAIR: { min: 70, label: "보통", color: "text-yellow-600" },
  POOR: { min: 60, label: "개선 필요", color: "text-orange-600" },
  BAD: { min: 0, label: "많은 개선 필요", color: "text-red-600" },
} as const;

export const PROOFREAD_ROUTES = {
  CREATE: "/posts/write",
  PREVIEW: "/posts/write?step=preview",
} as const;

export const PROOFREAD_API_ENDPOINTS = {
  CREATE: "/proofreads",
  PUBLISH: (taskUuid: string) => `/proofreads/${taskUuid}/posts`,
};
