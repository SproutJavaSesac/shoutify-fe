"use client";

import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useToast} from "@/hooks/use-toast";

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

                // 약간의 지연을 두어 토스트가 표시된 후 리다이렉트
                setTimeout(() => {
                    router.push(redirectUrl);
                    }, 1000);

                if (status === 'error') {
                    toast({
                        description: `로그인에 실패하셨습니다. 다시 로그인을 해주세요!`,
                    });
                }

            }
        };

        handleCallback();
    }, []);

    return <div>로그인 처리 중...</div>;
}
