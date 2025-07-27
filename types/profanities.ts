import { Pagination } from "@/types/commons";

export interface Profanity {
  profanityId: number;
  original: string;
  replacement: string;
  description: string;
  category: string;
}

export type ProfanityCategory =
  | "GENERAL_SWEAR"
  | "SEXUAL_DEGRADATION"
  | "DISCRIMINATION_HATE"
  | "MODIFIED_SWEAR";

export type ProfanityCategoryOption = {
  label: string;
  value: ProfanityCategory;
};

export interface ProfanityCreateRequest {
  original: string;
  replacement?: string | null;
  description?: string | null;
  category: ProfanityCategory;
}

export interface ProfanityCreateResponse extends Profanity {}

export interface ProfanityUpdateRequest {
  profanityId: number;
  body: ProfanityUpdateRequestBody;
}

export interface ProfanityUpdateRequestBody {
  original?: string | null;
  replacement?: string | null;
  description?: string | null;
  category?: ProfanityCategory | null;
}

export interface ProfanityUpdateResponse extends Profanity {}

export interface ProfanityQueryParams {
  page?: number;
  size?: number;
  sort?: ProfanitySortType;
}

export interface ProfanityListResponse {
  pagination: Pagination;
  profanities: Profanity[];
}

export type ProfanitySortType = "latest" | "oldest";

export interface ProfanitySortOption {
  label: string;
  value: ProfanitySortType;
}
