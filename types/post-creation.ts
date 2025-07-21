// 게시글 작성 관련 타입 정의만 포함

export type ConceptType =
  | "CLASSICAL_POETRY"
  | "POETRY"
  | "NOVEL"
  | "DRAMA"
  | "ESSAY";

export type EmotionType =
  | "HAPPY"
  | "SAD"
  | "ANGRY"
  | "EXCITED"
  | "CONFUSED"
  | "PROUD";

// 카테고리 옵션 타입
export interface CategoryOption {
  label: string;
  value: ConceptType;
}

// 감정 옵션 타입
export interface EmotionOption {
  label: string;
  value: EmotionType;
  color: string;
}
