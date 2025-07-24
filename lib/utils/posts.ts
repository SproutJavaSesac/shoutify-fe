// 게시글 작성 관련 유틸리티 함수들
import { ConceptType } from "@/types/posts";
import { CONCEPT_OPTIONS, EMOTICON_OPTIONS } from "@/constants/posts";
import { EmoticonType } from "@/types/reactions";

// 카테고리 값으로 한국어 라벨 찾기
export const getCategoryLabel = (value: ConceptType): string => {
  return (
    CONCEPT_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
};

// 감정 값으로 한국어 라벨 찾기
export const getEmotionLabel = (value: EmoticonType): string => {
  return (
    EMOTICON_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
};

// 감정 값으로 색상 클래스 찾기
export const getEmotionColor = (value: EmoticonType): string => {
  return (
    EMOTICON_OPTIONS.find((option) => option.value === value)?.color ??
    "bg-gray-100 text-gray-800"
  );
};

// 카테고리 한국어 라벨로 값 찾기 (역방향)
export const getCategoryValue = (label: string): ConceptType | undefined => {
  return CONCEPT_OPTIONS.find((option) => option.label === label)?.value;
};

// 감정 한국어 라벨로 값 찾기 (역방향)
export const getEmotionValue = (label: string): EmoticonType | undefined => {
  return EMOTICON_OPTIONS.find((option) => option.label === label)?.value;
};
