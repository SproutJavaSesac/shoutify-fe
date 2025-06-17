"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const categories = ["All", "Classical Poetry", "Biblical", "Modern Poem", "Prose", "Haiku", "Sonnet", "Free Verse"]

interface CategoryTabsProps {
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-lg border border-gray-200">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category)}
          className={activeCategory === category ? "bg-gray-800 hover:bg-gray-900" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
