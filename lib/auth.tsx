"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  checkLoginStatus,
  deleteAccount,
  loginWithGoogle,
  logout as authLogout,
} from "@/apis/auth";
import type { AuthState, AuthUser, OAuth2Provider } from "@/types/auth";

interface AuthContextValue extends AuthState {
  login: (provider: OAuth2Provider) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // 로그인 상태 확인
  const checkAuthStatus = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      // 개발 환경에서 JSESSIONID 기반 임시 인증 처리
      if (process.env.NODE_ENV === "development") {
        const hasJSessionId = document.cookie
          .split("; ")
          .some((cookie) => cookie.startsWith("JSESSIONID="));

        if (hasJSessionId) {
          console.log(
            "🔧 개발 모드: JSESSIONID 감지됨, 하드코딩된 회원 정보 사용",
          );

          // 백엔드 더미 데이터와 동일한 회원 정보 (sesac1@gmail.com)
          const mockUser: AuthUser = {
            id: 1,
            email: "sesac1@gmail.com",
            nickname: "행복한 코알라",
            provider: "google",
          };

          setState({
            isAuthenticated: true,
            user: mockUser,
            loading: false,
          });
          return;
        }
      }

      // 실제 API 호출 (프로덕션 또는 JSESSIONID 없는 경우)
      const authData = await checkLoginStatus();

      if (
        authData.isAuthenticated &&
        authData.memberId &&
        authData.email &&
        authData.nickname
      ) {
        const user: AuthUser = {
          id: authData.memberId,
          email: authData.email,
          nickname: authData.nickname,
        };

        setState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      // 비로그인 상태로 설정
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const login = (provider: OAuth2Provider) => {
    if (provider === "google") {
      loginWithGoogle();
    }
    // 다른 소셜 로그인 추가 시 여기에 로직 추가
    // if (provider === 'kakao') { ... }
  };

  // 로그아웃
  const logout = async () => {
    try {
      // 백엔드 세션 무효화를 위해 실제 API 호출
      await authLogout();
    } catch (error) {
      console.error("API 로그아웃 호출에 실패했습니다:", error);
      // API 호출이 실패하더라도 클라이언트 측에서는 로그아웃을 계속 진행합니다.
    } finally {
      // JSESSIONID 쿠키를 확실히 삭제합니다.
      if (typeof window !== "undefined") {
        console.log("클라이언트에서 JSESSIONID 쿠키를 삭제합니다.");
        document.cookie =
          "JSESSIONID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      // 클라이언트 상태를 초기화합니다.
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const withdraw = async () => {
    try {
      // 회원 탈퇴 API 호출
      await deleteAccount(); // 실제 회원 탈퇴 API로 변경 필요
      // JSESSIONID 쿠키 삭제
      if (typeof window !== "undefined") {
        document.cookie =
          "JSESSIONID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      // 상태 초기화
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error("회원 탈퇴에 실패했습니다:", error);
    }
  };

  // 초기 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // OAuth2 로그인 후 리다이렉트될 때 상태 재확인
  useEffect(() => {
    const handleFocus = () => {
      // OAuth2 로그인 후 돌아왔을 때 상태 확인
      if (!state.isAuthenticated && !state.loading) {
        checkAuthStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [state.isAuthenticated, state.loading]);

  const value: AuthContextValue = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
