"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FilterBarProps {
  children: React.ReactNode;
  onReset?: () => void;
  className?: string;
  showResetButton?: boolean;
  title?: string;
}

export function FilterBar({
  children,
  onReset,
  className = "",
  showResetButton = true,
  title,
}: Readonly<FilterBarProps>) {
  return (
    <Card className={`mb-6 ${className}`}>
      <CardContent className="p-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}

        <div className="flex flex-col gap-4">
          {/* 필터 컨트롤들 */}
          <div className="flex flex-col sm:flex-row gap-4">{children}</div>

          {/* 리셋 버튼 */}
          {showResetButton && onReset && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                초기화
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
