"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Flag, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { AuthModal } from "@/components/auth-modal"

const commentsData = [
  {
    id: 1,
    author: "PoetryLover",
    time: "1 hour ago",
    content:
      "Your words paint such vivid imagery of autumn's melancholy. The metaphor of leaves dancing their final waltz is particularly moving.",
    reactions: { "❤️": 3, "😊": 2, "😢": 1, "🤔": 1, "👏": 1 },
    replies: [
      {
        id: 11,
        author: "LiteraryMuse",
        time: "45 minutes ago",
        content: "Thank you for your kind words. Autumn has always spoken to my soul in whispers of change and beauty.",
        reactions: { "❤️": 2, "😊": 1, "😢": 0, "🤔": 0, "👏": 0 },
        replies: [],
      },
    ],
  },
  {
    id: 2,
    author: "NightWriter",
    time: "2 hours ago",
    content:
      "The transformation from your original thoughts to this literary masterpiece is remarkable. The AI truly captured the essence of melancholy.",
    reactions: { "❤️": 5, "😊": 3, "😢": 2, "🤔": 1, "👏": 1 },
    replies: [],
  },
]

const reactionEmojis = ["❤️", "😊", "😢", "🤔", "👏"]

export function CommentsSection({ postId }: { postId: string }) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [commentReactions, setCommentReactions] = useState<{ [key: number]: string | null }>({})
  const { toast } = useToast()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSubmitComment = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (newComment.trim()) {
      toast({
        description: "Comment posted successfully",
      })
      setNewComment("")
    }
  }

  const handleSubmitReply = (commentId: number) => {
    if (replyText.trim()) {
      toast({
        description: "Reply posted successfully",
      })
      setReplyText("")
      setReplyingTo(null)
    }
  }

  const handleCommentReaction = (commentId: number, emoji: string) => {
    setCommentReactions((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === emoji ? null : emoji,
    }))
  }

  const CommentComponent = ({ comment, level = 0 }: { comment: any; level?: number }) => (
    <div className={`${level > 0 ? "ml-8 mt-4" : ""}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-medium text-gray-900">{comment.author}</span>
              <span className="text-sm text-gray-500 ml-2">{comment.time}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm">
                <Flag className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <p className="text-gray-700 mb-3">{comment.content}</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {reactionEmojis.map((emoji) => (
                <div key={emoji} className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 w-6 p-0 text-xs ${
                      commentReactions[comment.id] === emoji ? "bg-gray-100 ring-2 ring-blue-300" : ""
                    }`}
                    onClick={() => handleCommentReaction(comment.id, emoji)}
                  >
                    {emoji}
                  </Button>
                  <span className="text-xs text-gray-500 ml-1">
                    {comment.reactions[emoji as keyof typeof comment.reactions]}
                  </span>
                </div>
              ))}
            </div>

            {level < 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Reply
                </Button>
                <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {comment.replies?.map((reply: any) => (
        <CommentComponent key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  )

  return (
    <section id="comments" className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Comments ({commentsData.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-600">Commenting as</span>
                <span className="text-sm font-medium">@{user.username}</span>
              </div>
              <Textarea
                placeholder="Share your thoughts on this literary piece..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{1000 - newComment.length} characters remaining</span>
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">Sign in to join the literary discussion</p>
              <Button onClick={() => setShowAuthModal(true)}>Sign In to Comment</Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {commentsData.map((comment) => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
          </div>
        </CardContent>
      </Card>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  )
}
