"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search posts..." }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleClear = () => {
    setSearchQuery("")
    onSearch("")
    setIsExpanded(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {isExpanded ? (
        <div className="flex items-center space-x-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-64"
            autoFocus
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button onClick={handleClear} variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button onClick={() => setIsExpanded(true)} variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      )}
    </div>
  )
}
