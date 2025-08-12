"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  options: FilterOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  allOptionLabel?: string; // "전체" 옵션 레이블 (예: "전체", "모든 분류" 등)
  allOptionValue?: string; // "전체" 옵션의 값 (기본값: "__ALL__")
}

export function FilterSelect({
  options,
  value,
  onValueChange,
  placeholder,
  label,
  icon,
  className = "",
  allOptionLabel = "전체",
  allOptionValue = "__ALL__",
}: Readonly<FilterSelectProps>) {
  const handleValueChange = (newValue: string) => {
    // "__ALL__" 같은 특수 값은 undefined로 변환할 수 있도록 콜백에서 처리
    onValueChange(newValue);
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {label}
        </label>
      )}
      <Select value={value || allOptionValue} onValueChange={handleValueChange}>
        <SelectTrigger className="text-center">
          <div className="flex items-center justify-center w-full">
            {icon && <span className="mr-1">{icon}</span>}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {/* 전체 옵션 */}
          <SelectItem value={allOptionValue}>{allOptionLabel}</SelectItem>

          {/* 실제 옵션들 */}
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
