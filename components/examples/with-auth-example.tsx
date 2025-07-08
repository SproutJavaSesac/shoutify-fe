"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { postsApi, commentsApi } from "@/apis";
import { useMutation } from "@/lib/hooks/useApi";

// 인증이 필요한 기능들을 테스트하는 예시 컴포넌트
export default function WithAuthExample() {
  const { isAuthenticated, user } = useAuth();
  const [postContent, setPostContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number>(1);

  // 게시글 작성 뮤테이션
  const { mutate: createPost, loading: creatingPost } = useMutation(
    postsApi.createPost,
    {
      onSuccess: (post) => {
        console.log("게시글 작성 성공:", post);
        setPostContent("");
        alert(`게시글이 작성되었습니다! ID: ${post.id}`);
      },
      onError: (error) => {
        console.error("게시글 작성 실패:", error);
        alert("게시글 작성에 실패했습니다.");
      },
    },
  );

  // 댓글 작성 뮤테이션
  const { mutate: createComment, loading: creatingComment } = useMutation(
    commentsApi.createComment,
    {
      onSuccess: (comment) => {
        console.log("댓글 작성 성공:", comment);
        setCommentContent("");
        alert(`댓글이 작성되었습니다! ID: ${comment.id}`);
      },
      onError: (error) => {
        console.error("댓글 작성 실패:", error);
        alert("댓글 작성에 실패했습니다.");
      },
    },
  );

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      alert("게시글 내용을 입력해주세요.");
      return;
    }

    createPost({
      content: postContent,
      // 실제 API에서는 사용자 정보가 세션에서 자동으로 처리되지만,
      // 여기서는 현재 로그인된 사용자 정보를 명시적으로 표시
      // authorId: user?.id (실제로는 백엔드에서 세션으로 처리)
    });
  };

  const handleCreateComment = () => {
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    createComment({
      postId: selectedPostId,
      content: commentContent,
      // authorId: user?.id (실제로는 백엔드에서 세션으로 처리)
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            인증이 필요한 기능 테스트
          </h2>
          <p className="text-gray-600 mb-6">
            로그인 후 게시글 작성, 댓글 작성 등의 기능을 테스트할 수 있습니다.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              💡 개발 중이라면 우측 하단의 "Mock 로그인" 버튼을 사용해보세요!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          인증된 기능 테스트
        </h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✅ 로그인됨: <strong>{user?.nickname}</strong> ({user?.email})
            {user?.id === 1 && (
              <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                Mock 사용자
              </span>
            )}
          </p>
        </div>
      </div>

      {/* 게시글 작성 섹션 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📝 게시글 작성
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="post-content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              게시글 내용
            </label>
            <textarea
              id="post-content"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="무슨 생각을 하고 계신가요?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreatePost}
            disabled={creatingPost}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingPost ? "작성 중..." : "게시글 작성"}
          </button>
        </div>
      </div>

      {/* 댓글 작성 섹션 */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💬 댓글 작성
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="post-id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              게시글 ID
            </label>
            <input
              id="post-id"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(Number(e.target.value))}
            />
          </div>

          <div>
            <label
              htmlFor="comment-content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              댓글 내용
            </label>
            <textarea
              id="comment-content"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="댓글을 입력하세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreateComment}
            disabled={creatingComment}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingComment ? "작성 중..." : "댓글 작성"}
          </button>
        </div>
      </div>

      {/* 현재 사용자 정보 표시 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          현재 사용자 정보
        </h4>
        <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
