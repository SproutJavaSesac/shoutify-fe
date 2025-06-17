"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SortOptions() {
  const [sortBy, setSortBy] = useState("latest")

  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="latest">Latest</SelectItem>
        <SelectItem value="most-reactions">Most Reactions</SelectItem>
        <SelectItem value="most-comments">Most Comments</SelectItem>
      </SelectContent>
    </Select>
  )
}
