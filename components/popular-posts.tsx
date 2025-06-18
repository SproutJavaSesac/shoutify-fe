"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import Link from "next/link"

const popularPosts = [
  {
    id: 1,
    title: "The Whispered Secrets of Autumn's Embrace and the Melancholy of Changing Seasons",
    author: "LiteraryMuse",
    time: "2024-12-17 14:23",
    emotion: "melancholy",
    preview:
      "In the golden twilight of October's gentle sigh, leaves dance their final waltz upon the stage of earth, each one a memory of summer's passionate embrace now fading into whispered secrets of time's eternal passage.",
    reactions: 45,
    comments: 12,
    bookmarks: 23,
  },
  {
    id: 2,
    title: "Echoes of Joy in Morning's First Light",
    author: "PoetryLover",
    time: "2024-12-17 12:15",
    emotion: "joyful",
    preview:
      "As dawn breaks through the veil of night, hope springs eternal in hearts that dare to dream of better tomorrows filled with endless possibilities and boundless love.",
    reactions: 38,
    comments: 8,
    bookmarks: 19,
  },
  {
    id: 3,
    title: "The Solitude of Stars",
    author: "NightWriter",
    time: "2024-12-17 10:45",
    emotion: "contemplative",
    preview:
      "Beneath the vast expanse of midnight's canvas, solitary thoughts find their voice in whispered prayers that echo through the chambers of the soul.",
    reactions: 52,
    comments: 15,
    bookmarks: 31,
  },
  {
    id: 4,
    title: "Love's Gentle Refrain",
    author: "RomanticSoul",
    time: "2024-12-17 08:30",
    emotion: "romantic",
    preview:
      "In the tender moments between heartbeats, love writes its sweetest verses upon the soul, creating melodies that resonate through eternity.",
    reactions: 67,
    comments: 22,
    bookmarks: 41,
  },
  {
    id: 5,
    title: "The Courage Within",
    author: "BraveHeart",
    time: "2024-12-17 06:12",
    emotion: "inspiring",
    preview:
      "When shadows loom and doubt whispers its cruel song, the spirit rises like phoenix from ashes, transforming pain into strength and fear into courage.",
    reactions: 43,
    comments: 18,
    bookmarks: 27,
  },
]

const emotionColors = {
  melancholy: "bg-blue-100 text-blue-800",
  joyful: "bg-yellow-100 text-yellow-800",
  contemplative: "bg-purple-100 text-purple-800",
  romantic: "bg-pink-100 text-pink-800",
  inspiring: "bg-green-100 text-green-800",
}

export function PopularPosts() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {popularPosts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`}>
          <Card className="min-w-[300px] w-[300px] h-[200px] hover:shadow-md transition-shadow cursor-pointer flex-shrink-0">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-start justify-between mb-2 flex-shrink-0">
                <Badge className={emotionColors[post.emotion as keyof typeof emotionColors]}>{post.emotion}</Badge>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{post.time}</span>
              </div>

              {/* Title - single line with ellipsis */}
              <h3 className="font-semibold text-gray-900 mb-1 truncate flex-shrink-0">{post.title}</h3>

              <p className="text-sm text-gray-600 mb-2 flex-shrink-0">by {post.author}</p>

              {/* Preview - exactly 2 lines with overflow hidden */}
              <div className="flex-1 mb-3 overflow-hidden">
                <p className="text-sm text-gray-700 line-clamp-2 leading-5 h-10">{post.preview}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{post.reactions}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{post.comments}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Bookmark className="h-3 w-3" />
                    <span>{post.bookmarks}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
