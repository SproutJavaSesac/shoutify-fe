// AI 관련 타입 정의

export interface DiffChange {
  type: "EQUAL" | "INSERT" | "DELETE";
  text: string;
  reason?: string; // 변경 이유 설명
}

export interface ConversionMetadata {
  sessionId: string;
  processingTime: number; // 밀리초
  conceptScore: number; // 컨셉 적용도 (0-100)
  writingScore: number; // 글쓰기 점수 (0-100)
  creativityScore: number; // 창의성 점수 (0-100)
  emotionScore?: number; // 감정 표현도 (0-100)
  genreScore?: number; // 장르 적합도 (0-100)
  totalScore: number; // 총점 (0-100)
  improvements: string[]; // 개선 사항들
  originalLength: number;
  convertedLength: number;
  wordsChanged: number;
  wordsAdded: number;
  wordsRemoved: number;
}

export interface AIConversionResult {
  sessionId: string;
  originalTitle: string;
  originalContent: string;
  convertedTitle: string;
  convertedContent: string;
  titleDiff: DiffChange[];
  contentDiff: DiffChange[];
  metadata: ConversionMetadata;
  createdAt: string;
}

export interface AIPreviewRequest {
  title: string;
  content: string;
  conceptType: string;
  genreType?: string; // 새로 추가될 장르 필드
  emotionType?: string;
}

// 새로운 장르 옵션 타입
export interface GenreOption {
  label: string;
  value: string;
  description?: string;
  targetAudience?: string;
}

// 컨셉별 세부 카테고리
export interface ConceptCategory {
  label: string;
  value: string;
  genres: GenreOption[];
  description: string;
}
