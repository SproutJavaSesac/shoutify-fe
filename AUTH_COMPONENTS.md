# 인증 및 권한 컴포넌트 사용법

`withAuth` HOC와 `withOwnership` HOC를 활용해서 만들어진 공통 인증 및 권한 확인 컴포넌트들의 사용법입니다.

## 개요

두 가지 HOC 패턴을 제공합니다:

- **withAuth**: 로그인 여부만 확인 (인증)
- **withOwnership**: 로그인 + 소유권 확인 (인증 + 인가)

## 소셜 로그인 및 추가 정보 입력 플로우

### 1. 소셜 로그인 프로세스

1. **로그인 시도**: 사용자가 구글/카카오 로그인 버튼 클릭
2. **OAuth 인증**: 소셜 플랫폼에서 인증 후 콜백 페이지로 리다이렉트
3. **신규 회원 확인**:
   - 신규 회원인 경우: `/auth/onboarding` 페이지로 이동
   - 기존 회원인 경우: 원래 의도한 페이지로 이동
4. **추가 정보 입력**: 신규 회원이 닉네임, 자기소개, 관심사 입력
5. **회원가입 완료**: 모든 기능 이용 가능

### 2. 추가 정보 입력 페이지 특징

- **UX 최적화**: 단계별 안내와 직관적인 UI
- **필수/선택 정보 구분**: 닉네임은 필수, 나머지는 선택사항
- **관심사 선택**: 최대 5개의 태그 기반 관심사 선택
- **건너뛰기 옵션**: 나중에 설정할 수 있는 옵션 제공
- **실시간 검증**: 닉네임 길이, 자기소개 글자 수 실시간 체크

### 3. 관련 API 엔드포인트

```typescript
// 추가 정보 입력
POST /auth/complete-signup
{
  "nickname": "사용자닉네임",
  "bio": "자기소개",
  "interests": ["시", "음악", "여행"]
}

// 로그인 상태 확인 (신규 회원 여부 포함)
GET /auth/status
Response: {
  "isAuthenticated": true,
  "memberId": 123,
  "nickname": "사용자닉네임",
  "email": "user@example.com",
  "roleType": "USER",
  "profileImageUrl": "...",
  "isNewUser": false
}
```

## 인증 컴포넌트 (withAuth 기반)

- 모든 인증 컴포넌트들은 `withAuth` HOC로 래핑되어 자동으로 인증 상태를 체크합니다
- 인증이 필요한 동작 시 자동으로 인증 모달이 표시됩니다
- 중복 코드 없이 일관된 인증 UX를 제공합니다

## 사용 가능한 컴포넌트들

### 1. PostWriteButton - 게시글 작성 버튼

```tsx
import { PostWriteButton } from "@/components/commons";

function MyComponent() {
  return (
    <PostWriteButton
      onClick={() => router.push("/posts/write")}
      variant="default"
      size="lg"
    >
      새 글 쓰기
    </PostWriteButton>
  );
}
```

### 2. CommentWriteButton - 댓글 작성 버튼

```tsx
import { CommentWriteButton } from "@/components/commons";

function MyComponent() {
  return (
    <CommentWriteButton
      onClick={() => setShowCommentForm(true)}
      disabled={isLoading}
    >
      댓글 달기
    </CommentWriteButton>
  );
}
```

### 3. BookmarkButton - 북마크 버튼

```tsx
import { BookmarkButton } from "@/components/commons";

function PostCard({ postId, isBookmarked }) {
  const handleBookmark = () => {
    // 북마크 로직
  };

  return (
    <BookmarkButton isBookmarked={isBookmarked} onClick={handleBookmark} />
  );
}
```

### 4. ReportButton - 신고 버튼

```tsx
import { ReportButton } from "@/components/commons";

function PostActions({ postId }) {
  const handleReport = () => {
    setShowReportModal(true);
  };

  return <ReportButton onClick={handleReport} />;
}
```

### 5. DeleteButton - 삭제 버튼

```tsx
import { DeleteButton } from "@/components/commons";

function PostActions({ onDelete }) {
  return (
    <DeleteButton onClick={onDelete} size="sm">
      삭제
    </DeleteButton>
  );
}
```

### 6. ReactionButtons - 인증이 필요한 리액션 버튼들

```tsx
import { ReactionButtons } from "@/components/commons";

function PostCard({ reactions, myReaction, postId }) {
  const handleReactionClick = (reactionType: ReactionLabelType) => {
    // 리액션 로직
  };

  return (
    <ReactionButtons
      reactions={reactions}
      myReaction={myReaction}
      onReactionClick={handleReactionClick}
      size="default"
      showAllReactions={true}
    />
  );
}
```

### 7. ShareButton - 공유 버튼 (인증 불필요)

```tsx
import { ShareButton } from "@/components/commons";

function PostCard({ postId }) {
  const handleShare = () => {
    setShowShareModal(true);
  };

  return <ShareButton onClick={handleShare} />;
}
```

## 장점

