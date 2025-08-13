"use client";

import { AuthModal } from "@/components/auth-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth";
import { ComponentType, useState } from "react";

interface WithOwnershipOptions {
  /** 소유자 확인 함수 */
  checkOwnership?: (user: any, props: any) => boolean;
  /** 권한이 없을 때 표시할 컴포넌트 */
  fallbackComponent?: ComponentType<any>;
  /** 권한이 없을 때 모달을 표시할지 여부 */
  showOwnershipModal?: boolean;
  /** 권한이 없을 때 모달 메시지 */
  ownershipModalMessage?: string;
  /** 리소스 이름 (모달 메시지에 사용) */
  resourceName?: string;
}

/**
 * 컴포넌트에 소유권 확인 기능을 추가하는 HOC
 * 로그인 체크 + 소유권 체크를 모두 수행
 */
export function withOwnership<T extends object>(
  WrappedComponent: ComponentType<T>,
  options: WithOwnershipOptions = {}
) {
  const {
    checkOwnership = (user: any, props: any) => {
      // isMine prop이 있으면 그것을 우선 사용
      if ("isMine" in props) {
        return (props as any).isMine === true;
      }

      // fallback: authorId, ownerId 체크
      const userId = user?.id;
      const authorId = (props as any)?.authorId;
      const ownerId = (props as any)?.ownerId;

      // authorId나 ownerId가 없으면 허용 (예: 마이페이지에서 본인 게시글)
      if (!authorId && !ownerId) {
        return true;
      }

      // 타입을 통일하여 비교 (문자열로 변환)
      return (
        String(userId) === String(authorId) ||
        String(userId) === String(ownerId)
      );
    },
    fallbackComponent: FallbackComponent,
    showOwnershipModal = true,
    ownershipModalMessage,
    resourceName = "리소스",
  } = options;

  return function WithOwnershipComponent(props: T) {
    const { user } = useAuth();
    const [authModal, setAuthModal] = useState(false);
    const [ownershipModal, setOwnershipModal] = useState(false);

    // 인증되지 않은 사용자
    if (!user) {
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }
      return null; // 기본적으로 아무것도 표시하지 않음
    }

    // 소유권이 없는 사용자
    if (!checkOwnership(user, props)) {
      if (FallbackComponent) {
        return <FallbackComponent {...props} />;
      }
      return null; // 기본적으로 아무것도 표시하지 않음
    }

    // 인증 실행 함수 추가 (withAuth와 동일한 인터페이스)
    const enhancedProps = { ...props } as T & {
      executeWithAuth: (action: () => void) => void;
      executeWithOwnership: (action: () => void) => void;
      isAuthenticated: boolean;
      isOwner: boolean;
      user: any;
    };

    enhancedProps.executeWithAuth = (action: () => void) => {
      if (!user) {
        setAuthModal(true);
        return;
      }
      action();
    };

    enhancedProps.executeWithOwnership = (action: () => void) => {
      if (!user) {
        setAuthModal(true);
        return;
      }
      if (!checkOwnership(user, props)) {
        if (showOwnershipModal) {
          setOwnershipModal(true);
        }
        return;
      }
      action();
    };

    enhancedProps.isAuthenticated = !!user;
    enhancedProps.isOwner = checkOwnership(user, props);
    enhancedProps.user = user;

    return (
      <>
        <WrappedComponent {...enhancedProps} />

        {/* 인증 모달 */}
        <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />

        {/* 소유권 모달 */}
        {showOwnershipModal && (
          <AlertDialog open={ownershipModal} onOpenChange={setOwnershipModal}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>권한이 없습니다</AlertDialogTitle>
                <AlertDialogDescription>
                  {ownershipModalMessage ||
                    `이 ${resourceName}에 대한 권한이 없습니다. 본인이 작성한 ${resourceName}만 수정하거나 삭제할 수 있습니다.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setOwnershipModal(false)}>
                  확인
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  };
}
