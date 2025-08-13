# 인증 컴포넌트 사용법

`withAuth` HOC를 활용해서 만들어진 공통 인증 컴포넌트들의 사용법입니다.

## 개요

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
