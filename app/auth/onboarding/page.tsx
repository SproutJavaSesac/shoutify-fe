"use client";

import { completeOnboarding } from "@/apis/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import type {
  AudienceType,
  OnboardingRequest,
  PurposeType,
  ToneType,
} from "@/types/auth";
import {
  BookOpen,
  CheckCircle,
  Loader2,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const purposeOptions: {
  value: PurposeType;
  label: string;
  description: string;
  icon: any;
}[] = [
  {
    value: "학업",
    label: "학업",
    description: "논리적이고 체계적인 글쓰기 (수능/내신)",
    icon: BookOpen,
  },
  {
    value: "자기계발",
    label: "자기계발",
    description: "전문적이고 설득력 있는 글쓰기 (과시/지적표현)",
    icon: TrendingUp,
  },
  {
    value: "소셜",
    label: "소셜",
    description: "재치 있고 재미있는 글쓰기 (SNS/관계형성)",
    icon: Users,
  },
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

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, checkAuthStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingRequest>({
    nickname: "",
    bio: "",
    interests: [],
    profileImageUrl: "",
    profile: {
      purpose: "학업",
      tone: [],
      audience: "나 자신",
      favoriteAuthor: [],
      exclusions: [],
    },
  });

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...(prev.interests || []), interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nickname.trim()) {
      toast({
        title: "입력 오류",
        description: "닉네임을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      toast({
        title: "입력 오류",
        description: "닉네임은 2자 이상 20자 이하로 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (formData.profile.tone.length === 0) {
      toast({
        title: "입력 오류",
        description: "선호하는 글의 느낌을 최소 1개 이상 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding(formData);

      // 사용자 정보 다시 가져오기
      await checkAuthStatus();

      toast({
        title: "환영합니다!",
        description:
          "프로필 설정이 완료되었습니다. AI 글쓰기 도우미를 이용해보세요!",
      });

      // 글쓰기 페이지로 리다이렉트
      router.push("/");
    } catch (error: any) {
      console.error("온보딩 설정 실패:", error);
      toast({
        title: "오류 발생",
        description:
          error?.message || "프로필 설정에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

    // 추가: 5개 제한 로직
    if ((formData.profile.exclusions?.length || 0) >= 5) {
      toast({
        title: "알림",
        description: "피하는 표현은 최대 5개까지 추가할 수 있습니다.",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        exclusions: [...(prev.profile.exclusions || []), exclusion.trim()],
      },
    }));
  };

  const handleExclusionRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        exclusions:
          prev.profile.exclusions?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.nickname.trim()) {
      toast({
        title: "입력 오류",
        description: "닉네임을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Profile Image & Basic Info */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={formData.profileImageUrl || user?.profileImageUrl}
                />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-sm font-medium">
                닉네임 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nickname"
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nickname: e.target.value }))
                }
                placeholder="사용할 닉네임을 입력해주세요"
                className="w-full"
                maxLength={20}
              />
              <p className="text-xs text-gray-500">
                2-20자 사이로 입력해주세요
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                자기소개 (선택사항)
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="간단한 자기소개를 작성해보세요"
                className="w-full h-24 resize-none"
                maxLength={200}
              />
              <p className="text-xs text-gray-500">
                {formData.bio?.length || 0}/200
              </p>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">관심사 (선택사항)</Label>
              <p className="text-xs text-gray-500 mb-3">
                관심있는 주제들을 선택해주세요 (최대 5개)
              </p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    disabled={
                      (formData.interests?.length || 0) >= 5 &&
                      !formData.interests?.includes(interest)
                    }
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      formData.interests?.includes(interest)
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                    } ${
                      (formData.interests?.length || 0) >= 5 &&
                      !formData.interests?.includes(interest)
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                선택된 관심사: {formData.interests?.length || 0}/5
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Purpose */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                이 서비스를 사용하는 주된 목적은 무엇인가요?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="grid gap-3">
                {purposeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.profile.purpose === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="purpose"
                        value={option.value}
                        checked={formData.profile.purpose === option.value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              purpose: e.target.value as PurposeType,
                            },
                          }))
                        }
                        className="sr-only"
                      />
                      <IconComponent className="h-5 w-5 mr-3 mt-0.5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Audience */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                주로 누구를 대상으로 글을 쓰시나요?{" "}
                <span className="text-red-500">*</span>
              </Label>
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Tone */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                어떤 느낌의 글을 선호하시나요? (복수 선택 가능){" "}
                <span className="text-red-500">*</span>
              </Label>
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
              <p className="text-xs text-gray-500">
                선택된 항목: {formData.profile.tone.length}/4
              </p>
            </div>

            {/* Favorite Author */}
            <div className="space-y-2">
              <Label htmlFor="favoriteAuthor" className="text-sm font-medium">
                (선택) 좋아하는 작가나 인플루언서가 있나요?
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
                  disabled={(formData.profile.favoriteAuthor?.length || 0) >= 5}
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
                  disabled={(formData.profile.favoriteAuthor?.length || 0) >= 5}
                  onClick={(e) => {
                    const input = (
                      e.target as HTMLElement
                    ).parentElement?.querySelector("input") as HTMLInputElement;
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
                선택된 작가: {formData.profile.favoriteAuthor?.length || 0}/5
              </p>
              <p className="text-xs text-gray-500">
                향후 스타일 모방 기능에 활용될 예정입니다
              </p>
            </div>

            {/* Exclusions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                (선택) AI가 사용하지 않았으면 하는 표현이 있나요?
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.profile.exclusions?.map((exclusion, index) => (
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
                  disabled={(formData.profile.exclusions?.length || 0) >= 5}
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
                  disabled={(formData.profile.exclusions?.length || 0) >= 5}
                  onClick={(e) => {
                    const input = (
                      e.target as HTMLElement
                    ).parentElement?.querySelector("input") as HTMLInputElement;
                    if (input) {
                      handleExclusionAdd(input.value);
                      input.value = "";
                    }
                  }}
                >
                  추가
                </Button>
              </div>
              {/* 추가: 카운터 텍스트 */}
              <p className="text-xs text-gray-500">
                추가된 표현: {formData.profile.exclusions?.length || 0}/5
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    // <AdditionalInfoGuard>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프로필 설정</h1>
          <p className="text-lg text-gray-600">
            AI가 당신에게 맞는 글쓰기를 도와드릴 수 있도록 설정해주세요
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center">
          <div className="flex space-x-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">
              {currentStep === 1 && "기본 정보"}
              {currentStep === 2 && "글쓰기 목적"}
              {currentStep === 3 && "세부 설정"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  이전
                </Button>

                {currentStep < 3 ? (
                  <Button type="button" onClick={nextStep}>
                    다음
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        설정 중...
                      </>
                    ) : (
                      "설정 완료"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          나중에 마이페이지에서 언제든지 수정할 수 있습니다.
        </div>
      </div>
    </div>
    // </AdditionalInfoGuard>
  );
}
