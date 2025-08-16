"use client";

import {
  logout as authLogout,
  checkLoginStatus,
  deleteAccount,
  loginWithGoogle,
} from "@/apis/auth";
import { useToast } from "@/hooks/use-toast";
import type { AuthState, AuthUser, OAuth2Provider } from "@/types/auth";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue extends AuthState {
  login: (provider: OAuth2Provider, redirectUrl?: string) => void;
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
    roleType: "GUEST",
  });
  const [wasLoggedOut, setWasLoggedOut] = useState(false); // 로그아웃 상태에서 로그인 성공 감지용
  const { toast } = useToast();

  // 로그인 상태 확인
  const checkAuthStatus = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      // 실제 API 호출 (프로덕션 또는 JSESSIONID 없는 경우)
      const authData = await checkLoginStatus();

      if (authData.isAuthenticated) {
        const user: AuthUser = {
          id: authData.memberId,
          email: authData.email,
          nickname: authData.nickname,
          roleType: authData.roleType,
        };

        setState({
          isAuthenticated: true,
          user,
          loading: false,
          roleType: authData.roleType,
        });

        // 로그아웃 상태에서 로그인 성공 시 토스트 표시
        if (wasLoggedOut || !state.isAuthenticated) {
          toast({
            description: `환영합니다, ${user.nickname}님!`,
          });
          setWasLoggedOut(false);

        }
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
          roleType: "GUEST",
        });
        if (state.isAuthenticated) {
          setWasLoggedOut(true); // 로그인 상태에서 로그아웃된 경우
        }
      }
    } catch (error) {
      // 비로그인 상태로 설정
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        roleType: "GUEST",
      });
      if (state.isAuthenticated) {
        setWasLoggedOut(true); // 로그인 상태에서 오류가 발생한 경우
      }
    }
  };

  const login = (provider: OAuth2Provider, redirectUrl?: string) => {
    // 리다이렉트 URL이 제공되면 localStorage에도 저장 (백업용)
    if (redirectUrl && typeof window !== "undefined") {
      localStorage.setItem("auth_redirect_url", redirectUrl);
    }

    if (provider === "google") {
      loginWithGoogle(redirectUrl);
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
        roleType: "GUEST",
      });
      setWasLoggedOut(true); // 로그아웃 표시
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
        roleType: "GUEST",
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
    roleType: state.roleType,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
