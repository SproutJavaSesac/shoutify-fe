"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Flag,
  Loader2,
  MessageSquare,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProcessReport, useReportList } from "@/lib/hooks/useReports";
import { getPost } from "@/apis/posts";
import { getComment } from "@/apis/comments";
import { Post } from "@/types/posts";
import { Comment } from "@/types/comments";
import {
  REPORT_ACTION_OPTIONS,
  REPORT_REASON_OPTIONS,
  REPORT_STATUS_OPTIONS,
} from "@/constants/reports";
import {
  Report,
  ReportProcessActionType,
  ReportReasonType,
  ReportSortType,
  ReportStatusType,
} from "@/types/reports";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Pagination } from "@/components/commons";

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
  const [adminNote, setAdminNote] = useState("");

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
        const [post, commentResponse] = await Promise.all([
          getPost(report.postId),
          getComment({ postId: report.postId, commentId: report.commentId }),
        ]);
        setOriginalContent({
          post,
          comment: commentResponse.data,
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

  const { mutate: processReport, loading: processLoading } = useProcessReport();

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleProcessReport = async () => {
    if (!selectedReport || !processingAction) return;

    const result = await processReport({
      reportId: selectedReport.reportId,
      body: {
        action: processingAction,
        adminNote: adminNote || undefined,
      },
    });

    if (result) {
      toast({
        title: "신고 처리 완료",
        description: `신고가 성공적으로 ${getActionLabel(processingAction)}되었습니다.`,
      });
      setSelectedReport(null);
      setProcessingAction("");
      setAdminNote("");
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
    } as const satisfies Record<
      ReportStatusType,
      { color: string; icon: typeof Clock; text: string }
    >;

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

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">데이터 로딩 오류</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch}>다시 시도</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flag className="h-6 w-6" />
            신고 관리
          </h2>
          <p className="text-muted-foreground mt-1">
            사용자 신고를 검토하고 적절한 조치를 취합니다
          </p>
        </div>

        {data?.summary && (
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg text-yellow-600">
                {data.summary.pending}
              </div>
              <div className="text-muted-foreground">대기</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-green-600">
                {data.summary.approved}
              </div>
              <div className="text-muted-foreground">승인</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-red-600">
                {data.summary.rejected}
              </div>
              <div className="text-muted-foreground">거부</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <Select
              value={selectedStatus ?? "__ALL__"}
              onValueChange={(value) =>
                setSelectedStatus(
                  value === "__ALL__" ? undefined : (value as ReportStatusType)
                )
              }
            >
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">전체</SelectItem>
                {REPORT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedReason ?? "__ALL__"}
              onValueChange={(value) =>
                setSelectedReason(
                  value === "__ALL__" ? undefined : (value as ReportReasonType)
                )
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="사유 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">전체</SelectItem>
                {REPORT_REASON_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}-${orderBy}`}
              onValueChange={(value) => {
                const [sort, order] = value.split("-") as [
                  ReportSortType,
                  "ASC" | "DESC",
                ];
                setSortBy(sort);
                setOrderBy(order);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-DESC">최신순</SelectItem>
                <SelectItem value="createdAt-ASC">등록순</SelectItem>
                <SelectItem value="updatedAt-DESC">수정순</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={loading}>
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              신고 목록
              {data?.pagination && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (총 {data.pagination.totalCount}개)
                </span>
              )}
            </span>
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
                    <TableHead className="text-center">
                      내용보기 / 처리
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.reports.map((report) => (
                    <TableRow key={report.reportId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {report.reportType === "POST" ? (
                            <MessageSquare className="h-4 w-4" />
                          ) : (
                            <MessageSquare className="h-4 w-4" />
                          )}
                          <div>
                            <div className="font-medium">
                              {report.reportType === "POST" ? "게시글" : "댓글"}
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
                          {report.reporterNickname ||
                            `사용자 ${report.reporterId}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{getReasonLabel(report.reasonType)}</div>
                          {report.reasonDetail && (
                            <div className="text-sm text-muted-foreground">
                              {report.reasonDetail}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Flag className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-red-600">
                            {report.reportCount}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            회
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.statusType)}</TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          {/* 원본 콘텐츠 보기 버튼 */}
                          <Dialog
                            onOpenChange={(open) =>
                              !open && setOriginalContent({ loading: false })
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchOriginalContent(report)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                원본 보기
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Flag className="h-5 w-5" />
                                  신고된{" "}
                                  {report.reportType === "POST"
                                    ? "게시글"
                                    : "댓글"}{" "}
                                  원본
                                </DialogTitle>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* 신고 정보 */}
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                  <h4 className="font-semibold text-red-800 mb-2">
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
                                        신고 일시:
                                      </span>{" "}
                                      {formatDate(report.createdAt)}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        신고 사유:
                                      </span>{" "}
                                      {getReasonLabel(report.reasonType)}
                                    </div>
                                    <div>
                                      <span className="font-medium">상태:</span>{" "}
                                      {getStatusBadge(report.statusType)}
                                    </div>
                                    {report.reasonDetail && (
                                      <div className="col-span-2">
                                        <span className="font-medium">
                                          상세 사유:
                                        </span>
                                        <p className="mt-1 text-gray-600">
                                          {report.reasonDetail}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* 원본 콘텐츠 */}
                                <div className="space-y-4">
                                  {originalContent.loading ? (
                                    <div className="flex items-center justify-center py-8">
                                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                      원본 콘텐츠를 불러오는 중...
                                    </div>
                                  ) : originalContent.error ? (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                      <p className="text-yellow-800">
                                        {originalContent.error}
                                      </p>
                                    </div>
                                  ) : (
                                    <>
                                      {originalContent.post &&
                                        report.reportType === "POST" && (
                                          <div className="border rounded-lg p-4">
                                            <h4 className="font-semibold mb-3">
                                              게시글 원본
                                            </h4>
                                            <div className="space-y-3">
                                              <div>
                                                <span className="text-sm font-medium text-gray-500">
                                                  제목:
                                                </span>
                                                <p className="mt-1 font-medium">
                                                  {
                                                    originalContent.post
                                                      .afterTitle
                                                  }
                                                </p>
                                              </div>
                                              <div>
                                                <span className="text-sm font-medium text-gray-500">
                                                  작성자:
                                                </span>
                                                <p className="mt-1">
                                                  {
                                                    originalContent.post
                                                      .nickname
                                                  }
                                                </p>
                                              </div>
                                              <div>
                                                <span className="text-sm font-medium text-gray-500">
                                                  내용:
                                                </span>
                                                <div className="mt-1 p-3 bg-gray-50 rounded max-h-64 overflow-y-auto">
                                                  <p className="whitespace-pre-wrap">
                                                    {
                                                      originalContent.post
                                                        .afterContent
                                                    }
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                작성일:{" "}
                                                {format(
                                                  new Date(
                                                    originalContent.post.createdAt
                                                  ),
                                                  "yyyy-MM-dd HH:mm",
                                                  { locale: ko }
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                      {originalContent.comment &&
                                        report.reportType === "COMMENT" && (
                                          <>
                                            {/* 원본 게시글 */}
                                            {originalContent.post && (
                                              <div className="border rounded-lg p-4 bg-gray-50">
                                                <h4 className="font-semibold mb-3">
                                                  원본 게시글
                                                </h4>
                                                <div className="space-y-2">
                                                  <p className="font-medium">
                                                    {
                                                      originalContent.post
                                                        .afterTitle
                                                    }
                                                  </p>
                                                  <p className="text-sm text-gray-600 line-clamp-3">
                                                    {
                                                      originalContent.post
                                                        .afterContent
                                                    }
                                                  </p>
                                                  <div className="text-xs text-gray-500">
                                                    작성자:{" "}
                                                    {
                                                      originalContent.post
                                                        .nickname
                                                    }{" "}
                                                    | 작성일:{" "}
                                                    {format(
                                                      new Date(
                                                        originalContent.post.createdAt
                                                      ),
                                                      "yyyy-MM-dd HH:mm",
                                                      { locale: ko }
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {/* 신고된 댓글 */}
                                            <div className="border rounded-lg p-4">
                                              <h4 className="font-semibold mb-3">
                                                댓글 원본
                                              </h4>
                                              <div className="space-y-3">
                                                <div>
                                                  <span className="text-sm font-medium text-gray-500">
                                                    작성자:
                                                  </span>
                                                  <p className="mt-1">
                                                    {
                                                      originalContent.comment
                                                        .commenterNickname
                                                    }
                                                  </p>
                                                </div>
                                                <div>
                                                  <span className="text-sm font-medium text-gray-500">
                                                    내용:
                                                  </span>
                                                  <div className="mt-1 p-3 bg-gray-50 rounded">
                                                    <p className="whitespace-pre-wrap">
                                                      {
                                                        originalContent.comment
                                                          .content
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                  작성일:{" "}
                                                  {format(
                                                    new Date(
                                                      originalContent.comment.createdAt
                                                    ),
                                                    "yyyy-MM-dd HH:mm",
                                                    { locale: ko }
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* 처리 버튼 */}
                          <Button
                            variant={
                              report.statusType === "PENDING"
                                ? "default"
                                : "ghost"
                            }
                            size="sm"
                            onClick={() => setSelectedReport(report)}
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 페이지네이션 */}
              {data?.pagination && (
                <Pagination
                  pagination={data.pagination}
                  onPageChange={setCurrentPage}
                  showFirstLastButtons={true}
                />
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

      {/* Report Detail Dialog */}
      <Dialog
        open={!!selectedReport}
        onOpenChange={() => setSelectedReport(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>신고 상세 정보</DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6 mt-4">
              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">신고 대상</Label>
                  <p className="mt-1">
                    {selectedReport.reportType === "POST" ? "게시글" : "댓글"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">현재 상태</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedReport.statusType)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">신고 사유</Label>
                  <p className="mt-1">
                    {getReasonLabel(selectedReport.reasonType)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">신고 일시</Label>
                  <p className="mt-1">{formatDate(selectedReport.createdAt)}</p>
                </div>
                {selectedReport.updatedAt && (
                  <div>
                    <Label className="text-sm font-medium">처리 일시</Label>
                    <p className="mt-1">
                      {formatDate(selectedReport.updatedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Content ID */}
              <div>
                <Label className="text-sm font-medium">신고된 콘텐츠 ID</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    {selectedReport.reportType === "POST"
                      ? `게시글 ID: ${selectedReport.postId}`
                      : `댓글 ID: ${selectedReport.commentId}`}
                  </p>
                </div>
              </div>

              {/* Detail Reason */}
              {selectedReport.reasonDetail && (
                <div>
                  <Label className="text-sm font-medium">상세 사유</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedReport.reasonDetail}
                  </p>
                </div>
              )}

              {/* Process Form */}
              {selectedReport.statusType === "PENDING" ? (
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
                        setProcessingAction(value as ReportProcessActionType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="처리 방법을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {REPORT_ACTION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="admin-note">관리자 메모 (선택사항)</Label>
                    <Textarea
                      id="admin-note"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="처리 사유나 추가 메모를 입력하세요"
                      rows={3}
                    />
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
                      disabled={processLoading || !processingAction}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      {processLoading ? "처리 중..." : "처리 완료"}
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
