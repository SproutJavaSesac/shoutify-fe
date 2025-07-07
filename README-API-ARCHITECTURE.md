# Shoutify API Architecture

이 문서는 Shoutify 프론트엔드의 도메인 기반 API 아키텍처에 대해 설명합니다.

## 📁 프로젝트 구조

```
├── types/                    # 도메인별 타입 정의
│   ├── posts.ts             # 게시글 도메인 타입
│   ├── comments.ts          # 댓글 도메인 타입
│   ├── users.ts             # 회원 도메인 타입
│   ├── reactions.ts         # 반응하기 도메인 타입
│   ├── rankings.ts          # 랭킹 도메인 타입
│   ├── reports.ts           # 신고 도메인 타입
│   ├── profanities.ts       # 비속어 관리 도메인 타입
│   └── index.ts             # 모든 타입과 상수들 내보내기
│
├── apis/                     # 도메인별 API 로직
│   ├── client.ts            # 공통 API 클라이언트
│   ├── posts.ts             # 게시글 API
│   ├── comments.ts          # 댓글 API
│   ├── users.ts             # 회원 API
│   ├── reactions.ts         # 반응하기 API
│   ├── rankings.ts          # 랭킹 API
│   ├── reports.ts           # 신고 API
│   ├── profanities.ts       # 비속어 관리 API
│   └── index.ts             # 모든 API 내보내기
│
├── lib/
│   ├── hooks/
│   │   └── useApi.ts        # API 호출용 React 훅들
│   └── utils/
│       └── api.ts           # API 관련 유틸리티 함수들
│
└── components/examples/      # 새로운 구조 사용 예시
    └── new-post-feed.tsx    # 리팩토링된 게시글 피드
```

## 🎯 도메인별 API 구조

### 1. 게시글 (Posts)

- **타입**: `types/posts.ts`
- **API**: `apis/posts.ts`
- **주요 기능**:
  - 게시글 CRUD
  - 카테고리/감정별 조회
  - 검색 및 필터링
  - 북마크 관리

### 2. 댓글 (Comments)

- **타입**: `types/comments.ts`
- **API**: `apis/comments.ts`
- **주요 기능**:
  - 댓글/대댓글 CRUD
  - 댓글 반응 관리
  - 댓글 신고

### 3. 회원 (Users)

- **타입**: `types/users.ts`
- **API**: `apis/users.ts`
- **주요 기능**:
  - 인증 (로그인/로그아웃)
  - 프로필 관리
  - 사용자 통계 및 활동
  - 팔로우 시스템

### 4. 반응하기 (Reactions)

- **타입**: `types/reactions.ts`
- **API**: `apis/reactions.ts`
- **주요 기능**:
  - 게시글/댓글 반응 관리
  - 반응 통계
  - 벌크 반응 처리

### 5. 랭킹 (Rankings)

- **타입**: `types/rankings.ts`
- **API**: `apis/rankings.ts`
- **주요 기능**:
  - 게시글 랭킹 (북마크, 반응수)
  - 사용자 랭킹 (활동, 특별점수)
  - 랭킹 히스토리

### 6. 신고 (Reports)

- **타입**: `types/reports.ts`
- **API**: `apis/reports.ts`
- **주요 기능**:
  - 신고 접수 및 처리
  - 신고 관리 (관리자)
  - 신고 통계

### 7. 비속어 관리 (Profanities)

- **타입**: `types/profanities.ts`
- **API**: `apis/profanities.ts`
- **주요 기능**:
  - 비속어 단어 관리
  - 텍스트 검사 및 정제
  - 필터 관리

## 🛠 사용법

### 기본 API 사용

```typescript
import { api } from "@/apis";

// 게시글 목록 조회
const posts = await api.posts.getPosts({ page: 1, limit: 10 });

// 댓글 작성
const comment = await api.comments.createComment({
  postId: 1,
  content: "좋은 게시글이네요!",
});

// 반응 추가
await api.reactions.addReaction({
  targetId: 1,
  targetType: "post",
  emoji: "❤️",
});
```

