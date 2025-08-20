"use client";

import { getComment } from "@/apis/comments";
import { getPost } from "@/apis/posts";
import {
  FilterBar,
  FilterSearchBar,
  FilterSelect,
  Pagination,
} from "@/components/commons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  REPORT_ACTION_OPTIONS,
  REPORT_REASON_OPTIONS,
  REPORT_STATUS_OPTIONS,
} from "@/constants/reports";
import { useToast } from "@/hooks/use-toast";
import { useProcessReport, useReportList } from "@/lib/hooks/useReports";
import { Comment } from "@/types/comments";
import { Post } from "@/types/posts";
import {
  Report,
  ReportProcessActionType,
  ReportReasonType,
  ReportSortType,
  ReportStatusType,
} from "@/types/reports";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Loader2,
  MessageSquare,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export function ReportManagement() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    ReportStatusType | undefined
  >(undefined);
  const [selectedReason, setSelectedReason] = useState<
    ReportReasonType | undefined
  >(undefined);
  const [sortBy, setSortBy] = useState<ReportSortType>("createdAt");
  const [orderBy, setOrderBy] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [processingAction, setProcessingAction] = useState<
    ReportProcessActionType | ""
  >("");

  // 원본 콘텐츠 조회 상태
  const [originalContent, setOriginalContent] = useState<{
    post?: Post;
    comment?: Comment;
    loading: boolean;
    error?: string;
  }>({
    loading: false,
  });

  const { toast } = useToast();

  // API hooks
  const { data, loading, error, refetch } = useReportList({
    page: currentPage,
    size: 20,
    sort: sortBy,
    order: orderBy,
    statusType: selectedStatus,
    reasonType: selectedReason,
    keyword: searchKeyword || undefined,
  });

  const {
    mutate: processReport,
    loading: processLoading,
    error: processError,
  } = useProcessReport();

  // 원본 콘텐츠 조회 함수
  const fetchOriginalContent = async (report: Report) => {
    setOriginalContent({ loading: true });

    try {
      if (report.reportType === "POST" && report.postId) {
        const post = await getPost(report.postId);
        setOriginalContent({ post, loading: false });
      } else if (
        report.reportType === "COMMENT" &&
        report.postId &&
        report.commentId
      ) {
        const comment = await getComment({
          postId: report.postId,
          commentId: report.commentId,
        });
        setOriginalContent({
          comment,
          loading: false,
        });
      }
    } catch (error) {
      console.error("원본 콘텐츠 조회 실패:", error);
      setOriginalContent({
        loading: false,
        error: "원본 콘텐츠를 불러올 수 없습니다.",
      });
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedStatus(undefined);
    setSelectedReason(undefined);
    setSortBy("createdAt");
    setOrderBy("DESC");
    setCurrentPage(0);
    refetch();
  };

  const sortOptions = [
    { value: "createdAt-DESC", label: "최신순" },
    { value: "createdAt-ASC", label: "등록순" },
    { value: "updatedAt-DESC", label: "수정순" },
  ];

  const handleProcessReport = async () => {
    if (!selectedReport || !processingAction) return;

    const result = await processReport({
      reportId: selectedReport.reportId,
      body: {
        action: processingAction,
      },
    });

    if (result) {
      toast({
        title: "신고 처리 완료",
        description: `신고가 성공적으로 ${getActionLabel(processingAction)}되었습니다.`,
      });
      setSelectedReport(null);
      setProcessingAction("");
      refetch();
    }
  };

  const getStatusBadge = (status: ReportStatusType) => {
    const config = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "대기 중",
      },
      ACCEPTED: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "승인됨",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "거부됨",
      },
      POSTPONE: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        text: "보류됨",
      },
    } as const;

    const { color, icon: Icon, text } = config[status] || config.PENDING;

    return (
      <Badge variant="secondary" className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {text}
      </Badge>
    );
  };

  const getReasonLabel = (reasonType: ReportReasonType) => {
    return (
      REPORT_REASON_OPTIONS.find((option) => option.value === reasonType)
        ?.label || reasonType
    );
  };

  const getActionLabel = (action: ReportProcessActionType) => {
    return (
      REPORT_ACTION_OPTIONS.find((option) => option.value === action)?.label ||
      action
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MM월 dd일 HH:mm", { locale: ko });
    } catch {
      return dateString;
    }
  };

  // 우선순위에 따른 행 스타일링
  const getRowClassName = (report: Report) => {
    const baseClass = "hover:bg-gray-50 cursor-pointer transition-colors";

    // 높은 우선순위 - 긴급 (reportCount >= 5)
    if (report.reportCount && report.reportCount >= 5) {
      return `${baseClass} bg-red-50 border-l-4 border-l-red-500`;
    }

    // 중간 우선순위 - 주의 (reportCount >= 3)
    if (report.reportCount && report.reportCount >= 3) {
      return `${baseClass} bg-yellow-50 border-l-4 border-l-yellow-500`;
    }

    // 처리 완료된 항목은 투명하게 표시
    if (report.statusType === "ACCEPTED" || report.statusType === "REJECTED") {
      return `${baseClass} opacity-75`;
    }

    return `${baseClass} font-medium`;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              데이터 로딩 오류
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} className="mr-2">
              <Loader2 className="h-4 w-4 mr-2" />
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flag className="h-6 w-6" />
            신고 관리
          </h2>
          <p className="text-muted-foreground mt-1">
            사용자 신고를 검토하고 적절한 조치를 취합니다
          </p>
          {processError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              ⚠️ 처리 오류: {processError}
            </div>
          )}
        </div>

        {data?.summary && (
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        처리 대기
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {data.summary.pending}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        승인 완료
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {data.summary.approved}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <FilterBar title="신고 필터" onReset={handleResetFilters}>
        <div className="flex gap-4 items-center w-full">
          <FilterSearchBar
            onSearch={(query) => {
              setSearchKeyword(query);
              handleSearch();
            }}
            placeholder="신고 내용이나 사용자 검색..."
            className="flex-1"
          />

          <FilterSelect
            options={REPORT_STATUS_OPTIONS}
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value as ReportStatusType | undefined);
            }}
            placeholder="상태 전체"
            className="min-w-[120px]"
          />

          <FilterSelect
            options={REPORT_REASON_OPTIONS}
            value={selectedReason}
            onValueChange={(value) => {
              setSelectedReason(value as ReportReasonType | undefined);
            }}
            placeholder="사유 전체"
            className="min-w-[140px]"
          />
        </div>
      </FilterBar>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>신고 목록</span>
            {data?.reports.length && (
              <span className="text-sm font-normal text-muted-foreground">
                총 {data.pagination.totalCount}건
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-muted-foreground">로딩 중...</p>
            </div>
          ) : data?.reports.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>신고 대상</TableHead>
                    <TableHead>신고자</TableHead>
                    <TableHead>신고 사유</TableHead>
                    <TableHead>신고 횟수</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>신고 일시</TableHead>
                    <TableHead>최종 수정</TableHead>
                    <TableHead className="text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.reports.map((report) => (
                    <TableRow
                      key={report.reportId}
                      className={getRowClassName(report)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {report.reportType === "POST" ? "게시글" : "댓글"}
                              {report.reportCount >= 5 && (
                                <Badge className="ml-1 bg-red-100 text-red-800 text-xs">
                                  긴급
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID:{" "}
                              {report.reportType === "POST"
                                ? report.postId
                                : report.commentId}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {report.reporterNickname ||
                                `사용자 ${report.reporterId}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {getReasonLabel(report.reasonType)}
                          </div>
                          {report.reasonDetail && (
                            <div
                              className="text-sm text-muted-foreground truncate max-w-[200px]"
                              title={report.reasonDetail}
                            >
                              {report.reasonDetail}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Flag className="h-4 w-4 text-red-500" />
                          <span
                            className={`font-bold ${report.reportCount >= 5 ? "text-red-600" : report.reportCount >= 3 ? "text-yellow-600" : "text-gray-600"}`}
                          >
                            {report.reportCount}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            회
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>{getStatusBadge(report.statusType)}</TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(report.createdAt)}</div>
                          <div className="text-xs text-muted-foreground">
                            신고 접수
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          {report.updatedAt ? (
                            <>
                              <div>{formatDate(report.updatedAt)}</div>
                              <div className="text-xs text-muted-foreground">
                                {report.statusType === "PENDING"
                                  ? "최종 수정"
                                  : "처리 완료"}
                              </div>
                            </>
                          ) : (
                            <div className="text-muted-foreground text-xs">
                              미수정
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              {/* 처리 버튼 */}
                              <Button
                                variant={
                                  report.statusType === "PENDING"
                                    ? "default"
                                    : "ghost"
                                }
                                size="sm"
                                onClick={() => {
                                  setSelectedReport(report);
                                  fetchOriginalContent(report);
                                }}
                                className={
                                  report.statusType === "PENDING"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : ""
                                }
                              >
                                {report.statusType === "PENDING" ? (
                                  <>
                                    <AlertTriangle className="h-4 w-4" />
                                    처리하기
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4" />
                                    상세보기
                                  </>
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>신고 처리</DialogTitle>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* 신고 정보 */}
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                    <Flag className="h-4 w-4" />
                                    신고 정보
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">
                                        신고자:
                                      </span>{" "}
                                      {report.reporterNickname ||
                                        `사용자 ${report.reporterId}`}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        신고 사유:
                                      </span>{" "}
                                      {getReasonLabel(report.reasonType)}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        신고 일시:
                                      </span>{" "}
                                      {formatDate(report.createdAt)}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        처리 일시:
                                      </span>{" "}
                                      {report.statusType === "PENDING"
                                        ? "대기 중"
                                        : formatDate(report.updatedAt)}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        신고 횟수:
                                      </span>{" "}
                                      <span className="font-bold text-red-600">
                                        {report.reportCount}회
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">상태:</span>{" "}
                                      {getStatusBadge(report.statusType)}
                                    </div>
                                    {report.updatedAt &&
                                      report.updatedAt !== report.createdAt && (
                                        <div>
                                          <span className="font-medium">
                                            최종 수정:
                                          </span>{" "}
                                          {formatDate(report.updatedAt)}
                                        </div>
                                      )}
                                  </div>
                                  {report.reasonDetail && (
                                    <div className="mt-3">
                                      <span className="font-medium">
                                        상세 사유:
                                      </span>
                                      <p className="mt-1 text-gray-600 bg-white p-2 rounded border">
                                        {report.reasonDetail}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                {/* 원본 내용 */}
                                <div className="mt-4">
                                  <span className="font-medium">
                                    원본 내용:
                                  </span>
                                  <p className="mt-1 text-gray-600 bg-white p-2 rounded border">
                                    {
                                      // originalContent가 loading인지, error인지 확인, ReportType에 따라서 post/comment 내용 확인하기
                                      originalContent.loading ? (
                                        // Loading... 동적으로 보이게 하기.
                                        <p className="mt-1 text-gray-600 bg-white p-2 rounded border">
                                          Loading...
                                        </p>
                                      ) : originalContent.error ? (
                                        <p className="mt-1 text-gray-600 bg-white p-2 rounded border">
                                          Error: {originalContent.error}
                                        </p>
                                      ) : (
                                        originalContent && (
                                          <p className="mt-1 text-gray-600 bg-white p-2 rounded border">
                                            {originalContent.post
                                              ? originalContent.post
                                                  .afterContent
                                              : originalContent.comment
                                                ? originalContent.comment
                                                    .content
                                                : null}
                                          </p>
                                        )
                                      )
                                    }
                                  </p>
                                </div>

                                {/* Process Form */}
                                {selectedReport &&
                                selectedReport.statusType === "PENDING" ? (
                                  <div className="border-t pt-4 space-y-4">
                                    <h3 className="font-medium flex items-center">
                                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                                      신고 처리
                                    </h3>

                                    <div>
                                      <Label htmlFor="action">처리 액션</Label>
                                      <Select
                                        value={processingAction}
                                        onValueChange={(value) =>
                                          setProcessingAction(
                                            value as ReportProcessActionType
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="처리 방법을 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {REPORT_ACTION_OPTIONS.map(
                                            (option) => (
                                              <SelectItem
                                                key={option.value}
                                                value={option.value}
                                              >
                                                {option.label}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex space-x-3 pt-4">
                                      <Button
                                        variant="outline"
                                        onClick={() => setSelectedReport(null)}
                                        className="flex-1"
                                      >
                                        취소
                                      </Button>
                                      <Button
                                        onClick={handleProcessReport}
                                        disabled={
                                          processLoading || !processingAction
                                        }
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                      >
                                        {processLoading
                                          ? "처리 중..."
                                          : "처리 완료"}
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border-t pt-4">
                                    <h3 className="font-medium flex items-center mb-2">
                                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                      처리 완료된 신고
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      이 신고는 이미 처리되었습니다.
                                    </p>
                                  </div>
                                )}
                                {/* 처리 섹션 */}
                                {/* {report.statusType === "PENDING" ? (
                                  <div className="border-t pt-4 space-y-4">
                                    <h3 className="font-medium flex items-center">
                                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                                      신고 처리
                                      {report.reportCount >= 5 && (
                                        <Badge className="ml-2 bg-red-100 text-red-800">
                                          긴급 {report.reportCount}회
                                        </Badge>
                                      )}
                                    </h3>

                                    <div>
                                      <Label>처리 액션</Label>
                                      <div className="grid grid-cols-2 gap-3 mt-2">
                                        {REPORT_ACTION_OPTIONS.map((option) => (
                                          <Button
                                            key={option.value}
                                            variant={
                                              processingAction === option.value
                                                ? "default"
                                                : "outline"
                                            }
                                            className="p-4 h-auto flex flex-col items-center space-y-2"
                                            onClick={() => {
                                              setProcessingAction(
                                                option.value as ReportProcessActionType
                                              );
                                              setSelectedReport(report);
                                            }}
                                          >
                                            <div className="text-sm font-medium">
                                              {option.label}
                                            </div>
                                          </Button>
                                        ))}
                                      </div>
                                    </div>

                                    {processingAction && (
                                      <div className="flex space-x-3 pt-4">
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            setProcessingAction("")
                                          }
                                          className="flex-1"
                                        >
                                          취소
                                        </Button>
                                        <Button
                                          onClick={handleProcessReport}
                                          disabled={
                                            !processingAction || processLoading
                                          }
                                          className="flex-1"
                                        >
                                          {processLoading ? (
                                            <>
                                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                              처리 중...
                                            </>
                                          ) : (
                                            <>
                                              <CheckCircle className="h-4 w-4 mr-2" />
                                              처리 확정
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="border-t pt-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h3 className="font-medium flex items-center mb-3">
                                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                        처리 완료된 신고
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        이 신고는 이미 처리되었습니다.
                                      </p>
                                    </div>
                                  </div>
                                )} */}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 페이지네이션 */}
              {data?.pagination && (
                <div className="mt-4">
                  <Pagination
                    pagination={data.pagination}
                    onPageChange={setCurrentPage}
                    showFirstLastButtons={true}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Flag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">신고가 없습니다</h3>
              <p className="text-muted-foreground">
                현재 처리할 신고가 없습니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
