import {
  ProfanityCategoryOption,
  ProfanitySortOption,
} from "@/types/profanities";

const PROFANITIES_BASE_URL = "/profanities";

export const PROFANITIES_API_ENDPOINTS = {
  /**
   * 금지어 관리 API 엔드포인트
   */
  PROFANITIES: PROFANITIES_BASE_URL,
  PROFANITIES_CREATE: PROFANITIES_BASE_URL,

  PROFANITIES_UPDATE: (profanityId: number | string): string =>
    `${PROFANITIES_BASE_URL}/${profanityId}`,
  PROFANITIES_DELETE: (profanityId: number | string): string =>
    `${PROFANITIES_BASE_URL}/${profanityId}`,
};

export const PROFANITIES_CATEGORY_OPTIONS: ProfanityCategoryOption[] = [
  { label: "일반 욕설", value: "GENERAL_SWEAR" },
  { label: "성적 비하", value: "SEXUAL_DEGRADATION" },
  { label: "차별·혐오", value: "DISCRIMINATION_HATE" },
  { label: "변형 표현", value: "MODIFIED_SWEAR" },
];

export const PROFANITIES_SORT_OPTIONS: ProfanitySortOption[] = [
  { label: "등록 날짜", value: "createdAt" },
  { label: "수정 날짜", value: "updatedAt" },
  { label: "원본", value: "original" },
  { label: "ID", value: "id" },
];