### React 훅 사용

```typescript
import { useApi, useMutation, usePagination } from "@/lib/hooks/useApi";
import { api } from "@/apis";

// 데이터 페칭
const { data, loading, error } = useApi(() => api.posts.getPost(1));

// 뮤테이션
const { mutate: createPost, loading: creating } = useMutation(
  api.posts.createPost,
  {
    onSuccess: (post) => console.log("게시글 생성됨:", post),
    onError: (error) => console.error("에러:", error),
  },
);

// 페이지네이션
const {
  data: posts,
  currentPage,
  totalPages,
  goToPage,
  nextPage,
  prevPage,
} = usePagination((page, limit) => api.posts.getPosts({ page, limit }));
```

### 타입 사용

```typescript
import type { Post, CreatePostRequest, PostQueryParams } from "@/types";

const createPost = async (data: CreatePostRequest): Promise<Post> => {
  return await api.posts.createPost(data);
};

const searchPosts = async (params: PostQueryParams) => {
  return await api.posts.getPosts(params);
};
```

## 🔧 API 클라이언트 설정

### 환경 변수

```env
# 필수 설정 (명세서 기준)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# OAuth 설정 (선택사항)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_KAKAO_CLIENT_ID=your-kakao-client-id

# 앱 설정
NEXT_PUBLIC_APP_NAME=Shoutify
NEXT_PUBLIC_APP_VERSION=1.0.0

# 기능 플래그
NEXT_PUBLIC_ENABLE_PROFANITY_FILTER=true
NEXT_PUBLIC_ENABLE_AI_TRANSFORMATION=true

# 개발용 설정
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 인증 토큰 관리

API 클라이언트는 자동으로 localStorage에서 토큰을 읽어와 설정합니다.

```typescript
import { apiClient } from "@/apis/client";

// 수동으로 토큰 설정
apiClient.setAuthToken("your-token");

// 토큰 제거
apiClient.removeAuthToken();
```

## 📊 에러 처리

모든 API는 명세서 기준의 표준화된 에러 형태를 반환합니다:

```typescript
import { ApiError, ErrorCode } from "@/apis/client";

try {
  const data = await api.posts.getPosts();
} catch (error) {
  if (error instanceof ApiError) {
    console.log("Status:", error.status);
    console.log("Message:", error.message);
    console.log("Error Code:", error.code);
    console.log("Timestamp:", error.timestamp);
    console.log("Path:", error.path);
    console.log("Data:", error.data);

    // 특정 에러 코드에 따른 처리
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
        // 로그인 페이지로 리다이렉트
        break;
      case ErrorCode.PROFANITY_DETECTED:
        // 비속어 감지 안내
        break;
      case ErrorCode.VALIDATION_ERROR:
        // 입력값 검증 에러 처리
        break;
    }
  }
}
```

## 🎨 컴포넌트 예시

새로운 API 구조를 사용한 컴포넌트 예시는 `components/examples/new-post-feed.tsx`를 참고하세요.

```typescript
// 예시: 새로운 구조를 사용한 게시글 피드
import { api } from "@/apis";
import { usePagination } from "@/lib/hooks/useApi";
import type { PostQueryParams } from "@/types";

