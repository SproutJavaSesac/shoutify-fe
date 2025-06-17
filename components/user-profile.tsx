"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Award,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";

const userData = {
  username: "LiteraryMuse",
  joinedDate: "March 2024",
  totalPosts: 23,
  totalReactions: 456,
  totalBookmarks: 234,
  totalComments: 89,
  badges: [
    { name: "First Post", icon: "🎉" },
    { name: "Poet Laureate", icon: "👑" },
    { name: "Popular Writer", icon: "❤️" },
    { name: "Regular Visitor", icon: "🏠" },
  ],
};

const categoryRankings = [
  { category: "Classical Poetry", rank: 2, posts: 8, reactions: 156 },
  { category: "Modern Poem", rank: 1, posts: 12, reactions: 234 },
  { category: "Prose", rank: 5, posts: 3, reactions: 66 },
];

const topPosts = [
  {
    id: 1,
    title: "The Whispered Secrets of Autumn's Embrace",
    emotion: "melancholy",
    reactions: 89,
    comments: 23,
    bookmarks: 45,
  },
  {
    id: 2,
    title: "Dancing Through Time's Gentle Embrace",
    emotion: "nostalgic",
    reactions: 76,
    comments: 18,
    bookmarks: 38,
  },
  {
    id: 3,
    title: "Morning Coffee Meditations",
    emotion: "peaceful",
    reactions: 65,
    comments: 15,
    bookmarks: 32,
  },
];

const emotionColors = {
  melancholy: "bg-blue-100 text-blue-800",
  nostalgic: "bg-orange-100 text-orange-800",
  peaceful: "bg-teal-100 text-teal-800",
};

export function UserProfile({ username }: { username: string }) {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-500" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userData.username}
              </h1>
              <p className="text-gray-600 mb-4">
                Member since {userData.joinedDate}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.totalPosts}
                  </div>
                  <div className="text-sm text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.totalReactions}
                  </div>
                  <div className="text-sm text-gray-600">Reactions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.totalBookmarks}
                  </div>
                  <div className="text-sm text-gray-600">Bookmarks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {userData.totalComments}
                  </div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {userData.badges.map((badge, index) => (
                  <Badge key={index} className="bg-yellow-100 text-yellow-800">
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Category Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Category Rankings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryRankings.map((ranking, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {ranking.category}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {ranking.posts} posts • {ranking.reactions} reactions
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      #{ranking.rank}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Top Posts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      className={
                        emotionColors[
                          post.emotion as keyof typeof emotionColors
                        ]
                      }
                    >
                      {post.emotion}
                    </Badge>
                    <span className="text-sm font-bold text-gray-600">
                      #{index + 1}
                    </span>
                  </div>

                  <Link href={`/posts/${post.id}`}>
                    <h3 className="font-medium text-gray-900 hover:text-gray-700 cursor-pointer mb-2">
                      {post.title}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Trend Graph Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Ranking trend graph would be displayed here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
