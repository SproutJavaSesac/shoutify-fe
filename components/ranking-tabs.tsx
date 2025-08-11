"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  PenTool,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  format,
  getYear,
  isAfter,
  isSameMonth,
  isSameWeek,
  startOfMonth,
  startOfWeek,
  subWeeks,
  subYears,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useRankingList } from "@/lib/hooks/useRankings";
import { RankingCategoryType, RankingPeriodType } from "@/types/rankings";
import { MEMBER_ROUTES } from "@/constants/members";

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "down":
      return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  }
};

const getRankChangeDisplay = (rankChange: string) => {
  if (rankChange === "NEW") {
    return (
      <Badge
        variant="secondary"
        className="text-xs px-2 py-1 bg-blue-100 text-blue-700"
      >
        신규
      </Badge>
    );
  }
  if (rankChange === "-") {
    return (
      <Badge
        variant="outline"
        className="text-xs px-2 py-1 border-gray-300 text-gray-500"
      >
        -
      </Badge>
    );
  }
  const isUp = rankChange.startsWith("+");
  const number = rankChange.replace(/[+-]/, "");
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs px-2 py-1 font-medium flex items-center gap-1",
        isUp
          ? "border-green-300 text-green-700 bg-green-50"
          : "border-red-300 text-red-700 bg-red-50",
      )}
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {number}
    </Badge>
  );
};

// 기간에 따른 시작 날짜 계산
const getStartDateByPeriod = (
  period: RankingPeriodType,
  baseDate: Date = new Date(),
) => {
  switch (period) {
    case "DAILY":
      return baseDate;
    case "WEEKLY":
      // 월요일부터 시작하는 주
      return startOfWeek(baseDate, { weekStartsOn: 1 });
    case "MONTHLY":
      return startOfMonth(baseDate);
    default:
      return baseDate;
  }
};

// 기간 라벨
const getPeriodLabel = (period: RankingPeriodType) => {
  switch (period) {
    case "DAILY":
      return "일간";
    case "WEEKLY":
      return "주간";
    case "MONTHLY":
      return "월간";
    default:
      return period;
  }
};

