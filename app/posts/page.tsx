"use client";

import { useState } from "react";
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
