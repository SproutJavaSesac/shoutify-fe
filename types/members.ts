// 회원 관련 타입들 (백엔드 API 기준)

// 페이지네이션 공통 타입
export interface PaginationDto {
  page: number;
  totalPages: number;
  totalCount: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 내 정보 조회 응답
export interface MyInfoGetResponse {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;
  postCount: number;
  reactionCount: number; // 임시: 하드코딩된 값
  commentCount: number;
}

// 내 정보 수정 요청
export interface MyInfoEditRequest {
  nickname: string;
}

// 내 정보 수정 응답
export interface MyInfoEditResponse {
  memberId: number;
  nickname: string;
  email: string;
  profileImageUrl?: string;
}

// 내 게시글 요약 정보
export interface MyPostSummary {
  postId: number;
  beforeTitle: string;
  afterTitle: string;
  beforeContent: string;
  afterContent: string;
  createdAt: string;
  emotionType: string;
  conceptType: string;
  reactionCount: number; // 임시: 하드코딩된 값
  commentCount: number; // 임시: 하드코딩된 값
  imageUrl?: string;
  isHidden: boolean;
}

// 내 게시글 목록 응답
export interface MyPostListResponse {
  posts: MyPostSummary[];
  pagination: PaginationDto;
}

// 내 댓글 요약 정보
export interface MyCommentSummary {
  commentId: number;
  postId: number;
  postTitle: string;
  beforeContent: string;
  afterContent: string;
  createdAt: string;
  reactionCount: number; // 임시: 하드코딩된 값
}

// 내 댓글 목록 응답
export interface MyCommentListResponse {
  comments: MyCommentSummary[];
  pagination: PaginationDto;
}

// 페이지네이션 쿼리 파라미터
export interface PaginationParams {
  page?: number;
  size?: number;
}