1. **중복 코드 제거**: 더 이상 `if (!user) { setAuthModal(true); return; }` 코드를 반복할 필요 없음
2. **일관된 UX**: 모든 인증 요구 시점에서 동일한 모달과 메시지 제공
3. **자동 인증 처리**: 각 컴포넌트가 자체적으로 인증 모달 관리
4. **재사용성**: 어디서든 import해서 바로 사용 가능
5. **타입 안전성**: TypeScript로 작성되어 타입 안전성 보장

## 기존 코드와의 비교

### Before (기존 방식)

```tsx
const handleBookmark = () => {
  if (!user) {
    setAuthModal(true);
    return;
  }
  // 북마크 로직
};

// JSX에서
<Button onClick={handleBookmark}>
  <Bookmark />
</Button>
<AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
```

### After (새로운 방식)

```tsx
const handleBookmark = () => {
  // 북마크 로직만 작성
};

// JSX에서
<BookmarkButton isBookmarked={isBookmarked} onClick={handleBookmark} />;
```

인증 처리, 모달 관리, 에러 처리 등이 모두 컴포넌트 내부에서 자동으로 처리됩니다.

## 권한 확인 컴포넌트 (withOwnership 기반)

### 1. OwnerDeleteButton - 소유자만 삭제 가능한 버튼

```tsx
import { OwnerDeleteButton } from "@/components/commons";

function PostActions({ post }) {
  const handleDelete = () => {
    // 삭제 로직
  };

  return (
    <OwnerDeleteButton
      onClick={handleDelete}
      authorId={post.authorId} // 게시글 작성자 ID
      size="sm"
    >
      삭제
    </OwnerDeleteButton>
  );
}
```

### 2. OwnerHideButton - 소유자만 숨김 가능한 버튼

```tsx
import { OwnerHideButton } from "@/components/commons";

function PostActions({ post }) {
  const handleHide = () => {
    // 숨김/해제 로직
  };

  return (
    <OwnerHideButton
      isHidden={post.isHidden}
      onClick={handleHide}
      authorId={post.authorId}
      size="sm"
    />
  );
}
```

### 3. OwnerCommentDeleteButton - 댓글 소유자만 삭제 가능한 버튼

```tsx
import { OwnerCommentDeleteButton } from "@/components/commons";

function CommentActions({ comment }) {
  const handleDelete = () => {
    // 댓글 삭제 로직
  };

  return (
    <OwnerCommentDeleteButton
      onClick={handleDelete}
      authorId={comment.authorId} // 댓글 작성자 ID
    />
  );
}
```

## HOC 옵션

### withOwnership 옵션

```tsx
export const CustomOwnerButton = withOwnership(BaseButton, {
  // 소유권 확인 함수 (기본값: user.id === props.authorId || user.id === props.ownerId)
  checkOwnership: (user, props) => user.id === props.customAuthorId,

  // 권한이 없을 때 표시할 컴포넌트
  fallbackComponent: () => <div>권한이 없습니다</div>,

  // 권한이 없을 때 모달 표시 여부 (기본값: true)
  showOwnershipModal: true,

  // 리소스 이름 (모달 메시지에 사용, 기본값: "리소스")
  resourceName: "게시글",

  // 커스텀 권한 없음 메시지
  ownershipModalMessage: "본인의 게시글만 수정할 수 있습니다.",
});
```

## 사용 패턴 비교

### 기존 방식 (권장하지 않음)

```tsx
// ❌ 수동 조건부 렌더링
{
  postData.isMine && <Button onClick={handleDelete}>삭제</Button>;
}
```

### 새로운 방식 (권장)

```tsx
// ✅ 자동 권한 확인 + 사용자 친화적 피드백
<OwnerDeleteButton onClick={handleDelete} authorId={post.authorId}>
  삭제
</OwnerDeleteButton>
```

## 확장된 장점

1. **자동 권한 확인**: HOC가 자동으로 로그인 및 소유권 확인
2. **사용자 친화적**: 권한이 없을 때 적절한 모달과 메시지 표시
3. **코드 중복 제거**: 반복적인 조건문과 모달 관리 코드 제거
4. **타입 안전성**: TypeScript로 props 타입 검증
5. **일관성**: 모든 권한 확인 로직이 동일한 패턴으로 작동
6. **확장성**: 새로운 권한 확인 컴포넌트를 쉽게 추가 가능

## 권한 확인 패턴 비교

### Before (기존 방식)

```tsx
const PostDetail = ({ post }) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleDelete = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (user.id !== post.authorId) {
      alert("권한이 없습니다");
      return;
    }
    // 실제 삭제 로직
  };

  return (
    <div>
      {user && user.id === post.authorId && (
        <Button onClick={handleDelete}>삭제</Button>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
```

### After (새로운 방식)

```tsx
const PostDetail = ({ post }) => {
  const handleDelete = () => {
    // 실제 삭제 로직만 작성
  };

  return (
    <div>
      <OwnerDeleteButton onClick={handleDelete} authorId={post.authorId}>
        삭제
      </OwnerDeleteButton>
    </div>
  );
};
```
