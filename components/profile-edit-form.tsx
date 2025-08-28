"use client";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useMyInfo, useUpdateMyInfo } from "@/lib/hooks/useMembers";
import type { AudienceType, ToneType } from "@/types/auth";
import { Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const interests = [
  "시",
  "소설",
  "에세이",
  "일기",
  "여행",
  "음식",
  "운동",
  "영화",
  "음악",
  "책",
  "예술",
  "사진",
  "게임",
  "기술",
  "자기계발",
  "취미",
  "반려동물",
  "패션",
  "뷰티",
  "건강",
];

const toneOptions: { value: ToneType; label: string }[] = [
  { value: "간결하고 명료한", label: "간결하고 명료한" },
  { value: "친근하고 유머러스한", label: "친근하고 유머러스한" },
  { value: "진지하고 논리적인", label: "진지하고 논리적인" },
  { value: "감성적이고 시적인", label: "감성적이고 시적인" },
];

const audienceOptions: {
  value: AudienceType;
  label: string;
  description: string;
}[] = [
  { value: "나 자신", label: "나 자신", description: "일기, 메모" },
  { value: "친구나 동료", label: "친구나 동료", description: "SNS, 메신저" },
  {
    value: "불특정 다수",
    label: "불특정 다수",
    description: "블로그, 커뮤니티",
  },
  { value: "교수님, 상사", label: "교수님, 상사", description: "과제, 보고서" },
];

export function ProfileEditForm() {
  const { user, logout, withdraw } = useAuth();
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
    bio: "",
    interests: [] as string[],
    profile: {
      tone: [] as ToneType[],
      audience: "나 자신" as AudienceType,
      favoriteAuthor: [] as string[],
      exclusions: [] as string[],
    },
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // 내 정보 로드 시 폼 데이터 초기화
  useEffect(() => {
    if (myInfo) {
      setFormData({
        nickname: myInfo.nickname || "",
        email: myInfo.email || "",
        bio: myInfo.bio || "",
        interests: myInfo.interests || [],
        profile: {
          tone: myInfo.profile?.tone || [],
          audience: myInfo.profile?.audience || "나 자신",
          favoriteAuthor: myInfo.profile?.favoriteAuthor || [],
          exclusions: myInfo.profile?.exclusions || [],
        },
      });
    }
  }, [myInfo]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleToneToggle = (tone: ToneType) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        tone: prev.profile.tone.includes(tone)
          ? prev.profile.tone.filter((t) => t !== tone)
          : [...prev.profile.tone, tone],
      },
    }));
  };

  const handleFavoriteAuthorAdd = (author: string) => {
    if (!author.trim()) return;

    // 추가: 5개 제한 로직
    if ((formData.profile.favoriteAuthor?.length || 0) >= 5) {
      toast({
        title: "알림",
        description: "좋아하는 작가는 최대 5명까지 추가할 수 있습니다.",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        favoriteAuthor: [...(prev.profile.favoriteAuthor || []), author.trim()],
      },
    }));
  };

  const handleFavoriteAuthorRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        favoriteAuthor:
          prev.profile.favoriteAuthor?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const handleExclusionAdd = (exclusion: string) => {
    if (!exclusion.trim()) return;

    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        exclusions: [...prev.profile.exclusions, exclusion.trim()],
      },
    }));
  };

  const handleExclusionRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        exclusions: prev.profile.exclusions.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSaveProfile = async () => {
    if (!myInfo) return;

    await updateInfo({
      body: {
        nickname: formData.nickname,
        bio: formData.bio,
        interests: formData.interests,
        profile: {
          tone: formData.profile.tone,
          audience: formData.profile.audience,
          favoriteAuthor: formData.profile.favoriteAuthor,
          exclusions: formData.profile.exclusions,
        },
      },
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Simulate account deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await withdraw();
      // await logout();
      toast({
        description: "회원 탈퇴가 완료되었습니다.",
      });
      // router.push("/");
    } catch (error) {
      toast({
        description: "회원 탈퇴에 실패하였습니다. 다시 시도해 주세요.",
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
                maxLength={20}
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

            <div className="space-y-2">
              <Label htmlFor="bio">자기소개</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="간단한 자기소개를 작성해보세요"
                className="h-24 resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500">{formData.bio.length}/200</p>
            </div>

            <div className="space-y-3">
              <Label>관심사</Label>
              <p className="text-sm text-gray-500">
                관심있는 주제들을 선택해주세요 (최대 5개)
              </p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    disabled={
                      formData.interests.length >= 5 &&
                      !formData.interests.includes(interest)
                    }
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.interests.includes(interest)
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                    } ${
                      formData.interests.length >= 5 &&
                      !formData.interests.includes(interest)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                선택된 관심사: {formData.interests.length}/5
              </p>
            </div>

            {/* 글쓰기 프로필 설정 */}
            <Separator />
            {myInfo?.profile ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    AI 글쓰기 설정
                  </h3>
                </div>

                {/* Purpose - Read Only */}
                <div className="space-y-2">
                  <Label>글쓰기 목적</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full">
                        {myInfo.profile.purpose === "학업" && "📚 학업"}
                        {myInfo.profile.purpose === "자기계발" && "🚀 자기계발"}
                        {myInfo.profile.purpose === "소셜" && "👥 소셜"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      목적은 최초 설정 후 변경할 수 없습니다.
                    </p>
                  </div>
                </div>

                {/* Tone */}
                <div className="space-y-3">
                  <Label>선호하는 글 스타일 (복수 선택 가능)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {toneOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.profile.tone.includes(option.value)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.profile.tone.includes(option.value)}
                          onChange={() => handleToneToggle(option.value)}
                          className="sr-only"
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {option.label}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Audience */}
                <div className="space-y-3">
                  <Label>주요 대상</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {audienceOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.profile.audience === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="audience"
                          value={option.value}
                          checked={formData.profile.audience === option.value}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                audience: e.target.value as AudienceType,
                              },
                            }))
                          }
                          className="sr-only"
                        />
                        <div className="font-medium text-gray-900 text-sm">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {option.description}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Favorite Author */}

                <div className="space-y-2">
                  <Label
                    htmlFor="favoriteAuthor"
                    className="text-sm font-medium"
                  >
                    좋아하는 작가/인플루언서
                  </Label>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.profile.favoriteAuthor?.map((author, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        {author}
                        <button
                          type="button"
                          onClick={() => handleFavoriteAuthorRemove(index)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="예: 한강, 김초엽, 김애란, 김영하, 유시민..."
                      className="flex-1"
                      disabled={
                        (formData.profile.favoriteAuthor?.length || 0) >= 5
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = (e.target as HTMLInputElement).value;
                          handleFavoriteAuthorAdd(value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={
                        (formData.profile.favoriteAuthor?.length || 0) >= 5
                      }
                      onClick={(e) => {
                        const input = (
                          e.target as HTMLElement
                        ).parentElement?.querySelector(
                          "input"
                        ) as HTMLInputElement;
                        if (input) {
                          handleFavoriteAuthorAdd(input.value);
                          input.value = "";
                        }
                      }}
                    >
                      추가
                    </Button>
                  </div>
                  {/* 추가: 카운터 텍스트 */}
                  <p className="text-xs text-gray-500">
                    선택된 작가: {formData.profile.favoriteAuthor?.length || 0}
                    /5
                  </p>
                </div>

                {/* Exclusions */}
                <div className="space-y-2">
                  <Label>사용하지 않을 표현</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.profile.exclusions.map((exclusion, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        {exclusion}
                        <button
                          type="button"
                          onClick={() => handleExclusionRemove(index)}
                          className="ml-1 text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="예: 어려운 한자어, 과도한 유행어..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = (e.target as HTMLInputElement).value;
                          handleExclusionAdd(value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = (
                          e.target as HTMLElement
                        ).parentElement?.querySelector(
                          "input"
                        ) as HTMLInputElement;
                        if (input) {
                          handleExclusionAdd(input.value);
                          input.value = "";
                        }
                      }}
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    AI 글쓰기 설정
                  </h3>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-sm text-blue-800 mb-3">
                    🤖 AI 글쓰기 도우미를 활용하려면 프로필을 설정해주세요!
                  </p>
                  <Button
                    onClick={() => router.push("/auth/onboarding")}
                    size="sm"
                  >
                    프로필 설정하기
                  </Button>
                </div>
              </div>
            )}
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
