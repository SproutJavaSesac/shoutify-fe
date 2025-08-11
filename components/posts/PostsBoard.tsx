"use client";

import {
  FilterBar,
  FilterSearchBar,
  FilterSortSelect,
} from "@/components/commons";
import type { ConceptType, PostSortType } from "@/types/posts";
import { useState } from "react";
import PostsList from "./PostsList";

const SORT_OPTIONS: { value: PostSortType; label: string }[] = [
  { value: "createdAt", label: "최신순" },
  { value: "reactions", label: "반응 많은 순" },
  { value: "comments", label: "댓글 많은 순" },
];

export default function PostsBoard() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>("ALL");
  const [selectedSort, setSelectedSort] = useState<PostSortType>("createdAt");

  const handleSearch = () => {
    // 검색 로직은 FilterSearchBar의 onSearch에서 처리
  };

  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedConcept("ALL");
    setSelectedSort("createdAt");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">게시판</h1>
        <p className="text-gray-600">
          로그인 없이도 모든 게시글을 확인할 수 있습니다.
        </p>
      </div>

      {/* 필터 - 깔끔한 드롭다운 스타일 */}
      <FilterBar title="게시글 필터" onReset={handleResetFilters}>
        <FilterSortSelect
          options={SORT_OPTIONS}
          value={selectedSort}
          onValueChange={(value) => setSelectedSort(value as PostSortType)}
          placeholder="정렬 방식"
          className="w-28"
        />
        <FilterSearchBar
          onSearch={(query) => setSearchKeyword(query)}
          placeholder="제목, 내용, 작성자로 검색..."
          initialValue={searchKeyword}
          className="flex-1"
        />
      </FilterBar>

      <PostsList
        key={`${selectedConcept}-${selectedSort}-${searchKeyword}`}
        initialSort={selectedSort}
        concept={selectedConcept}
        limit={10}
        keyword={searchKeyword}
      />
    </div>
  );
}
