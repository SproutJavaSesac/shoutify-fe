"use client";

import { Filter } from "lucide-react";
import { useCallback, useState } from "react";
import { FilterBar } from "./filter-bar";
import { FilterSearchBar } from "./filter-search-bar";
import { FilterSortSelect, SortOption } from "./filter-sort-select";
import { FilterTabs, TabOption } from "./filter-tabs";

// 필터 설정 인터페이스
export interface FilterConfig {
  search?: {
    placeholder?: string;
    autoSubmitDelay?: number;
  };
  tabs?: {
    options: TabOption[];
    variant?: "default" | "pills" | "underline";
  };
  sort?: {
    options: SortOption[];
    placeholder?: string;
  };
  customFilters?: React.ReactNode;
}

// 필터 상태 인터페이스
export interface FilterState {
  search: string;
  tab: string;
  sort: string;
  [key: string]: any; // 추가 필터를 위한 확장
}

interface IntegratedFilterProps {
  config: FilterConfig;
  initialState?: Partial<FilterState>;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
  title?: string;
}

export function IntegratedFilter({
  config,
  initialState = {},
  onFilterChange,
  className = "",
  title = "필터",
}: Readonly<IntegratedFilterProps>) {
  const [filters, setFilters] = useState<FilterState>({
    search: initialState.search || "",
    tab: initialState.tab || config.tabs?.options[0]?.value || "",
    sort: initialState.sort || config.sort?.options[0]?.value || "",
    ...initialState,
  });

  const updateFilter = useCallback(
    (key: string, value: any) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handleReset = useCallback(() => {
    const resetFilters: FilterState = {
      search: "",
      tab: config.tabs?.options[0]?.value || "",
      sort: config.sort?.options[0]?.value || "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  }, [config, onFilterChange]);

  return (
    <FilterBar title={title} onReset={handleReset} className={className}>
      {/* 검색 */}
      {config.search && (
        <FilterSearchBar
          onSearch={(query) => updateFilter("search", query)}
          placeholder={config.search.placeholder}
          autoSubmitDelay={config.search.autoSubmitDelay}
          initialValue={filters.search}
          className="md:col-span-2"
        />
      )}

      {/* 탭 필터 */}
      {config.tabs && (
        <FilterTabs
          options={config.tabs.options}
          value={filters.tab}
          onValueChange={(value) => updateFilter("tab", value)}
          variant={config.tabs.variant}
          className="md:col-span-2 lg:col-span-3 xl:col-span-4"
        />
      )}

      {/* 정렬 */}
      {config.sort && (
        <FilterSortSelect
          options={config.sort.options}
          value={filters.sort}
          onValueChange={(value) => updateFilter("sort", value)}
          placeholder={config.sort.placeholder}
          label="정렬"
          icon={<Filter className="h-4 w-4" />}
        />
      )}

      {/* 커스텀 필터들 */}
      {config.customFilters}
    </FilterBar>
  );
}
