"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
  redirectUrl?: string; // 로그인 후 돌아갈 URL
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = "login",
  redirectUrl,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { login } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();

  const handleSocialLogin = async (provider: "google" | "kakao") => {
    setIsLoading(provider);
    try {
      // redirectUrl이 제공되면 사용하고, 그렇지 않으면 현재 페이지 URL 사용
      // 홈페이지("/")에서는 리다이렉트하지 않음
      let targetUrl = "/";
      if (redirectUrl) {
        targetUrl = redirectUrl;
      } else if (pathname && pathname !== "/") {
        targetUrl = typeof window !== "undefined" ? window.location.href : "";
      }

      await login(provider, targetUrl);
      // 성공 토스트는 로그인 완료 후 AuthProvider에서 처리됨
    } catch (error) {
      toast({
        description: `Failed to ${mode} with ${provider === "google" ? "Google" : "KakaoTalk"}. Please try again.`,
        variant: "destructive",
      });
      setIsLoading(null); // 에러 시에만 로딩 상태 해제
    }
    // 성공 시에는 리다이렉트되므로 setIsLoading(null)이 실행되지 않음
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {mode === "login" ? "로그인" : "구절구절에 가입하기"}
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            {mode === "login"
              ? "당신의 문학적 여정을 계속하려면 로그인하세요"
              : "당신의 이야기를 공유하려면 계정을 만들어주세요"}
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full h-12 text-left justify-start space-x-3"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading !== null}
          >
            {isLoading === "google" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            )}
            <span>구글로 계속하기</span>
          </Button>

          {/* KakaoTalk Login */}
          <Button
            variant="outline"
            className="w-full h-12 text-left justify-start space-x-3 bg-yellow-400 hover:bg-yellow-500 border-yellow-400 text-black"
            onClick={() => handleSocialLogin("kakao")}
            disabled={isLoading !== null}
          >
            {isLoading === "kakao" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C7.03 3 3 6.14 3 10.1c0 2.52 1.65 4.74 4.1 6.1l-.9 3.3c-.1.36.26.66.6.5l4.06-2.65c.38.04.76.06 1.14.06 4.97 0 9-3.14 9-7.1S16.97 3 12 3z" />
              </svg>
            )}
            <span>카카오톡으로 계속하기</span>
          </Button>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-xs text-gray-500">OR</span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === "login"
                ? "계정이 없으신가요?"
                : "이미 계정이 있으신가요?"}
            </p>
            <Button
              variant="link"
              className="p-0 h-auto font-semibold"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "회원 가입" : "로그인"}
            </Button>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          계속한다면 서비스{" "}
          <a href="#" className="underline hover:text-gray-700">
            이용약관
          </a>{" "}
          과{" "}
          <a href="#" className="underline hover:text-gray-700">
            개인정보 처리방침
          </a>{" "}
          에 동의한 것으로 간주합니다.
        </div>
      </DialogContent>
    </Dialog>
  );
}
