"use client";

import { Button } from "@/components/ui/button";
import { Pagination as PaginationType } from "@/types/apis";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  pagination?: PaginationType; // optional로 변경
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "default" | "lg";
  showFirstLastButtons?: boolean; // 맨 처음/끝 버튼 표시 여부
}

export function Pagination({
  pagination,
  onPageChange,
  maxVisiblePages = 10,
  className = "",
  showLabels = true,
  size = "sm",
  showFirstLastButtons = true,
}: Readonly<PaginationProps>) {
  // pagination이 없으면 렌더링하지 않음
  if (!pagination) {
    return null;
  }

  const { currentPage, totalPages, hasNext, hasPrevious } = pagination;

  const handleFirst = () => {
    onPageChange(0);
  };

  const handleLast = () => {
    onPageChange(totalPages - 1);
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(Math.max(0, currentPage - 1));
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(Math.min(totalPages - 1, currentPage + 1));
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // 표시할 페이지 번호들을 계산
  const getVisiblePages = () => {
    const pages = [];
    const visibleCount = Math.min(maxVisiblePages, totalPages);

    let startPage = 0;
    let endPage = visibleCount - 1;

    // 현재 페이지를 중심으로 페이지 범위 조정
    if (totalPages > maxVisiblePages) {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(0, currentPage - halfVisible);
      endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

      // 끝에서 시작 페이지 재조정
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={`flex justify-center items-center space-x-2 mt-6 ${className}`}
    >
      {/* 맨 처음 버튼 */}
      {showFirstLastButtons && (
        <Button
          onClick={handleFirst}
          disabled={!hasPrevious}
          variant="outline"
          size={size}
          className="flex items-center gap-1"
        >
          <ChevronsLeft className="h-4 w-4" />
          {showLabels && <span>처음</span>}
        </Button>
      )}

      {/* 이전 버튼 */}
      <Button
        onClick={handlePrevious}
        disabled={!hasPrevious}
        variant="outline"
        size={size}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        {showLabels && <span>이전</span>}
      </Button>

      {/* 페이지 번호들 */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page) => (
          <Button
            key={page}
            onClick={() => handlePageClick(page)}
            variant={currentPage === page ? "default" : "outline"}
            size={size}
            className="min-w-[2.5rem]"
          >
            {page + 1}
          </Button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <Button
        onClick={handleNext}
        disabled={!hasNext}
        variant="outline"
        size={size}
        className="flex items-center gap-1"
      >
        {showLabels && <span>다음</span>}
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* 맨 끝 버튼 */}
      {showFirstLastButtons && (
        <Button
          onClick={handleLast}
          disabled={!hasNext}
          variant="outline"
          size={size}
          className="flex items-center gap-1"
        >
          {showLabels && <span>마지막</span>}
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