// 날짜 표시 형식
const getDateDisplayFormat = (period: RankingPeriodType, date: Date) => {
  switch (period) {
    case "DAILY":
      return format(date, "yyyy년 MM월 dd일", { locale: ko });
    case "WEEKLY":
      const weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${format(date, "yyyy년 MM월 dd일", { locale: ko })} - ${format(weekEnd, "MM월 dd일", { locale: ko })}`;
    case "MONTHLY":
      return format(date, "yyyy년 MM월", { locale: ko });
    default:
      return format(date, "yyyy년 MM월 dd일", { locale: ko });
  }
};

// 통합 날짜/기간 선택 컴포넌트
const PeriodCalendar = ({
  periodType,
  selectedDate,
  onDateChange,
  onOpenChange,
}: {
  periodType: RankingPeriodType;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const today = new Date();

  const navigatePeriod = (
    direction: "prev" | "next",
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    let newDate: Date;

    switch (periodType) {
      case "WEEKLY":
        newDate =
          direction === "prev"
            ? subWeeks(selectedDate, 1)
            : addWeeks(selectedDate, 1);
        break;
      case "MONTHLY":
        newDate =
          direction === "prev"
            ? subYears(selectedDate, 1)
            : addYears(selectedDate, 1);
        break;
      default:
        newDate = selectedDate;
    }

    // 미래 날짜로 가지 않도록 제한
    const endDate = getEndDateByPeriod(periodType, newDate);
    if (!isAfter(endDate, today)) {
      onDateChange(newDate);
    }
  };

  const getEndDateByPeriod = (period: RankingPeriodType, date: Date) => {
    switch (period) {
      case "WEEKLY":
        return endOfWeek(date, { weekStartsOn: 1 });
      case "MONTHLY":
        return endOfMonth(date);
      default:
        return date;
    }
  };

  const getPeriodDisplay = () => {
    switch (periodType) {
      case "DAILY":
        return format(selectedDate, "yyyy년 MM월 dd일", { locale: ko });
      case "WEEKLY":
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })} - ${format(weekEnd, "MM월 dd일", { locale: ko })}`;
      case "MONTHLY":
        return format(selectedDate, "yyyy년 MM월", { locale: ko });
    }
  };

  const isCurrentPeriod = () => {
    switch (periodType) {
      case "DAILY":
        return (
          format(selectedDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
        );
      case "WEEKLY":
        return isSameWeek(selectedDate, today, { weekStartsOn: 1 });
      case "MONTHLY":
        return isSameMonth(selectedDate, today);
      default:
        return false;
    }
  };

  const canGoNext = () => {
    const nextDate =
      periodType === "WEEKLY"
        ? addWeeks(selectedDate, 1)
        : periodType === "MONTHLY"
          ? addMonths(selectedDate, 1)
          : selectedDate;
    const endDate = getEndDateByPeriod(periodType, nextDate);
    return !isAfter(endDate, today);
  };

  if (periodType === "DAILY") {
    return (
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          disabled={(date) => isAfter(date, today)}
          locale={ko}
          className="rounded-md border-0"
          defaultMonth={selectedDate} // 초기에만 선택한 날짜 기준으로 표시
          showTodayButton={true}
          onTodayClick={() => onDateChange(today)}
        />
      </div>
    );
  }

  if (periodType === "WEEKLY") {
    return (
      <div>
        <WeekCalendar selectedDate={selectedDate} onDateChange={onDateChange} />
      </div>
    );
  }

  return (
    <div className="w-[320px] p-3 border-0">
      {/* 월간에서는 헤더를 간소화 */}
      {periodType !== "MONTHLY" && (
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onMouseDown={(e) => navigatePeriod("prev", e)}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <div className="font-medium text-sm text-muted-foreground">
              {getPeriodLabel(periodType)}
            </div>
            <div className="font-semibold">{getPeriodDisplay()}</div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onMouseDown={(e) => navigatePeriod("next", e)}
            disabled={!canGoNext()}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 월간에서는 제목만 표시 */}
      {periodType === "MONTHLY" && (
        <div className="mb-4 text-center">
          <div className="font-medium text-sm text-muted-foreground">
            {getPeriodLabel(periodType)}
          </div>
        </div>
      )}

      {/* 기간별 선택 UI */}
      <div className="min-h-[240px] max-h-[280px] overflow-y-auto">
        {periodType === "MONTHLY" && (
          <MonthSelector
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        )}
      </div>

      {/* 현재 기간으로 가기 버튼 */}
      {!isCurrentPeriod() && (
        <div className="pt-3 border-t border-border flex justify-end">
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              onDateChange(getStartDateByPeriod(periodType, today))
            }
            className="h-8 text-xs font-medium px-3"
          >
            현재
          </Button>
        </div>
        // <div className="mt-4 pt-3 border-t">
        //   <Button
        //     variant="outline"
        //     size="sm"
        //     onClick={() =>
        //       onDateChange(getStartDateByPeriod(periodType, today))
        //     }
        //     className="w-full flex items-center gap-2"
        //   >
        //     <RotateCcw className="h-3 w-3" />
        //     현재 {getPeriodLabel(periodType)}로 이동
        //   </Button>
        // </div>
      )}
    </div>
  );
};

// 주간 달력 컴포넌트 (react-day-picker range mode 사용)
const WeekCalendar = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const today = new Date();

  // 현재 선택된 날짜의 주간 범위 계산
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const selectedRange: DateRange = { from: weekStart, to: weekEnd };

  // 주간 선택 핸들러
  const handleDayClick = (day: Date) => {
    if (day && !isAfter(day, today)) {
      const newWeekStart = startOfWeek(day, { weekStartsOn: 1 });
      onDateChange(newWeekStart);
    }
  };

  // 날짜가 비활성화되어야 하는지 확인
  const isDateDisabled = (day: Date) => {
    return isAfter(day, today);
  };

  return (
    <div>
      <Calendar
        mode="range"
        selected={selectedRange}
        onDayClick={handleDayClick}
        disabled={isDateDisabled}
        locale={ko}
        showOutsideDays={true}
        className="rounded-md border-0"
        defaultMonth={selectedDate} // 초기에만 선택한 날짜 기준으로 표시
        showTodayButton={true}
        onTodayClick={() =>
          onDateChange(startOfWeek(today, { weekStartsOn: 1 }))
        }
      />
    </div>
  );
};

