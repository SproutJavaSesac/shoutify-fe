"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Bookmark, Flag, Eye, Trash2, Share2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { ReportModal } from "@/components/report-modal"
import { ShareModal } from "@/components/share-modal"
import { UserProfileModal } from "@/components/user-profile-modal"

const postData = {
  id: 1,
  title: "The Whispered Secrets of Autumn's Embrace",
  author: "LiteraryMuse",
  time: "2024-12-17 14:23",
  emotion: "melancholy",
  originalContent:
    "Fall is here and I'm feeling sad about summer ending. The leaves are falling and everything feels different.",
  transformedContent: `In the golden twilight of October's gentle sigh, leaves dance their final waltz upon the stage of earth, each one a memory of summer's passionate embrace now fading into whispered secrets of time's eternal passage.

The melancholy that settles upon my soul is not mere sadness, but a profound recognition of beauty's transient nature—how the vibrant greens of yesterday surrender to amber and crimson, painting the world in hues of nostalgia and quiet contemplation.

As I walk beneath the cathedral of changing trees, I am reminded that endings, too, possess their own sacred beauty. The falling leaves do not mourn their departure from the branch; they celebrate their transformation, their final dance before returning to the earth that gave them life.

In this season of letting go, I find solace in the understanding that all things must pass, yet in their passing, they leave behind something eternal—a memory, a lesson, a whispered secret that autumn carries on its gentle breeze.`,
  reactions: { "❤️": 15, "😊": 8, "😢": 12, "🤔": 7, "👏": 3 },
  comments: 12,
  bookmarks: 23,
  hasImage: true,
  imageUrl: "/placeholder.svg?height=300&width=500",
  isAuthor: true,
}

const emotionColors = {
  melancholy: "bg-blue-100 text-blue-800",
}

const reactionEmojis = ["❤️", "😊", "😢", "🤔", "👏"]

export function PostDetail({ postId }: { postId: string }) {
  const [reactions, setReactions] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [reportModal, setReportModal] = useState(false)
  const [shareModal, setShareModal] = useState(false)
  const [userProfileModal, setUserProfileModal] = useState(false)
  const { toast } = useToast()

  const handleReaction = (emoji: string) => {
    setReactions((prev) => (prev === emoji ? null : emoji))
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      description: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
    })
  }

  const handleHide = () => {
    setIsHidden(true)
    toast({
      description: "Post has been hidden",
    })
  }

  const handleReport = () => {
    setReportModal(true)
  }

  const handleShare = () => {
    setShareModal(true)
  }

  const handleUserClick = () => {
    setUserProfileModal(true)
  }

  if (isHidden) {
    return (
      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">This post has been hidden by the author.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <article className="mb-8">
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={emotionColors[postData.emotion as keyof typeof emotionColors]}>
                  {postData.emotion}
                </Badge>
              </div>

              {/* Title with Bookmark and Share icons */}
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">{postData.title}</h1>
                <div className="flex items-center space-x-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${isBookmarked ? "text-blue-600" : ""}`}
                    onClick={handleBookmark}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Author and Time */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleUserClick}
                    className="text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
                  >
                    {postData.author}
                  </button>
                  <span className="text-sm text-gray-500">{postData.time}</span>
                </div>

                {/* Action buttons - right aligned */}
                <div className="flex items-center space-x-2">
                  {postData.isAuthor && (
                    <>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleHide}>
                        <Eye className="h-3 w-3 mr-1" />
                        Hide
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleReport}>
                    <Flag className="h-3 w-3 mr-1" />
                    Report
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          {postData.hasImage && (
            <div className="mb-6">
              <Image
                src={postData.imageUrl || "/placeholder.svg"}
                alt="Post image"
                width={500}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-gray max-w-none mb-6">
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">{postData.transformedContent}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {/* Reaction Buttons with individual counts */}
              <div className="flex items-center space-x-2">
                {reactionEmojis.map((emoji) => (
                  <div key={emoji} className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${reactions === emoji ? "bg-gray-100 ring-2 ring-blue-300" : ""}`}
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </Button>
                    <span className="text-sm text-gray-500 ml-1">
                      {postData.reactions[emoji as keyof typeof postData.reactions]}
                    </span>
                  </div>
                ))}
              </div>

              <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{postData.comments}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReportModal
        isOpen={reportModal}
        onClose={() => setReportModal(false)}
        type="post"
        targetId={postData.id}
        targetTitle={postData.title}
      />
      <ShareModal
        isOpen={shareModal}
        onClose={() => setShareModal(false)}
        postTitle={postData.title}
        postId={postData.id}
      />
      <UserProfileModal
        isOpen={userProfileModal}
        onClose={() => setUserProfileModal(false)}
        username={postData.author}
      />
    </article>
  )
}
