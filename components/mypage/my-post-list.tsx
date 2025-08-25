import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/posts";
import { Eye, EyeOff, MessageCircle, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { PostDetailModal } from "./post-detail-modal";

interface MyPostListProps {
  posts: Post[];
  onDeletePost: (postId: number) => void;
  onHidePost: (postId: number) => void;
  onUnhidePost: (postId: number) => void;
}

export function MyPostList({
  posts,
  onDeletePost,
  onHidePost,
  onUnhidePost,
}: MyPostListProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const getStatusBadge = (post: Post) => {
    if (post.isDeleted) {
      return (
        <Badge variant="destructive" className="text-xs">
          삭제됨
        </Badge>
      );
    }
    if (post.isHidden) {
      return (
        <Badge variant="secondary" className="text-xs">
          숨김처리
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs text-green-600">
        공개
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>내가 작성한 글</span>
            <Badge variant="outline">{posts.length}개</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              아직 작성한 글이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.postId}
                  className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    post.isDeleted ? "opacity-60" : ""
                  }`}
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                        {post.afterTitle}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {post.afterContent.substring(0, 100)}
                        {post.afterContent.length > 100 ? "..." : ""}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-3">
                      {getStatusBadge(post)}
                      <div className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {post.reactionCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.commentCount}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {post.conceptType}
                      </Badge>
                      {post.genreType && (
                        <Badge variant="outline" className="text-xs">
                          {post.genreType}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {!post.isDeleted && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (post.isHidden) {
                                onUnhidePost(post.postId as number);
                              } else {
                                onHidePost(post.postId as number);
                              }
                            }}
                          >
                            {post.isHidden ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("정말로 이 글을 삭제하시겠습니까?")) {
                                onDeletePost(post.postId as number);
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 게시글 상세 모달 */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
