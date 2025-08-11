// 게시글 작성 관련 유틸리티 함수들
import { ConceptType, EmotionType } from "@/types/posts";
import { CONCEPT_OPTIONS, EMOTICON_OPTIONS } from "@/constants/posts";
import { EmotionOption, ReactionLabelType } from "@/types/reactions";

// 카테고리 값으로 한국어 라벨 찾기
export const getCategoryLabel = (value: ConceptType): string => {
  return (
    CONCEPT_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
};

// 감정 값으로 한국어 라벨 찾기
export const getEmotionLabel = (value: ReactionLabelType): string => {
  return (
    EMOTICON_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
};

// 감정 값으로 색상 클래스 찾기
export const getEmotionColor = (value: ReactionLabelType): string => {
  return (
    EMOTICON_OPTIONS.find((option) => option.value === value)?.color ??
    "bg-gray-100 text-gray-800"
  );
};

// EMOTIONTYPE 감정 값을 EMOTICON_OPTIONS 타입으로 변경하기
export const convertEmotionTypeToEmoticon = (
  emotion: EmotionType,
): EmotionOption | null => {
  if (!emotion) return null;

  const emoticonOption = EMOTICON_OPTIONS.find(
    (option) => option.value === emotion,
  );

  if (!emoticonOption) {
    console.warn(`No emoticon found for emotion type: ${emotion}`);
    return null;
  }

  return emoticonOption;
};

// 카테고리 한국어 라벨로 값 찾기 (역방향)
export const getCategoryValue = (label: string): ConceptType | undefined => {
  return CONCEPT_OPTIONS.find((option) => option.label === label)?.value;
};

// 감정 한국어 라벨로 값 찾기 (역방향)
export const getEmotionValue = (
  label: string,
): ReactionLabelType | undefined => {
  return EMOTICON_OPTIONS.find((option) => option.label === label)?.value;
};
