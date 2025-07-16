"use client";

import { useEffect, useState } from "react";
import { getPosts } from "@/apis/posts";
import type {
  ConceptType,
  Post,
  PostQueryParams,
  PostSortType,
} from "@/types/posts";
import Link from "next/link";

interface PostsListProps {
  initialSort?: PostSortType;
  concept?: ConceptType;
  limit?: number;
}

export default function PostsList({
  initialSort = "latest",
  concept,
  limit = 10,
}: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | undefined>();

  // 게시글 목록 조회
  const fetchPosts = async (params?: PostQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getPosts({
        sort: initialSort,
        concept,
        limit,
        ...params,
      });

      if (params?.cursor) {
        // 무한 스크롤 - 기존 게시글에 추가
        setPosts((prev) => [...prev, ...response.posts]);
      } else {
        // 새로운 조회 - 게시글 교체
        setPosts(response.posts);
      }

      setHasNext(response.pagination.hasNext);
      setNextCursor(response.nextCursor);
    } catch (err) {
      console.error("게시글 조회 실패:", err);
      setError(
        err instanceof Error ? err.message : "게시글을 불러오는데 실패했습니다",
      );
    } finally {
      setLoading(false);
    }
  };

  // 더보기 (무한 스크롤)
  const loadMore = () => {
    if (hasNext && nextCursor) {
      fetchPosts({ cursor: nextCursor });
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, [initialSort, concept]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => fetchPosts()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 게시글 목록 */}
      {posts.map((post) => (
        <Link href={`/posts/${post.postId}`} key={post.postId}>
          <div
            key={post.postId}
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {post.afterTitle}
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {post.conceptType}
              </span>
            </div>

            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
              {post.afterContent}
            </p>

            {post.imageUrl && (
              <div className="mb-3">
                <img
                  src={post.imageUrl}
                  alt="게시글 이미지"
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>작성자: {post.nickname}</span>
                <span>반응 {post.reactionCount}</span>
                <span>댓글 {post.commentCount}</span>
              </div>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      ))}

      {/* 더보기 버튼 */}
      {hasNext && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "로딩 중..." : "더보기"}
          </button>
        </div>
      )}

      {!hasNext && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          모든 게시글을 확인했습니다.
        </div>
      )}
    </div>
  );
}
