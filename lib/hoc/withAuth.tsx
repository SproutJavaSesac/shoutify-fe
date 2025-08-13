"use client";

import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/lib/auth";
import { ComponentType, useState } from "react";

interface WithAuthOptions {
  /** 인증 실패 시 표시할 컴포넌트 */
  fallbackComponent?: ComponentType<any>;
  /** 자동으로 인증 모달을 표시할지 여부 */
  showAuthModal?: boolean;
  /** 인증이 필요한 prop들의 이름 */
  requireAuthForProps?: string[];
}

/**
 * 컴포넌트에 인증 기능을 추가하는 HOC
 */
export function withAuth<T extends object>(
  WrappedComponent: ComponentType<T>,
  options: WithAuthOptions = {}
) {
  const {
    fallbackComponent: FallbackComponent,
    showAuthModal = true,
    requireAuthForProps = [],
  } = options;

  return function WithAuthComponent(props: T) {
    const { user } = useAuth();
    const [authModal, setAuthModal] = useState(false);

    // 인증이 필요한 props를 래핑
    const enhancedProps = { ...props } as T & {
      executeWithAuth: (action: () => void) => void;
      isAuthenticated: boolean;
      user: any;
    };

    // 인증 실행 함수 추가
    enhancedProps.executeWithAuth = (action: () => void) => {
      if (!user) {
        if (showAuthModal) {
          setAuthModal(true);
        }
        return;
      }
      action();
    };

    enhancedProps.isAuthenticated = !!user;
    enhancedProps.user = user;

    // 인증이 필요한 prop들을 래핑
    requireAuthForProps.forEach((propName) => {
      const originalHandler = (props as any)[propName];
      if (typeof originalHandler === "function") {
        (enhancedProps as any)[propName] = (...args: any[]) => {
          if (!user) {
            if (showAuthModal) {
              setAuthModal(true);
            }
            return;
          }
          return originalHandler(...args);
        };
      }
    });

    if (!user && FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return (
      <>
        <WrappedComponent {...enhancedProps} />
        {showAuthModal && (
          <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
        )}
      </>
    );
  };
}
