"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    useEffect(() => {
        const handleCallback = async () => {
            const status = searchParams.get('status');
            const error = searchParams.get('error');

            if (status === 'error') {
                console.log('소셜 로그인 실패');
            }

            if (status === "success") {
                console.log("소셜 로그인 성공");
            }

            // 리다이렉트 URL로 이동
            if (typeof window !== "undefined") {

                // 따로 저장된 값이 없으면 "/"로 리다이렉트 URL 설정
                const redirectUrl = localStorage.getItem("auth_redirect_url") || "/";

                localStorage.removeItem("auth_redirect_url");

                router.push(redirectUrl);

                // 실패일 경우, 1초 후 결과 토스트로 표시
                setTimeout(() => {
                    if (status === 'error') {
                        toast({
                            description: `로그인에 실패하셨습니다. 다시 로그인을 해주세요!`,
                            variant: 'destructive'
                        });
                    }
                }, 1000);

            }
        };

        handleCallback();
    }, []);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="rounded-lg p-8 max-w-md w-full mx-4">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            로그인 처리 중...
                        </h1>
                        <p className="text-gray-600">
                            잠시만 기다려주세요
                        </p>
                </div>
            </div>
        </div>
    );
}
