export interface ProfanityWord {
  id: number;
  word: string;
  severity: "low" | "medium" | "high";
  replacement?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
}

export interface ProfanityFilter {
  id: number;
  name: string;
  description: string;
  words: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProfanityWordRequest {
  word: string;
  severity: "low" | "medium" | "high";
  replacement?: string;
}

export interface UpdateProfanityWordRequest {
  id: number;
  word?: string;
  severity?: "low" | "medium" | "high";
  replacement?: string;
  isActive?: boolean;
}

export interface CreateProfanityFilterRequest {
  name: string;
  description: string;
  words: string[];
}

export interface ProfanityCheckRequest {
  text: string;
  filterLevel?: "low" | "medium" | "high";
}

export interface ProfanityCheckResponse {
  hasViolation: boolean;
  violations: Array<{
    word: string;
    severity: "low" | "medium" | "high";
    replacement?: string;
    position: number;
  }>;
  cleanedText?: string;
}

export interface ProfanitiesResponse {
  words: ProfanityWord[];
  filters: ProfanityFilter[];
  totalCount: number;
}

export type ProfanitySeverity = "low" | "medium" | "high";
