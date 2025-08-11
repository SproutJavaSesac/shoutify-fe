import { Pagination, PaginationParams } from "@/types/apis";

/**
 * 금지어 정보
 */
export interface Profanity {
  profanityId: string | number;
  original: string; // 원본 금지어
  replacement: string; // 대체어 (필터링 시 표시될 텍스트)
  description: string; // 금지어 설명
  category: string; // 금지어 분류
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 금지어 분류 타입
 */
export type ProfanityCategory =
  | "GENERAL_SWEAR" // 일반 욕설
  | "SEXUAL_DEGRADATION" // 성적 비하
  | "DISCRIMINATION_HATE" // 차별·혐오
  | "MODIFIED_SWEAR"; // 변형 표현

export type ProfanityCategoryRequestQuery = ProfanityCategory | null; 

/**
 * 금지어 분류 선택 옵션
 */
export type ProfanityCategoryOption = {
  label: string;
  value: ProfanityCategory;
};

/**
 * 금지어 생성 요청
 */
export interface ProfanityCreateRequest {
  original: string; // 금지할 단어/표현
  replacement?: string | null; // 대체어 (선택사항)
  description?: string | null; // 설명 (선택사항)
  category: ProfanityCategory; // 분류
}

export interface ProfanityCreateResponse extends Profanity {}

/**
 * 금지어 수정 요청
 */
export interface ProfanityUpdateRequest {
  profanityId: string | number;
  body: ProfanityUpdateRequestBody;
}

export interface ProfanityUpdateRequestBody {
  original?: string | null;
  replacement?: string | null;
  description?: string | null;
  category?: ProfanityCategory | null;
}

export interface ProfanityUpdateResponse extends Profanity {}

/**
 * 금지어 목록 조회 파라미터
 */
export interface ProfanityQueryParams extends PaginationParams {
  sort?: ProfanitySortType;
  category?: ProfanityCategory; // 분류별 필터링
  keyword?: string; // 키워드 검색
}

export interface ProfanityListResponse {
  pagination: Pagination;
  profanities: Profanity[];
}

export type ProfanitySortType = "createdAt" | "updatedAt" | "original" | "id";

export interface ProfanitySortOption {
  label: string;
  value: ProfanitySortType;
}
