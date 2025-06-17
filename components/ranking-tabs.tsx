"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, TrendingUp, Heart, Bookmark, PenTool } from "lucide-react"
import Link from "next/link"

const mostBookmarkedPosts = [
  {
    id: 1,
    title: "Love's Gentle Refrain",
    author: "RomanticSoul",
    bookmarks: 67,
    emotion: "romantic",
    trend: "up",
  },
  {
    id: 2,
    title: "The Courage Within",
    author: "BraveHeart",
    bookmarks: 43,
    emotion: "inspiring",
    trend: "up",
  },
  {
    id: 3,
    title: "Whispered Secrets of Autumn",
    author: "LiteraryMuse",
    bookmarks: 38,
    emotion: "melancholy",
    trend: "down",
  },
  {
    id: 4,
    title: "Morning's First Light",
    author: "PoetryLover",
    bookmarks: 32,
    emotion: "joyful",
    trend: "same",
  },
  {
    id: 5,
    title: "The Solitude of Stars",
    author: "NightWriter",
    bookmarks: 28,
    emotion: "contemplative",
    trend: "up",
  },
]

const mostReactedPosts = [
  {
    id: 1,
    title: "Love's Gentle Refrain",
    author: "RomanticSoul",
    reactions: 89,
    emotion: "romantic",
    trend: "up",
  },
  {
    id: 2,
    title: "The Courage Within",
    author: "BraveHeart",
    reactions: 76,
    emotion: "inspiring",
    trend: "up",
  },
  {
    id: 3,
    title: "Whispered Secrets of Autumn",
    author: "LiteraryMuse",
    reactions: 65,
    emotion: "melancholy",
    trend: "same",
  },
  {
    id: 4,
    title: "The Solitude of Stars",
    author: "NightWriter",
    reactions: 52,
    emotion: "contemplative",
    trend: "up",
  },
  {
    id: 5,
    title: "Morning's First Light",
    author: "PoetryLover",
    reactions: 48,
    emotion: "joyful",
    trend: "down",
  },
]

const mostActiveUsers = [
  {
    username: "LiteraryMuse",
    posts: 23,
    totalReactions: 456,
    totalBookmarks: 234,
    trend: "up",
  },
  {
    username: "RomanticSoul",
    posts: 18,
    totalReactions: 389,
    totalBookmarks: 198,
    trend: "up",
  },
  {
    username: "NightWriter",
    posts: 15,
    totalReactions: 298,
    totalBookmarks: 167,
    trend: "same",
  },
  {
    username: "PoetryLover",
    posts: 12,
    totalReactions: 234,
    totalBookmarks: 145,
    trend: "down",
  },
  {
    username: "BraveHeart",
    posts: 10,
    totalReactions: 198,
    totalBookmarks: 123,
    trend: "up",
  },
]

const emotionColors = {
  romantic: "bg-pink-100 text-pink-800",
  inspiring: "bg-green-100 text-green-800",
  melancholy: "bg-blue-100 text-blue-800",
  joyful: "bg-yellow-100 text-yellow-800",
  contemplative: "bg-purple-100 text-purple-800",
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-500" />
    case "down":
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full" />
  }
}

export function RankingTabs() {
  const [activeTab, setActiveTab] = useState("bookmarks")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="bookmarks">Most Bookmarked</TabsTrigger>
        <TabsTrigger value="reactions">Most Reacted</TabsTrigger>
        <TabsTrigger value="users">Most Active Users</TabsTrigger>
      </TabsList>

      <TabsContent value="bookmarks">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bookmark className="h-5 w-5" />
              <span>Most Bookmarked Posts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostBookmarkedPosts.map((post, index) => (
                <div key={post.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-200">
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    {index !== 0 && <span className="text-sm font-bold text-gray-600">{index + 1}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={emotionColors[post.emotion as keyof typeof emotionColors]}>
                        {post.emotion}
                      </Badge>
                      {getTrendIcon(post.trend)}
                    </div>

                    <Link href={`/post/${post.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-gray-700 cursor-pointer">{post.title}</h3>
                    </Link>

                    <Link href={`/profile/${post.author}`}>
                      <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">by {post.author}</p>
                    </Link>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-lg font-bold text-gray-900">
                      <Bookmark className="h-5 w-5" />
                      <span>{post.bookmarks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reactions">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Most Reacted Posts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostReactedPosts.map((post, index) => (
                <div key={post.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-200">
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    {index !== 0 && <span className="text-sm font-bold text-gray-600">{index + 1}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={emotionColors[post.emotion as keyof typeof emotionColors]}>
                        {post.emotion}
                      </Badge>
                      {getTrendIcon(post.trend)}
                    </div>

                    <Link href={`/post/${post.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-gray-700 cursor-pointer">{post.title}</h3>
                    </Link>

                    <Link href={`/profile/${post.author}`}>
                      <p className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer">by {post.author}</p>
                    </Link>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-lg font-bold text-gray-900">
                      <Heart className="h-5 w-5" />
                      <span>{post.reactions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PenTool className="h-5 w-5" />
              <span>Most Active Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostActiveUsers.map((user, index) => (
                <div key={user.username} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-200">
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    {index !== 0 && <span className="text-sm font-bold text-gray-600">{index + 1}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">{getTrendIcon(user.trend)}</div>

                    <Link href={`/profile/${user.username}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-gray-700 cursor-pointer">
                        {user.username}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{user.totalReactions} reactions</span>
                      <span>{user.totalBookmarks} bookmarks</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-lg font-bold text-gray-900">
                      <PenTool className="h-5 w-5" />
                      <span>{user.posts}</span>
                    </div>
                    <p className="text-xs text-gray-500">posts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
