"use client";

import { useState } from "react";
import { PostFeed } from "@/components/post-feed";
import { PopularPosts } from "@/components/popular-posts";
import { CategoryTabs } from "@/components/category-tabs";
import { SortOptions } from "@/components/sort-options";
import { SearchBar } from "@/components/search-bar";
import PostsBoard from "@/components/posts/PostsBoard";

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-gray-50">
      <PostsBoard />
    </main>
  );
}
