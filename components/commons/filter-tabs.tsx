"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface TabOption {
  value: string;
  label: string;
  count?: number; // 선택적으로 카운트 표시
}

interface FilterTabsProps {
  options: TabOption[];
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "pills" | "underline";
}

export function FilterTabs({
  options,
  value,
  onValueChange,
  className = "",
  size = "default",
  variant = "default",
}: Readonly<FilterTabsProps>) {
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "lg":
        return "text-base px-4 py-3";
      default:
        return "text-sm px-3 py-2";
    }
  };

  const getVariantClass = (isActive: boolean) => {
    switch (variant) {
      case "pills":
        return isActive
          ? "bg-blue-500 text-white rounded-full"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full";
      case "underline":
        return isActive
          ? "border-b-2 border-blue-500 text-blue-600 bg-transparent"
          : "border-b-2 border-transparent text-gray-600 hover:text-gray-800 bg-transparent";
      default:
        return isActive
          ? "bg-blue-500 text-white rounded-md"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-md";
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <Button
            key={option.value}
            variant="ghost"
            onClick={() => onValueChange(option.value)}
            className={`
              ${getSizeClass()} 
              ${getVariantClass(isActive)}
              transition-all duration-200
            `}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={`ml-1 ${isActive ? "text-white" : "text-gray-500"}`}
              >
                ({option.count})
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
