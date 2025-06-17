"use client"

import { useState, useMemo } from "react"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const allPosts = [
  {
    id: 1,
    title: "The Whispered Secrets of Autumn's Embrace",
    author: "LiteraryMuse",
    time: "2024-12-17 14:23",
    emotion: "melancholy",
    category: "Classical Poetry",
    preview:
      "In the golden twilight of October's gentle sigh, leaves dance their final waltz upon the stage of earth...",
    totalReactions: 45,
    comments: 12,
    hasImage: true,
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    title: "Echoes of Joy in Morning's First Light",
    author: "PoetryLover",
    time: "2024-12-17 12:15",
    emotion: "joyful",
    category: "Modern Poem",
    preview: "As dawn breaks through the veil of night, hope springs eternal in hearts that dare to dream...",
    totalReactions: 38,
    comments: 8,
    hasImage: false,
  },
  {
    id: 3,
    title: "The Solitude of Stars",
    author: "NightWriter",
    time: "2024-12-17 10:45",
    emotion: "contemplative",
    category: "Free Verse",
    preview:
      "Beneath the vast expanse of midnight's canvas, solitary thoughts find their voice in whispered prayers...",
    totalReactions: 52,
    comments: 15,
    hasImage: true,
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    title: "Love's Gentle Refrain",
    author: "RomanticSoul",
    time: "2024-12-17 08:30",
    emotion: "romantic",
    category: "Sonnet",
    preview: "In the tender moments between heartbeats, love writes its sweetest verses upon the soul...",
    totalReactions: 67,
    comments: 22,
    hasImage: false,
  },
  {
    id: 5,
    title: "The Courage Within",
    author: "BraveHeart",
    time: "2024-12-17 06:12",
    emotion: "inspiring",
    category: "Prose",
    preview: "When shadows loom and doubt whispers its cruel song, the spirit rises like phoenix from ashes...",
    totalReactions: 43,
    comments: 18,
    hasImage: true,
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    title: "Sacred Verses of Hope",
    author: "FaithfulWriter",
    time: "2024-12-17 05:45",
    emotion: "peaceful",
    category: "Biblical",
    preview: "In the beginning was the Word, and through His grace we find our path illuminated...",
    totalReactions: 29,
    comments: 11,
    hasImage: false,
  },
  {
    id: 7,
    title: "Cherry Blossoms Fall",
    author: "ZenPoet",
    time: "2024-12-17 04:30",
    emotion: "contemplative",
    category: "Haiku",
    preview: "Petals drift softly / On the gentle spring breeze / Life's fleeting beauty",
    totalReactions: 34,
    comments: 7,
    hasImage: true,
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 8,
    title: "Ode to the Morning Sun",
    author: "ClassicalBard",
    time: "2024-12-17 03:15",
    emotion: "joyful",
    category: "Classical Poetry",
    preview: "O radiant orb that breaks the night's embrace, thy golden rays do chase away despair...",
    totalReactions: 41,
    comments: 13,
    hasImage: false,
  },
  {
    id: 9,
    title: "Digital Dreams",
    author: "ModernMuse",
    time: "2024-12-17 02:00",
    emotion: "nostalgic",
    category: "Modern Poem",
    preview: "In pixels and code we find our souls, connected yet apart in this digital age...",
    totalReactions: 26,
    comments: 9,
    hasImage: true,
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 10,
    title: "The Weight of Words",
    author: "ThoughtfulScribe",
    time: "2024-12-17 01:30",
    emotion: "contemplative",
    category: "Prose",
    preview: "Each word carries the weight of intention, the burden of meaning, the power to heal or harm...",
    totalReactions: 37,
    comments: 14,
    hasImage: false,
  },
  {
    id: 11,
    title: "Moonlight Sonata in Words",
    author: "NightComposer",
    time: "2024-12-17 00:45",
    emotion: "melancholy",
    category: "Sonnet",
    preview: "When silver moonbeams dance upon the lake, and silence speaks in whispers soft and low...",
    totalReactions: 48,
    comments: 16,
    hasImage: true,
    imageUrl: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 12,
    title: "Freedom's Call",
    author: "LibertyVoice",
    time: "2024-12-16 23:30",
    emotion: "inspiring",
    category: "Free Verse",
    preview: "Break the chains that bind your spirit, let your voice ring clear and true across the valleys...",
    totalReactions: 55,
    comments: 20,
    hasImage: false,
  },
]

const emotionColors = {
  melancholy: "bg-blue-100 text-blue-800",
  joyful: "bg-yellow-100 text-yellow-800",
  contemplative: "bg-purple-100 text-purple-800",
  romantic: "bg-pink-100 text-pink-800",
  inspiring: "bg-green-100 text-green-800",
  peaceful: "bg-teal-100 text-teal-800",
  nostalgic: "bg-orange-100 text-orange-800",
}

const POSTS_PER_PAGE = 10

interface PostFeedProps {
  selectedCategory: string
  searchQuery?: string
}

export function PostFeed({ selectedCategory, searchQuery = "" }: PostFeedProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    let filtered = allPosts

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.preview.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Reset to page 1 when category or search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <Button key="prev" variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </Button>,
      )
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>,
      )
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>,
        )
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "bg-gray-800 hover:bg-gray-900" : ""}
        >
          {i}
        </Button>,
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>,
        )
      }
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>,
      )
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <Button key="next" variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </Button>,
      )
    }

    return pages
  }

  return (
    <div className="space-y-6">
      {/* Search results info */}
      {searchQuery.trim() && (
        <div className="text-sm text-gray-600">
          {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""} found for "{searchQuery}"
        </div>
      )}

      {currentPosts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={emotionColors[post.emotion as keyof typeof emotionColors]}>{post.emotion}</Badge>
                </div>

                <Link href={`/posts/${post.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-gray-700 cursor-pointer">
                    {post.title}
                  </h3>
                </Link>

                {/* Author and Time */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-600">{post.author}</span>
                  <span className="text-sm text-gray-500">{post.time}</span>
                </div>

                {/* Preview - single line with ellipsis */}
                <p className="text-gray-700 mb-4 truncate">{post.preview}</p>

                <div className="flex items-center space-x-4">
                  {/* Total reactions count only */}
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">❤️ {post.totalReactions}</span>
                  </div>

                  <Link href={`/posts/${post.id}#comments`}>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
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
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {totalPages > 1 && <div className="flex justify-center items-center space-x-2 mt-8">{renderPageNumbers()}</div>}

      {/* No posts message */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery.trim() ? `No posts found matching "${searchQuery}"` : "No posts found in this category."}
          </p>
        </div>
      )}
    </div>
  )
}