export function NewPostFeed({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const fetchPosts = async (page: number, limit: number) => {
    const params: PostQueryParams = { page, limit };
    if (selectedCategory !== "All") {
      params.category = selectedCategory;
    }
    const response = await api.posts.getPosts(params);
    return {
      data: response.posts,
      totalCount: response.totalCount,
      currentPage: response.currentPage,
      totalPages: response.totalPages,
    };
  };

  const { data: posts, loading, error } = usePagination(fetchPosts);

  // 컴포넌트 렌더링...
}
```

## 🔄 마이그레이션 가이드

### 기존 코드에서 새로운 구조로 변경

1. **Mock 데이터 제거**: 컴포넌트에서 하드코딩된 데이터를 제거
2. **API 호출 교체**: 새로운 API 클래스 메서드로 교체
3. **타입 추가**: TypeScript 타입을 적용
4. **훅 사용**: `useApi`, `useMutation`, `usePagination` 훅 사용

### Before (기존)

```typescript
const [posts, setPosts] = useState([]);
useEffect(() => {
  // Mock 데이터나 직접 fetch 호출
  setPosts(mockData);
}, []);
```

### After (새로운 구조)

```typescript
const { data: posts, loading, error } = useApi(() => api.posts.getPosts());
```

## 🚀 백엔드 개발자를 위한 가이드

### API 엔드포인트 구조 (명세서 기준)

각 도메인의 API 클래스는 백엔드 엔드포인트와 1:1 매핑됩니다:

```
# 게시글 관리
GET    /api/v1/posts              # 게시글 목록
POST   /api/v1/posts              # 게시글 생성
GET    /api/v1/posts/:id          # 게시글 상세
PUT    /api/v1/posts/:id          # 게시글 수정
DELETE /api/v1/posts/:id          # 게시글 삭제
POST   /api/v1/posts/:id/bookmarks    # 게시글 북마크
DELETE /api/v1/posts/:id/bookmarks    # 게시글 북마크 해제
POST   /api/v1/posts/:id/reactions    # 게시글 반응

# 댓글 관리
GET    /api/v1/posts/:id/comments     # 특정 게시글의 댓글 목록
POST   /api/v1/comments              # 댓글 생성
GET    /api/v1/comments/:id          # 댓글 상세
PUT    /api/v1/comments/:id          # 댓글 수정
DELETE /api/v1/comments/:id          # 댓글 삭제

# 사용자 관리
POST   /api/v1/auth/login            # 로그인
POST   /api/v1/auth/logout           # 로그아웃
GET    /api/v1/auth/me               # 현재 사용자 정보
GET    /api/v1/users/:id/profile     # 사용자 프로필
PUT    /api/v1/users/profile         # 프로필 수정

# 비속어 관리
POST   /api/v1/profanities/check     # 텍스트 비속어 검사
GET    /api/v1/profanities/words     # 비속어 단어 목록
POST   /api/v1/profanities/words     # 비속어 단어 추가
```

### 응답 형식 (명세서 기준)

모든 API 응답은 다음 공통 형식을 따릅니다:

```typescript
// 성공 응답
{
  success: true,
  data: T,
  message?: string,
  timestamp?: string,
  path?: string
}

// 에러 응답
{
  success: false,
  error: string,
  code?: ErrorCode,
  message?: string,
  timestamp?: string,
  path?: string,
  data?: any
}
```

**에러 코드 예시:**

- `BAD_REQUEST`: 잘못된 요청
- `UNAUTHORIZED`: 인증 필요
- `FORBIDDEN`: 권한 없음
- `NOT_FOUND`: 리소스 없음
- `VALIDATION_ERROR`: 입력값 검증 실패
- `PROFANITY_DETECTED`: 비속어 감지
- `AI_TRANSFORMATION_FAILED`: AI 변환 실패

### 타입 정의

`types/` 폴더의 모든 인터페이스는 백엔드 모델과 일치해야 합니다. 백엔드 스키마 변경 시 해당 타입도 함께 업데이트하세요.

## 📝 추가 개선사항

1. **캐싱**: React Query나 SWR 도입 고려
2. **오프라인 지원**: 오프라인 상태에서의 동작 개선
3. **실시간 업데이트**: WebSocket을 통한 실시간 데이터 동기화
4. **성능 최적화**: 무한 스크롤, 가상화 등
5. **테스트**: API 모킹 및 테스트 코드 추가

---

이 구조를 통해 백엔드 개발자가 쉽게 코드를 이해하고 유지보수할 수 있으며, 각 도메인별로 독립적인 개발이 가능합니다.
