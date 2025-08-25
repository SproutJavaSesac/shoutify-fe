import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Comment } from "@/types/comments";
import { MessageCircle, Trash2 } from "lucide-react";

interface MyCommentListProps {
  comments: (Comment & { postTitle?: string })[];
  onDeleteComment: (commentId: number | string) => void;
}

export function MyCommentList({
  comments,
  onDeleteComment,
}: MyCommentListProps) {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getStatusBadge = (comment: Comment) => {
    if (comment.isDeleted) {
      return (
        <Badge variant="destructive" className="text-xs">
          삭제됨
        </Badge>
      );
    }
    if (comment.isReported) {
      return (
        <Badge variant="secondary" className="text-xs">
          신고됨
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs text-green-600">
        공개
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>내가 작성한 댓글</span>
          <Badge variant="outline">{comments.length}개</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 작성한 댓글이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.commentId}
                className={`p-4 border rounded-lg ${
                  comment.isDeleted ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {comment.postTitle
                          ? `"${comment.postTitle}"에 남긴 댓글`
                          : "게시글에 남긴 댓글"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 line-clamp-3">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3">
                    {getStatusBadge(comment)}
                    <div className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {comment.parentId && (
                      <Badge variant="outline" className="text-xs">
                        답글
                      </Badge>
                    )}
                    <span>반응 {comment.reactionCount}개</span>
                  </div>

                  {!comment.isDeleted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                      onClick={() => {
                        if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
                          onDeleteComment(comment.commentId);
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
