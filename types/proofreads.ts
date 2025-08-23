import { ApiContract, IdType } from "@/types/apis";
import { ConceptType, GenreType } from "@/types/posts";

// 첨삭 기본 타입 정의
export interface ProofreadData {
  taskUuid: string;
  attemptId: IdType;
  nickname: string;
  afterTitle: string;
  afterContent: string;
  conceptType: ConceptType;
  createdAt: string;
  updatedAt: string;
}

// 첨삭 메타데이터 (점수 및 통계)
export interface ProofreadMetadata {
  sessionId: string; // taskUuId
  processingTime: number;
  conceptScore?: number; // AI 점수들을 옵셔널로 변경
  writingScore?: number;
  creativityScore?: number;
  emotionScore?: number;
  genreScore?: number;
  totalScore?: number;
  improvements: string[];
  originalLength: number;
  convertedLength: number;
  wordsChanged: number;
  wordsAdded: number;
  wordsRemoved: number;
}

// Diff 타입 정의
export type DiffType = "EQUAL" | "INSERT" | "DELETE";

export interface DiffSegment {
  type: DiffType;
  text: string;
  reason?: string;
}

// 완전한 첨삭 결과
export interface ProofreadResult extends ProofreadData {
  originalTitle: string;
  originalContent: string;
  titleDiff: DiffSegment[];
  contentDiff: DiffSegment[];
  metadata: ProofreadMetadata;
}

/** API Contracts */

// 첨삭 생성 요청
export type ProofreadCreateBodyRequest = {
  title: string;
  conceptType: ConceptType;
  genreType: GenreType;
  emotionType?: string;
  content: string;
  taskUuid?: string;
};

export type ProofreadCreateResponse = ProofreadData;

export type ProofreadCreateContract = ApiContract<
  undefined, // paths
  undefined, // queries
  ProofreadCreateBodyRequest, // body
  ProofreadCreateResponse // response
>;

// 첨삭 발행 요청
export type ProofreadPublishBodyRequest = {
  chosenAttemptId: IdType;
  imageUrl?: string;
};

export type ProofreadPublishResponse = {
  postId: IdType;
  afterTitle: string;
  afterContent: string;
};

export type ProofreadPublishContract = ApiContract<
  { taskUuid: string }, // paths
  undefined, // queries
  ProofreadPublishBodyRequest, // body
  ProofreadPublishResponse // response
>;