// 월간 선택기
const MonthSelector = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const today = new Date();
  const currentYear = getYear(selectedDate);
  const [displayYear, setDisplayYear] = useState(currentYear);
  const months = [];
  const selectedMonthRef = useRef<HTMLButtonElement>(null);

  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(displayYear, month, 1);
    const monthEnd = endOfMonth(monthStart);

    // 미래 월은 제외
    if (isAfter(monthStart, today) && !isSameMonth(monthStart, today)) break;

    months.push({
      monthNumber: month + 1,
      date: monthStart,
      isSelected:
        isSameMonth(selectedDate, monthStart) && displayYear === currentYear,
    });
  }

  // displayYear가 변경될 때마다 스크롤
  useEffect(() => {
    if (selectedMonthRef.current && displayYear === currentYear) {
      selectedMonthRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [displayYear, currentYear]);

  const canGoPrevYear = displayYear > 2020;
  const canGoNextYear = displayYear < getYear(today);

  return (
    <div className="space-y-4">
      {/* 연도 네비게이션 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDisplayYear((prev) => prev - 1)}
          disabled={!canGoPrevYear}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="font-semibold text-lg">{displayYear}년</div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setDisplayYear((prev) => prev + 1)}
          disabled={!canGoNextYear}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 월 선택 그리드 */}
      <div className="grid grid-cols-3 gap-2 pb-3">
        {months.map((month) => (
          <Button
            key={month.monthNumber}
            ref={month.isSelected ? selectedMonthRef : null}
            variant={month.isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onDateChange(month.date)}
            className="h-auto p-3 flex flex-col items-center"
          >
            <div className="font-medium">{month.monthNumber}월</div>
          </Button>
        ))}
      </div>
    </div>
  );
};

// 연간 선택기
const YearSelector = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) => {
  const today = new Date();
  const currentYear = getYear(today);
  const selectedYear = getYear(selectedDate);
  const years = [];
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  // 2020년부터 현재 연도까지
  for (let year = 2020; year <= currentYear; year++) {
    const yearStart = new Date(year, 0, 1);
    years.push({
      year,
      date: yearStart,
      isSelected: selectedYear === year,
    });
  }

  // 선택된 연도로 스크롤
  useEffect(() => {
    if (selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {years.map((year) => (
        <Button
          key={year.year}
          ref={year.isSelected ? selectedYearRef : null}
          variant={year.isSelected ? "default" : "outline"}
          size="sm"
          onClick={() => onDateChange(year.date)}
          className="h-auto p-3 flex flex-col items-center"
        >
          <div className="font-medium">{year.year}년</div>
        </Button>
      ))}
    </div>
  );
};

// 카테고리별 정보 반환
function getCategoryInfo(category: RankingCategoryType) {
  const categoryMap = {
    POST: {
      label: "게시글 랭킹",
      name: "게시글 랭킹",
      description: "가장 많은 게시글을 작성한 회원들의 랭킹입니다.",
      icon: PenTool,
    },
    COMMENT: {
      label: "댓글 랭킹",
      name: "댓글 랭킹",
      description: "가장 많은 댓글을 작성한 회원들의 랭킹입니다.",
      icon: MessageCircle,
    },
    SCORE: {
      label: "점수 랭킹",
      name: "점수 랭킹",
      description: "활동 점수가 높은 회원들의 랭킹입니다.",
      icon: Star,
    },
  };

  return categoryMap[category];
}

export function RankingTabs() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<RankingPeriodType>("DAILY");
  const [selectedCategory, setSelectedCategory] =
    useState<RankingCategoryType>("POST");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // 기간 변경 시 해당 기간의 시작 날짜로 설정
  useEffect(() => {
    const startDate = getStartDateByPeriod(selectedPeriod, selectedDate);
    setSelectedDate(startDate);
  }, [selectedPeriod]);

  const periodValue = format(selectedDate, "yyyy-MM-dd");

  const {
    data: rankingData,
    loading,
    error,
    refetch,
  } = useRankingList({
    category: selectedCategory,
    periodType: selectedPeriod,
    periodValue: periodValue,
  });

  // 랭킹 데이터를 순위순으로 정렬
  const sortedRankings = rankingData?.rankings
    ? [...rankingData.rankings].sort((a, b) => a.rank - b.rank)
    : [];

  const handlePeriodChange = (period: RankingPeriodType) => {
    setSelectedPeriod(period);
  };

  const handleCategoryChange = (category: RankingCategoryType) => {
    setSelectedCategory(category);
  };

  // 오늘로 돌아가기
  const goToToday = () => {
    const today = new Date();
    const adjustedDate = getStartDateByPeriod(selectedPeriod, today);
    setSelectedDate(adjustedDate);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
        <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            랭킹 데이터를 불러오는 중 오류가 발생했습니다: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryInfo = getCategoryInfo(selectedCategory);
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 기간 선택 */}
          <Tabs
            value={selectedPeriod}
            onValueChange={(value) =>
              handlePeriodChange(value as RankingPeriodType)
            }
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="DAILY">일간</TabsTrigger>
              <TabsTrigger value="WEEKLY">주간</TabsTrigger>
              <TabsTrigger value="MONTHLY">월간</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 통합 날짜/기간 선택 */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-center text-center font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="flex-1 text-center">
                  {getDateDisplayFormat(selectedPeriod, selectedDate)}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <PeriodCalendar
                periodType={selectedPeriod}
                selectedDate={selectedDate}
                onDateChange={(date) => {
                  handleDateChange(date);
                  setIsPopoverOpen(false);
                }}
                onOpenChange={setIsPopoverOpen}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 카테고리별 랭킹 탭 */}
      <Tabs
        value={selectedCategory}
        onValueChange={(value) =>
          handleCategoryChange(value as RankingCategoryType)
        }
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="POST" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            게시글 랭킹
          </TabsTrigger>
          <TabsTrigger
            value="COMMENT"
            disabled
            className="flex items-center gap-2 opacity-50"
          >
            <MessageCircle className="h-4 w-4" />
            댓글 랭킹
            <Badge variant="secondary" className="text-xs ml-1">
              준비중
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="SCORE"
            disabled
            className="flex items-center gap-2 opacity-50"
          >
            <Star className="h-4 w-4" />
            점수 랭킹
            <Badge variant="secondary" className="text-xs ml-1">
              준비중
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* 현재 선택된 카테고리의 랭킹 표시 */}
        <TabsContent value={selectedCategory}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                {categoryInfo.name}
                <Badge variant="outline">
                  {getPeriodLabel(selectedPeriod)}
                  {` (${getDateDisplayFormat(selectedPeriod, selectedDate)})`}
                </Badge>
              </CardTitle>
              {categoryInfo.description && (
                <p className="text-sm text-muted-foreground">
                  {categoryInfo.description}
                </p>
              )}
            </CardHeader>

            <CardContent>
              {selectedCategory === "POST" ? (
                <div className="space-y-4">
                  {sortedRankings.length > 0 ? (
                    sortedRankings.map((ranking, index) => (
                      <div
                        key={ranking.memberId}
                        className={cn(
                          "relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                          ranking.rank <= 3
                            ? "bg-gradient-to-r from-yellow-50/50 to-orange-50/50 border-yellow-200"
                            : "bg-card hover:bg-accent/30 border-border",
                        )}
                      >
                        {/* 순위 배지 */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative">
                            <Badge
                              variant={
                                ranking.rank === 1
                                  ? "default"
                                  : ranking.rank === 2
                                    ? "secondary"
                                    : ranking.rank === 3
                                      ? "outline"
                                      : "outline"
                              }
                              className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-base",
                                ranking.rank === 1 &&
                                  "bg-yellow-500 text-white border-yellow-400",
                                ranking.rank === 2 &&
                                  "bg-gray-400 text-white border-gray-300",
                                ranking.rank === 3 &&
                                  "bg-orange-500 text-white border-orange-400",
                              )}
                            >
                              {ranking.rank}
                            </Badge>
                          </div>

                          {/* 순위 변동 표시 */}
                          <div className="flex justify-center">
                            {getRankChangeDisplay(ranking.rankChange)}
                          </div>
                        </div>

                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={ranking.memberProfileImageUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100">
                            <User className="h-6 w-6 text-gray-600" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link
                              href={MEMBER_ROUTES.MEMBER_PROFILE(
                                ranking.memberNickname,
                              )}
                              className="font-semibold hover:text-blue-600 transition-colors truncate text-lg"
                            >
                              {ranking.memberNickname}
                            </Link>
                            {ranking.rank <= 3 && (
                              <Badge variant="secondary" className="text-xs">
                                TOP {ranking.rank}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getPeriodLabel(selectedPeriod)} 작성 글 수:{" "}
                            {ranking.categoryValue}개
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            <span className="font-bold text-xl text-foreground">
                              {ranking.categoryValue}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              개
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getPeriodLabel(selectedPeriod)} 총계
                          </p>
                        </div>

                        {/* 상위 3위 리본 효과 */}
                        {ranking.rank <= 3 && (
                          <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-yellow-400/20 border-r-transparent" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">
                        랭킹 데이터가 없습니다
                      </h3>
                      <p className="text-sm">
                        선택한 기간에 대한 랭킹 데이터가 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-lg font-medium mb-2">
                    준비 중인 기능입니다
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryInfo.name} 기능은 곧 추가될 예정입니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
