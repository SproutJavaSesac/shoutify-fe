"use client";

import { useState } from "react";
import { useAuth, withAuth } from "@/lib/auth";
import {
  useMyInfo,
  useUpdateMyInfo,
  useMyPosts,
  useMyComments,
} from "@/lib/hooks/useMembers";
import type { MyInfoEditRequest } from "@/types";

// 내 정보 섹션
function MyInfoSection() {
  const { data: myInfo, loading, error, refetch } = useMyInfo();
  const { updateMyInfo, loading: updating } = useUpdateMyInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState("");

  if (loading) return <div className="p-4">내 정보를 불러오는 중...</div>;
  if (error)
    return <div className="p-4 text-red-600">오류: {error.message}</div>;
  if (!myInfo) return <div className="p-4">정보를 찾을 수 없습니다.</div>;

  const handleEdit = () => {
    setEditNickname(myInfo.nickname);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const request: MyInfoEditRequest = { nickname: editNickname };
      await updateMyInfo(request);
      await refetch(); // 수정 후 최신 정보 다시 가져오기
      setIsEditing(false);
    } catch (error) {
      alert("닉네임 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditNickname("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">내 정보</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <p className="mt-1 text-sm text-gray-900">{myInfo.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          {isEditing ? (
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSave}
                disabled={updating}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="mt-1 flex justify-between items-center">
              <p className="text-sm text-gray-900">{myInfo.nickname}</p>
              <button
                onClick={handleEdit}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                수정
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {myInfo.postCount}
            </p>
            <p className="text-sm text-gray-600">게시글</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {myInfo.commentCount}
            </p>
            <p className="text-sm text-gray-600">댓글</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {myInfo.reactionCount}
            </p>
            <p className="text-sm text-gray-600">받은 반응</p>
            <p className="text-xs text-gray-400">(임시 데이터)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 내 게시글 섹션
function MyPostsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, loading, error, changePage } = useMyPosts({
    page: currentPage,
    size: 5,
  });

  if (loading) return <div className="p-4">게시글을 불러오는 중...</div>;
  if (error)
    return <div className="p-4 text-red-600">오류: {error.message}</div>;
  if (!data) return <div className="p-4">데이터를 찾을 수 없습니다.</div>;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    changePage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">내 게시글</h2>

      {data.posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          작성한 게시글이 없습니다.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {data.posts.map((post) => (
              <div key={post.postId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{post.afterTitle}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      post.isHidden
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.isHidden ? "숨김" : "공개"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  {post.afterContent.substring(0, 100)}...
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex gap-4">
                    <span>댓글 {post.commentCount}</span>
                    <span>반응 {post.reactionCount}</span>
                    <span className="text-xs">(임시 데이터)</span>
                  </div>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {post.emotionType}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {post.conceptType}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!data.pagination.hasPrevious}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                이전
              </button>

              <span className="px-3 py-1">
                {currentPage + 1} / {data.pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!data.pagination.hasNext}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 내 댓글 섹션
function MyCommentsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const { data, loading, error, changePage } = useMyComments({
    page: currentPage,
    size: 5,
  });

  if (loading) return <div className="p-4">댓글을 불러오는 중...</div>;
  if (error)
    return <div className="p-4 text-red-600">오류: {error.message}</div>;
  if (!data) return <div className="p-4">데이터를 찾을 수 없습니다.</div>;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    changePage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">내 댓글</h2>

      {data.comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          작성한 댓글이 없습니다.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {data.comments.map((comment) => (
              <div key={comment.commentId} className="border rounded-lg p-4">
                <div className="mb-2">
                  <h4 className="font-medium text-sm text-gray-600">
                    게시글: {comment.postTitle}
                  </h4>
                </div>

                <p className="text-gray-800 mb-2">{comment.afterContent}</p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex gap-4">
                    <span>반응 {comment.reactionCount}</span>
                    <span className="text-xs">(임시 데이터)</span>
                  </div>
                  <span>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!data.pagination.hasPrevious}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                이전
              </button>

              <span className="px-3 py-1">
                {currentPage + 1} / {data.pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!data.pagination.hasNext}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 메인 마이페이지 컴포넌트
function MyPageComponent() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">마이페이지</h1>
        <p className="text-gray-600 mt-2">안녕하세요, {user?.nickname}님!</p>
      </div>

      <MyInfoSection />
      <MyPostsSection />
      <MyCommentsSection />
    </div>
  );
}

// 인증이 필요한 마이페이지로 내보내기
export default withAuth(MyPageComponent);
