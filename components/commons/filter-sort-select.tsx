"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SortOption {
  value: string;
  label: string;
}

interface FilterSortSelectProps {
  options: SortOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
}

export function FilterSortSelect({
  options,
  value,
  onValueChange,
  placeholder = "정렬 방식 선택",
  className = "",
  label,
  icon,
}: Readonly<FilterSortSelectProps>) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center justify-center w-full">
            {icon && <span className="mr-1">{icon}</span>}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
