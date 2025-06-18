"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Bookmark, Eye, Trash2, Award, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

const myPosts = [
  {
    id: 1,
    title: "The Whispered Secrets of Autumn's Embrace",
    originalContent: "Fall is here and I'm feeling sad about summer ending.",
    transformedContent: "In the golden twilight of October's gentle sigh...",
    emotion: "melancholy",
    reactions: 45,
    comments: 12,
    bookmarks: 23,
    isHidden: false,
    createdAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Morning Coffee Thoughts",
    originalContent: "I love my morning coffee routine.",
    transformedContent: "In the sacred ritual of dawn's first embrace...",
    emotion: "peaceful",
    reactions: 23,
    comments: 5,
    bookmarks: 12,
    isHidden: true,
    createdAt: "1 day ago",
  },
]

const myComments = [
  {
    id: 1,
    postTitle: "Love's Gentle Refrain",
    content: "Your words paint such vivid imagery of autumn's melancholy.",
    reactions: 8,
    createdAt: "1 hour ago",
  },
  {
    id: 2,
    postTitle: "The Solitude of Stars",
    content: "The transformation is remarkable. The AI truly captured the essence.",
    reactions: 12,
    createdAt: "3 hours ago",
  },
]

const bookmarkedPosts = [
  {
    id: 3,
    title: "Love's Gentle Refrain",
    author: "RomanticSoul",
    emotion: "romantic",
    reactions: 67,
    comments: 22,
  },
  {
    id: 4,
    title: "The Courage Within",
    author: "BraveHeart",
    emotion: "inspiring",
    reactions: 43,
    comments: 18,
  },
]

const badges = [
  { id: 1, name: "First Post", description: "Published your first post", earned: true, icon: "🎉" },
  { id: 2, name: "Poet Laureate", description: "Posts in all categories", earned: true, icon: "👑" },
  { id: 3, name: "Popular Writer", description: "10+ reactions on a post", earned: true, icon: "❤️" },
  { id: 4, name: "Community Favorite", description: "10+ bookmarks on a post", earned: false, icon: "⭐" },
  { id: 5, name: "Regular Visitor", description: "10th visit to the site", earned: true, icon: "🏠" },
  { id: 6, name: "Conversation Starter", description: "10+ comments on your posts", earned: false, icon: "💬" },
  { id: 7, name: "Literary Master", description: "50+ total reactions", earned: false, icon: "📚" },
  { id: 8, name: "Dedicated Reader", description: "50+ bookmarked posts", earned: false, icon: "🔖" },
  { id: 9, name: "Active Commenter", description: "25+ comments posted", earned: false, icon: "✍️" },
  { id: 10, name: "Emotion Explorer", description: "Used all emotion tags", earned: false, icon: "🎭" },
  { id: 11, name: "Weekly Writer", description: "Posted every day for a week", earned: false, icon: "📅" },
  { id: 12, name: "Community Champion", description: "Helped moderate content", earned: false, icon: "🛡️" },
]

const emotionColors = {
  melancholy: "bg-blue-100 text-blue-800",
  peaceful: "bg-teal-100 text-teal-800",
  romantic: "bg-pink-100 text-pink-800",
  inspiring: "bg-green-100 text-green-800",
}

export function MyPageTabs() {
  const [activeTab, setActiveTab] = useState("posts")
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-1">@{user.username}</p>
              <p className="text-gray-600 mb-4">{user.email}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">456</div>
                  <div className="text-sm text-gray-600">Reactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">234</div>
                  <div className="text-sm text-gray-600">Bookmarks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">89</div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/profile/edit">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                </Link>
                <Link href={`/profile/user/${user.username}`}>
                  <Button className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Go to Public Profile</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">My Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {myPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={emotionColors[post.emotion as keyof typeof emotionColors]}>
                        {post.emotion}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.createdAt}</span>
                      {post.isHidden && <Badge variant="secondary">Hidden</Badge>}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Original:</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{post.originalContent}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Transformed:</p>
                        <p className="text-sm text-gray-800 bg-blue-50 p-2 rounded">{post.transformedContent}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.reactions}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Bookmark className="h-4 w-4" />
                        <span>{post.bookmarks}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.isHidden ? "Show" : "Hide"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {myComments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-500">on</span>
                      <Link
                        href={`/post/${comment.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {comment.postTitle}
                      </Link>
                      <span className="text-sm text-gray-500">{comment.createdAt}</span>
                    </div>

                    <p className="text-gray-800 mb-3">{comment.content}</p>

                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Heart className="h-4 w-4" />
                      <span>{comment.reactions} reactions</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="bookmarks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {bookmarkedPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Badge className={`mb-2 ${emotionColors[post.emotion as keyof typeof emotionColors]}`}>
                    {post.emotion}
                  </Badge>

                  <Link href={`/post/${post.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-3">by {post.author}</p>

                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{post.reactions}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {badges.map((badge) => (
              <Card
                key={badge.id}
                className={`${badge.earned ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2 opacity-75">{badge.earned ? badge.icon : "🔒"}</div>
                  <h3 className={`font-semibold mb-1 ${badge.earned ? "text-gray-900" : "text-gray-500"}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs ${badge.earned ? "text-gray-700" : "text-gray-400"}`}>{badge.description}</p>
                  {badge.earned && <Badge className="mt-2 bg-yellow-100 text-yellow-800">Earned</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Badge Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {badges.filter((b) => b.earned).length} / {badges.length}
                </div>
                <p className="text-gray-600">Badges Earned</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(badges.filter((b) => b.earned).length / badges.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
