"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Upload, User } from "lucide-react";
import { useMyInfo, useUpdateMyInfo } from "@/lib/hooks/useMembers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProfileEditForm() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // 새로운 hooks 사용
  const { data: myInfo, loading: infoLoading, refetch } = useMyInfo();
  const { mutate: updateInfo, loading: updateLoading } = useUpdateMyInfo({
    onSuccess: (data) => {
      toast({
        title: "프로필이 성공적으로 업데이트되었습니다!",
        description: "변경사항이 저장되었습니다.",
      });
      refetch(); // 데이터 새로고침
      router.push("/mypage"); // 마이페이지로 이동
    },
    onError: (error) => {
      toast({
        title: "프로필 업데이트에 실패했습니다",
        description: error || "다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // 내 정보 로드 시 폼 데이터 초기화
  useEffect(() => {
    if (myInfo) {
      setFormData({
        nickname: myInfo.nickname || "",
        email: myInfo.email || "",
      });
    }
  }, [myInfo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!myInfo) return;

    await updateInfo({
      body: {
        nickname: formData.nickname,
      },
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Simulate account deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await logout();
      toast({
        description: "Account deleted successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* 프로필 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>프로필 정보</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={myInfo?.profileImageUrl || "/placeholder.svg"}
                alt={myInfo?.nickname || "사용자"}
              />
              <AvatarFallback className="text-lg">
                {(myInfo?.nickname || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                아바타 변경
              </Button>
              <p className="text-xs text-gray-500">
                JPG, PNG 또는 GIF. 최대 크기 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* 폼 필드 */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="이메일을 입력하세요"
                disabled
              />
              <p className="text-xs text-gray-500">
                알림 및 계정 복구에 사용됩니다. (읽기 전용)
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={updateLoading || infoLoading}
            >
              {updateLoading ? "저장 중..." : "변경 사항 저장"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 계정 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>계정 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-4">
                위험 영역
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                이 작업은 되돌릴 수 없습니다. 신중하게 결정해 주세요.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "삭제 중..." : "계정 삭제"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    정말로 계정을 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 계정을 영구적으로 삭제하고
                    서버에서 모든 데이터가 제거됩니다. 삭제되는 데이터는 다음과
                    같습니다:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>모든 게시글과 AI 변환 내용</li>
                      <li>모든 댓글과 답글</li>
                      <li>북마크와 배지</li>
                      <li>프로필 정보</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    네, 계정을 삭제합니다
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* 연결된 계정 */}
      <Card>
        <CardHeader>
          <CardTitle>연결된 계정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {(user as any).provider === "google" ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                ) : (
                  <div className="h-6 w-6 bg-yellow-400 rounded flex items-center justify-center">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3C7.03 3 3 6.14 3 10.1c0 2.52 1.65 4.74 4.1 6.1l-.9 3.3c-.1.36.26.66.6.5l4.06-2.65c.38.04.76.06 1.14.06 4.97 0 9-3.14 9-7.1S16.97 3 12 3z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {(user as any).provider === "google"
                      ? "Google"
                      : "KakaoTalk"}
                  </p>
                  <p className="text-sm text-gray-500">연결됨 • {user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                연결 해제
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {(user as any).provider === "google" ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                ) : (
                  <div className="h-6 w-6 bg-yellow-400 rounded flex items-center justify-center">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3C7.03 3 3 6.14 3 10.1c0 2.52 1.65 4.74 4.1 6.1l-.9 3.3c-.1.36.26.66.6.5l4.06-2.65c.38.04.76.06 1.14.06 4.97 0 9-3.14 9-7.1S16.97 3 12 3z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {(user as any).provider === "google"
                      ? "Google"
                      : "KakaoTalk"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Connected • {user.email}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
