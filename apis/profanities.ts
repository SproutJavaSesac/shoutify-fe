import { apiClient } from "./client";
import type {
  ProfanityWord,
  ProfanityFilter,
  CreateProfanityWordRequest,
  UpdateProfanityWordRequest,
  CreateProfanityFilterRequest,
  ProfanityCheckRequest,
  ProfanityCheckResponse,
  ProfanitiesResponse,
  ProfanitySeverity,
} from "@/types/profanities";

export class ProfanitiesApi {
  private readonly basePath = "/profanities";

  // 비속어 단어 목록 조회
  async getProfanityWords(
    page?: number,
    limit?: number,
    severity?: ProfanitySeverity,
  ): Promise<{
    words: ProfanityWord[];
    totalCount: number;
  }> {
    const params = { page, limit, severity };
    return apiClient.get(`${this.basePath}/words`, params);
  }

  // 비속어 단어 추가
  async createProfanityWord(
    data: CreateProfanityWordRequest,
  ): Promise<ProfanityWord> {
    return apiClient.post<ProfanityWord>(`${this.basePath}/words`, data);
  }

  // 비속어 단어 수정
  async updateProfanityWord(
    data: UpdateProfanityWordRequest,
  ): Promise<ProfanityWord> {
    const { id, ...updateData } = data;
    return apiClient.put<ProfanityWord>(
      `${this.basePath}/words/${id}`,
      updateData,
    );
  }

  // 비속어 단어 삭제
  async deleteProfanityWord(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/words/${id}`);
  }

  // 비속어 단어 활성화/비활성화
  async toggleProfanityWord(
    id: number,
    isActive: boolean,
  ): Promise<ProfanityWord> {
    return apiClient.patch<ProfanityWord>(
      `${this.basePath}/words/${id}/toggle`,
      { isActive },
    );
  }

  // 비속어 필터 목록 조회
  async getProfanityFilters(): Promise<ProfanityFilter[]> {
    return apiClient.get<ProfanityFilter[]>(`${this.basePath}/filters`);
  }

  // 비속어 필터 생성
  async createProfanityFilter(
    data: CreateProfanityFilterRequest,
  ): Promise<ProfanityFilter> {
    return apiClient.post<ProfanityFilter>(`${this.basePath}/filters`, data);
  }

  // 비속어 필터 수정
  async updateProfanityFilter(
    id: number,
    data: Partial<CreateProfanityFilterRequest>,
  ): Promise<ProfanityFilter> {
    return apiClient.put<ProfanityFilter>(
      `${this.basePath}/filters/${id}`,
      data,
    );
  }

  // 비속어 필터 삭제
  async deleteProfanityFilter(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/filters/${id}`);
  }

  // 텍스트 비속어 검사
  async checkProfanity(
    data: ProfanityCheckRequest,
  ): Promise<ProfanityCheckResponse> {
    return apiClient.post<ProfanityCheckResponse>(
      `${this.basePath}/check`,
      data,
    );
  }

  // 비속어 제거 및 대체
  async cleanText(
    text: string,
    replaceWith?: string,
  ): Promise<{ cleanedText: string; violations: string[] }> {
    return apiClient.post(`${this.basePath}/clean`, { text, replaceWith });
  }

  // 벌크 비속어 단어 추가
  async addBulkProfanityWords(
    words: Array<{
      word: string;
      severity: ProfanitySeverity;
      replacement?: string;
    }>,
  ): Promise<{ added: number; skipped: number; errors: string[] }> {
    return apiClient.post(`${this.basePath}/words/bulk`, { words });
  }

  // 비속어 단어 가져오기 (외부 소스에서)
  async importProfanityWords(
    source: string,
  ): Promise<{ imported: number; errors: string[] }> {
    return apiClient.post(`${this.basePath}/words/import`, { source });
  }

  // 비속어 단어 내보내기
  async exportProfanityWords(format: "json" | "csv" | "txt"): Promise<Blob> {
    const response = await fetch(
      `${apiClient["baseURL"]}${this.basePath}/words/export?format=${format}`,
      {
        headers: apiClient["defaultHeaders"],
      },
    );
    return response.blob();
  }

  // 비속어 통계 조회
  async getProfanityStats(): Promise<{
    totalWords: number;
    activeWords: number;
    wordsBySeverity: Record<ProfanitySeverity, number>;
    totalFilters: number;
    activeFilters: number;
    recentViolations: number;
    mostViolatedWords: Array<{
      word: string;
      count: number;
    }>;
  }> {
    return apiClient.get(`${this.basePath}/stats`);
  }

  // 비속어 검출 설정 조회
  async getProfanitySettings(): Promise<{
    enableFilter: boolean;
    defaultSeverity: ProfanitySeverity;
    autoReplace: boolean;
    defaultReplacement: string;
    strictMode: boolean;
  }> {
    return apiClient.get(`${this.basePath}/settings`);
  }

  // 비속어 검출 설정 업데이트
  async updateProfanitySettings(settings: {
    enableFilter?: boolean;
    defaultSeverity?: ProfanitySeverity;
    autoReplace?: boolean;
    defaultReplacement?: string;
    strictMode?: boolean;
  }): Promise<void> {
    return apiClient.put<void>(`${this.basePath}/settings`, settings);
  }

  // 최근 비속어 위반 사례 조회
  async getRecentViolations(limit?: number): Promise<
    Array<{
      id: number;
      text: string;
      violatedWords: string[];
      userId: string;
      username: string;
      contentType: "post" | "comment";
      contentId: number;
      detectedAt: string;
    }>
  > {
    return apiClient.get(`${this.basePath}/violations/recent`, { limit });
  }

  // 비속어 화이트리스트 조회
  async getWhitelist(): Promise<string[]> {
    return apiClient.get(`${this.basePath}/whitelist`);
  }

  // 비속어 화이트리스트 단어 추가
  async addToWhitelist(word: string): Promise<void> {
    return apiClient.post<void>(`${this.basePath}/whitelist`, { word });
  }

  // 비속어 화이트리스트 단어 제거
  async removeFromWhitelist(word: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/whitelist/${word}`);
  }
}

// API 인스턴스 생성 및 내보내기
export const profanitiesApi = new ProfanitiesApi();
