"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Loader2, TrendingUp, Users, PenTool, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for infinite scroll
const generatePosts = (page: number) => {
  const posts = []
  const baseId = (page - 1) * 10

  for (let i = 1; i <= 10; i++) {
    posts.push({
      id: baseId + i,
      title: `Literary Post ${baseId + i}: The Art of Expression`,
      author: `Author${((baseId + i) % 5) + 1}`,
      time: `2024-12-${17 - Math.floor((baseId + i) / 10)} ${14 - (i % 12)}:${30 + (i % 30)}`,
      emotion: ["melancholy", "joyful", "contemplative", "romantic", "inspiring"][i % 5],
      preview: `This is a beautiful literary piece that explores the depths of human emotion and experience. Post number ${baseId + i} brings unique insights into the world of creative writing and artistic expression.`,
      totalReactions: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 30) + 1,
      hasImage: Math.random() > 0.5,
      imageUrl: "/placeholder.svg?height=120&width=120",
    })
  }
  return posts
}

const emotionColors = {
  melancholy: "bg-blue-100 text-blue-800",
  joyful: "bg-yellow-100 text-yellow-800",
  contemplative: "bg-purple-100 text-purple-800",
  romantic: "bg-pink-100 text-pink-800",
  inspiring: "bg-green-100 text-green-800",
}

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Load initial posts
  useEffect(() => {
    const initialPosts = generatePosts(1)
    setPosts(initialPosts)
  }, [])

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPosts = generatePosts(page + 1)
    setPosts((prev) => [...prev, ...newPosts])
    setPage((prev) => prev + 1)

    // Stop loading after 5 pages for demo
    if (page >= 5) {
      setHasMore(false)
    }

    setLoading(false)
  }, [loading, hasMore, page])

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMorePosts()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMorePosts])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-yellow-400">Shoutify</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your thoughts into beautiful literary with the AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/write">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3">
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                </Button>
              </Link>
              <Link href="/posts">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white hover:bg-white hover:text-black px-8 py-3"
                >
                  Explore Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Active Writers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <PenTool className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-600">Literary Posts</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1M+</h3>
              <p className="text-gray-600">Reactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Literary Creations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the newest posts from our talented community of writers and poets
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/posts">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse by Category</h3>
                <p className="text-sm text-gray-600">Explore posts by style</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/ranking">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-green-200">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">View Rankings</h3>
                <p className="text-sm text-gray-600">See top posts and writers</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/write">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
                  <PenTool className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Writing</h3>
                <p className="text-sm text-gray-600">Create your literary</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={`${emotionColors[post.emotion as keyof typeof emotionColors]} font-medium`}>
                        {post.emotion}
                      </Badge>
                      {index < 3 && (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          New
                        </Badge>
                      )}
                    </div>

                    <Link href={`/post/${post.id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                      <span className="text-sm text-gray-500">{post.time}</span>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">{post.preview}</p>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">❤️</span>
                        <span className="text-sm font-medium text-gray-700">{post.totalReactions}</span>
                      </div>

                      <Link href={`/post/${post.id}#comments`}>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-blue-50">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {post.hasImage && (
                    <div className="flex-shrink-0">
                      <Image
                        src={post.imageUrl || "/placeholder.svg"}
                        alt="Post thumbnail"
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
              <span className="text-gray-600">Loading more amazing posts...</span>
            </div>
          </div>
        )}

        {/* End of posts message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You've reached the end!</h3>
            <p className="text-gray-600 mb-6">Explore more content by browsing categories</p>
            <Link href="/posts">
              <Button className="bg-blue-600 hover:bg-blue-700">Browse by Category</Button>
            </Link>
          </div>
        )}

        {/* Load more button (fallback for users who prefer clicking) */}
        {hasMore && !loading && posts.length > 0 && (
          <div className="text-center py-8">
            <Button onClick={loadMorePosts} variant="outline" size="lg" className="px-8">
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
