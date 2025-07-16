### 🚀 기술 스택

이 프로젝트는 다음과 같은 기술들을 기반으로 구축되었습니다.

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

---

### 📂 프로젝트 구조

프로젝트의 주요 디렉토리 구조는 다음과 같습니다.

```
.
├── app/          # 📄 페이지 및 라우팅
├── apis/         # 📞 백엔드 API 호출 함수
├── components/   # 🧩 UI 컴포넌트
├── constants/    # 📌 전역 상수
├── hooks/        # 🪝 커스텀 React Hooks
├── lib/          # 🛠️ 유틸리티 함수
├── public/       # 🖼️ 이미지, 폰트 등 정적 파일
├── styles/       # 🎨 전역 스타일 시트
├── package.json  # 📦 의존성 및 스크립트 관리
└── ...
```

- **`app/`**: Next.js의 App Router가 사용하는 디렉토리입니다. 각 폴더가 URL 경로가 되며, `page.tsx` 파일이 해당 경로의 UI를 렌더링합니다. 예를 들어,
  `app/mypage/page.tsx`는 `/mypage` URL에 대한 페이지가 됩니다.
- **`apis/`**: 백엔드 API와 통신하는 모든 코드가 이 디렉토리에 있습니다. API 명세가 변경되거나 새로운 API가 추가되면 이 디렉토리의 파일을 수정하게 됩니다.
- **`components/`**: 버튼, 카드, 다이얼로그 등 여러 페이지에서 재사용되는 작은 UI 조각들입니다.

---

### 🏁 시작하기

로컬 환경에서 프론트엔드 프로젝트를 실행하는 방법입니다.

#### 1. 사전 요구사항

- [Node.js](https://nodejs.org/ko) (v18 이상 권장)
- `npm` (Node.js 설치 시 자동 설치됨)

#### 2. 의존성 설치

프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 필요한 패키지를 설치합니다.

```bash
npm install
```

#### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고, 백엔드 API 서버의 주소를 입력합니다.

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

#### 4. 개발 서버 실행

아래 명령어를 실행하면 개발 서버가 시작됩니다.

```bash
npm run dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 프론트엔드 화면을 확인할 수 있습니다.

---

### 📞 API 연동 가이드

#### API 클라이언트 (`apis/client.ts`)

모든 API 요청은 `apis/client.ts` 파일에 정의된 `api` 객체를 통해 이루어집니다.

- **Base URL**: `.env.local` 파일의 `NEXT_PUBLIC_API_URL` 값을 기본 URL로 사용합니다.
- **인증**: 인증이 필요한 요청(`api.get`, `api.post` 등)은 `Authorization: Bearer <token>` 헤더를 자동으로 포함합니다. 토큰은 `api.setToken(token)`
  함수를 통해 설정됩니다.
- **공개 API**: 인증이 필요 없는 요청은 `api.public.get(...)`처럼 `public` 객체를 통해 호출합니다.

#### API 모듈 구조

`apis/` 디렉토리 내에는 각 API 리소스(domain)별로 파일이 분리되어 있습니다. (예: `posts.ts`, `members.ts`, `auth.ts`)

예를 들어, `apis/posts.ts`는 게시물과 관련된 API 함수들을 모아놓은 파일입니다.

```typescript
// apis/posts.ts

import {api} from "./client";

// 게시글 목록 조회 (인증 불필요)
export async function getPosts(params?: PostQueryParams) {
    return await api.public.get<PostsApiResponse>("/posts", params);
}

// 게시글 생성 (인증 필요)
export const createPost = async (data: CreatePostRequest) => {
    return api.post<CreatePostResponse>("/posts", data);
};
```

#### 새로운 API 추가하기

만약 '상품(products)'에 대한 API를 새로 추가해야 한다면:

1. `apis/products.ts` 파일을 생성합니다.
2. `api`를 import하고, `products`와 관련된 API 함수들을 작성합니다.

```typescript
// apis/products.ts

import { api } from "./client";

type Product = {
  id: number;
  name: string;
};

// 모든 상품 조회 (인증 필요)
export const getProducts = async (): Promise<Product[]> => {
  return api.get<Product[]>("/products");
};

// 특정 상품 조회 (인증 불필요)
export const getProductById = async (id: number): Promise<Product> => {
  return api.public.get<Product>(`/products/${id}`);
};
```

3. 이제 다른 페이지나 컴포넌트에서 `getProducts()`를 import하여 사용할 수 있습니다.

---

### 🎨 간단한 UI 수정 방법

프론트엔드 화면의 텍스트나 간단한 요소를 수정하는 것은 매우 쉽습니다.

#### 페이지 파일 찾기

수정하고 싶은 화면의 URL을 보고 `app/` 디렉토리에서 해당 파일을 찾습니다.

- 메인 페이지 (`/`) → `app/page.tsx`
- 마이 페이지 (`/mypage`) → `app/mypage/page.tsx`

#### 예시: 메인 페이지 제목 수정하기

1. `app/page.tsx` 파일을 엽니다.
2. 파일 내용에서 수정하고 싶은 텍스트를 찾습니다. (예: "Welcome to Shoutify")
3. 해당 부분을 원하는 텍스트로 수정하고 저장합니다.

```tsx
// app/page.tsx (일부)

// ...
<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
  Welcome to <span className="text-yellow-400">Shoutify</span>
</h1>
// 이 부분을 아래와 같이 수정
<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
  수정된 <span className="text-yellow-400">타이틀</span> 입니다
</h1>
// ...
```

파일을 저장하면 개발 서버가 자동으로 변경사항을 감지하여 브라우저에 즉시 반영합니다.

> **Note**: `app/page.tsx`의 게시물 목록은 현재 목(mock) 데이터로 동작하고 있습니다. 실제 API를 연동한 게시물 목록 페이지는 `app/posts/page.tsx`에서 확인하실 수
> 있습니다.

---

### 📦 프로덕션 빌드

개발이 완료된 애플리케이션을 서버에 배포하기 위해 프로덕션 버전으로 빌드해야 합니다.

1. **빌드**: 아래 명령어를 실행하면 `build` 스크립트가 실행되어 `.next` 디렉토리에 최적화된 빌드 파일이 생성됩니다.

   ```bash
   npm run build
   ```

2. **프로덕션 서버 실행**: 빌드가 완료된 후, 아래 명령어로 프로덕션 서버를 시작할 수 있습니다.
   ```bash
   npm run start
   ```

이제 `http://localhost:3000`에서 최적화된 버전의 애플리케이션이 실행됩니다.
