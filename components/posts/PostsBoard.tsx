"use client";

import { useState } from "react";
import PostsList from "./PostsList";
import type { ConceptType, PostSortType } from "@/types/posts";

const CONCEPT_OPTIONS: { value: ConceptType; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "classical_poetry", label: "고전시가" },
  { value: "poetry", label: "시" },
  { value: "novel", label: "소설" },
  { value: "drama", label: "희곡" },
  { value: "essay", label: "수필" },
];

const SORT_OPTIONS: { value: PostSortType; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "reactions", label: "반응 많은 순" },
  { value: "comments", label: "댓글 많은 순" },
];

export default function PostsBoard() {
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>("all");
  const [selectedSort, setSelectedSort] = useState<PostSortType>("latest");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    setSearchQuery(searchKeyword.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchQuery("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">게시판</h1>
        <p className="text-gray-600">
          로그인 없이도 모든 게시글을 확인할 수 있습니다.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              컨셉
            </label>
            <select
              value={selectedConcept}
              onChange={(e) =>
                setSelectedConcept(e.target.value as ConceptType)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CONCEPT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              정렬
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as PostSortType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색
            </label>
            <div className="flex">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="게시글 검색..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                검색
              </button>
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between bg-blue-50 px-4 py-2 rounded">
            <span className="text-sm text-blue-700">
              '<strong>{searchQuery}</strong>' 검색 결과
            </span>
            <button
              onClick={handleClearSearch}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              검색 초기화
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
        <span>
          <strong>컨셉:</strong>{" "}
          {CONCEPT_OPTIONS.find((o) => o.value === selectedConcept)?.label}
        </span>
        <span>
          <strong>정렬:</strong>{" "}
          {SORT_OPTIONS.find((o) => o.value === selectedSort)?.label}
        </span>
      </div>

      <PostsList
        key={`${selectedConcept}-${selectedSort}-${searchQuery}`}
        initialSort={selectedSort}
        concept={selectedConcept === "all" ? undefined : selectedConcept}
        limit={10}
      />
    </div>
  );
}
