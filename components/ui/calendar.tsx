"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  showTodayButton?: boolean;
  onTodayClick?: () => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showTodayButton = false,
  onTodayClick,
  ...props
}: CalendarProps) {
  const today = React.useMemo(() => new Date(), []);

  // range mode와 single mode를 모두 지원하도록 수정
  const isToday = React.useMemo(() => {
    if (!props.selected) return false;

    // single mode인 경우 (Date)
    if (props.selected instanceof Date) {
      if (!isValid(props.selected) || !isValid(today)) return false;
      return (
        format(props.selected, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
      );
    }

    // range mode인 경우 (DateRange)
    if (typeof props.selected === "object" && "from" in props.selected) {
      const range = props.selected as { from?: Date; to?: Date };
      if (range.from && isValid(range.from) && isValid(today)) {
        const todayFormatted = format(today, "yyyy-MM-dd");
        const fromFormatted = format(range.from, "yyyy-MM-dd");

        if (fromFormatted === todayFormatted) return true;

        if (range.to && isValid(range.to)) {
          const toFormatted = format(range.to, "yyyy-MM-dd");
          return toFormatted === todayFormatted;
        }
      }
    }

    return false;
  }, [props.selected, today]);

  return (
    <div className="relative">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        {...props}
      />

      {/* 오늘로 가기 버튼 - 달력 하단에 별도 영역으로 분리 */}
      {showTodayButton && onTodayClick && !isToday && (
        <div className="p-3 mt-2 border-t border-border flex justify-end">
          <Button
            variant="default"
            size="sm"
            onClick={onTodayClick}
            className="h-8 text-xs font-medium px-3"
          >
            현재
          </Button>
        </div>
      )}
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
