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
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useProfanityList,
  useCreateProfanity,
  useUpdateProfanity,
  useDeleteProfanity,
} from "@/lib/hooks/useProfanities";
import {
  PROFANITIES_CATEGORY_OPTIONS,
  PROFANITIES_SORT_OPTIONS,
} from "@/constants/profanities";
import {
  ProfanityCategory,
  ProfanitySortType,
  ProfanityCreateRequest,
  Profanity,
} from "@/types/profanities";

export function ProfanityManagement() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ProfanityCategory | undefined
  >(undefined);
  const [sortBy, setSortBy] = useState<ProfanitySortType>("createdAt");
  const [orderBy, setOrderBy] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProfanity, setEditingProfanity] = useState<Profanity | null>(
    null
  );

  const { toast } = useToast();

  // API hooks
  const { data, loading, error, refetch } = useProfanityList({
    page: currentPage,
    size: 20,
    sort: sortBy,
    order: orderBy,
    category: selectedCategory || undefined,
    keyword: searchKeyword || undefined,
  });

  const { mutate: createProfanity, loading: createLoading } =
    useCreateProfanity();
  const { mutate: updateProfanity, loading: updateLoading } =
    useUpdateProfanity();
  const { mutate: deleteProfanity, loading: deleteLoading } =
    useDeleteProfanity();

  // Form state
  const [formData, setFormData] = useState({
    original: "",
    replacement: "",
    description: "",
    category: "GENERAL_SWEAR" as ProfanityCategory,
  });

  const handleSearch = () => {
    setCurrentPage(0);
    refetch();
  };

  const handleCreateProfanity = async () => {
    if (!formData.original.trim()) {
      toast({
        title: "필수 입력 항목이 누락되었습니다",
        description: "금지할 단어를 입력해 주세요.",
        variant: "destructive",
      });
      return;
    }

    const result = await createProfanity(formData);
    if (result) {
      toast({
        title: "금지어가 등록되었습니다",
        description: `"${formData.original}"이(가) 성공적으로 등록되었습니다.`,
      });
      setIsCreateDialogOpen(false);
      setFormData({
        original: "",
        replacement: "",
        description: "",
        category: "GENERAL_SWEAR",
      });
      refetch();
    }
  };

  const handleUpdateProfanity = async () => {
    if (!editingProfanity) return;

    const result = await updateProfanity({
      profanityId: editingProfanity.profanityId,
      body: {
        original: formData.original,
        replacement: formData.replacement || null,
        description: formData.description || null,
        category: formData.category,
      },
    });

    if (result) {
      toast({
        title: "금지어가 수정되었습니다",
        description: "금지어 정보가 성공적으로 업데이트되었습니다.",
      });
      setEditingProfanity(null);
      refetch();
    }
  };

  const handleDeleteProfanity = async (profanity: Profanity) => {
    if (window.confirm(`"${profanity.original}" 금지어를 삭제하시겠습니까?`)) {
      const result = await deleteProfanity(Number(profanity.profanityId));
      if (result) {
        toast({
          title: "금지어가 삭제되었습니다",
          description: `"${profanity.original}"이(가) 목록에서 제거되었습니다.`,
        });
        refetch();
      }
    }
  };

  const openEditDialog = (profanity: Profanity) => {
    setFormData({
      original: profanity.original,
      replacement: profanity.replacement || "",
      description: profanity.description || "",
      category: profanity.category as ProfanityCategory,
    });
    setEditingProfanity(profanity);
  };

  const getCategoryBadgeColor = (category: ProfanityCategory) => {
    switch (category) {
      case "GENERAL_SWEAR":
        return "bg-red-100 text-red-800";
      case "SEXUAL_DEGRADATION":
        return "bg-pink-100 text-pink-800";
      case "DISCRIMINATION_HATE":
        return "bg-purple-100 text-purple-800";
      case "MODIFIED_SWEAR":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
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
            <Shield className="h-6 w-6" />
            금지어 관리
          </h2>
          <p className="text-muted-foreground mt-1">
            부적절한 언어 표현을 관리하고 필터링합니다
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              금지어 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>새 금지어 등록</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="original">금지할 단어 *</Label>
                <Input
                  id="original"
                  value={formData.original}
                  onChange={(e) =>
                    setFormData({ ...formData, original: e.target.value })
                  }
                  placeholder="예: 욕설"
                />
              </div>

              <div>
                <Label htmlFor="replacement">대체어</Label>
                <Input
                  id="replacement"
                  value={formData.replacement}
                  onChange={(e) =>
                    setFormData({ ...formData, replacement: e.target.value })
                  }
                  placeholder="예: ***"
                />
              </div>

              <div>
                <Label htmlFor="category">분류 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value as ProfanityCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFANITIES_CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="금지어에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleCreateProfanity}
                  disabled={createLoading}
                  className="flex-1"
                >
                  {createLoading ? "등록 중..." : "등록"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="금지어 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <Select
              value={selectedCategory ?? "__ALL__"}
              onValueChange={(value) =>
                setSelectedCategory(
                  value === "__ALL__" ? undefined : (value as ProfanityCategory)
                )
              }
            >
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="분류 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">전체</SelectItem>
                {PROFANITIES_CATEGORY_OPTIONS.map((option) => (
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
                  ProfanitySortType,
                  "ASC" | "DESC",
                ];
                setSortBy(sort);
                setOrderBy(order);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-DESC">최신 등록순</SelectItem>
                <SelectItem value="createdAt-ASC">오래된 순</SelectItem>
                <SelectItem value="updatedAt-DESC">최근 수정순</SelectItem>
                <SelectItem value="updatedAt-ASC">오래된 수정순</SelectItem>
                <SelectItem value="original-ASC">단어 A-Z</SelectItem>
                <SelectItem value="original-DESC">단어 Z-A</SelectItem>
                <SelectItem value="id-ASC">ID 순</SelectItem>
                <SelectItem value="id-DESC">ID 역순</SelectItem>
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
              금지어 목록
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
          ) : data?.profanities.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>금지어</TableHead>
                    <TableHead>대체어</TableHead>
                    <TableHead>분류</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.profanities.map((profanity) => (
                    <TableRow key={profanity.profanityId}>
                      <TableCell className="font-medium">
                        {profanity.original}
                      </TableCell>
                      <TableCell>
                        {profanity.replacement || (
                          <span className="text-muted-foreground italic">
                            미설정
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getCategoryBadgeColor(
                            profanity.category as ProfanityCategory
                          )}
                        >
                          {
                            PROFANITIES_CATEGORY_OPTIONS.find(
                              (opt) => opt.value === profanity.category
                            )?.label
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {profanity.description || (
                          <span className="text-muted-foreground italic">
                            설명 없음
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(profanity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProfanity(profanity)}
                            disabled={deleteLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 페이지네이션 */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    variant="outline"
                  >
                    이전
                  </Button>
                  {Array.from(
                    { length: Math.min(10, data.pagination.totalPages) },
                    (_, i) => (
                      <Button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                      >
                        {i + 1}
                      </Button>
                    )
                  )}
                  <Button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          data.pagination.totalPages - 1,
                          currentPage + 1
                        )
                      )
                    }
                    disabled={currentPage >= data.pagination.totalPages - 1}
                    variant="outline"
                  >
                    다음
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">금지어가 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                새로운 금지어를 추가해 보세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProfanity}
        onOpenChange={() => setEditingProfanity(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>금지어 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-original">금지할 단어 *</Label>
              <Input
                id="edit-original"
                value={formData.original}
                onChange={(e) =>
                  setFormData({ ...formData, original: e.target.value })
                }
                placeholder="예: 욕설"
              />
            </div>

            <div>
              <Label htmlFor="edit-replacement">대체어</Label>
              <Input
                id="edit-replacement"
                value={formData.replacement}
                onChange={(e) =>
                  setFormData({ ...formData, replacement: e.target.value })
                }
                placeholder="예: ***"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">분류 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as ProfanityCategory,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFANITIES_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-description">설명</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="금지어에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditingProfanity(null)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleUpdateProfanity}
                disabled={updateLoading}
                className="flex-1"
              >
                {updateLoading ? "수정 중..." : "수정"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
