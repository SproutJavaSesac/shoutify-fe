"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface FilterSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
  showClearButton?: boolean;
  autoSubmitDelay?: number; // 자동 검색 딜레이 (ms)
}

export function FilterSearchBar({
  onSearch,
  placeholder = "검색어를 입력하세요...",
  initialValue = "",
  className = "",
  showClearButton = true,
  autoSubmitDelay,
}: Readonly<FilterSearchBarProps>) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSearch = () => {
    onSearch(searchQuery.trim());
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (value: string) => {
    setSearchQuery(value);

    // 자동 검색이 설정된 경우
    if (autoSubmitDelay && autoSubmitDelay > 0) {
      const timeoutId = setTimeout(() => {
        onSearch(value.trim());
      }, autoSubmitDelay);

      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          value={searchQuery}
          onChange={(e) => handleChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pr-10"
        />
        {showClearButton && searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!autoSubmitDelay && (
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
      )}
    </div>
  );
}
