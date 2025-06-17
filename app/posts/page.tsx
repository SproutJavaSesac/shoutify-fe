"use client"

import { useState } from "react"
import { PostFeed } from "@/components/post-feed"
import { PopularPosts } from "@/components/popular-posts"
import { CategoryTabs } from "@/components/category-tabs"
import { SortOptions } from "@/components/sort-options"
import { SearchBar } from "@/components/search-bar"

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Popular Posts Carousel */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Posts</h2>
        <PopularPosts />
      </section>

      {/* Category Tabs */}
      <CategoryTabs onCategoryChange={setSelectedCategory} />

      {/* Sort Options and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedCategory === "All" ? "Recent Posts" : `${selectedCategory} Posts`}
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <SearchBar onSearch={setSearchQuery} placeholder="Search posts..." />
          <SortOptions />
        </div>
      </div>

      {/* Post Feed */}
      <PostFeed selectedCategory={selectedCategory} searchQuery={searchQuery} />
    </div>
  )
}
