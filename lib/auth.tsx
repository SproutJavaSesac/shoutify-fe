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
import { useToast } from "@/hooks/use-toast";

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
  });
  const [wasLoggedOut, setWasLoggedOut] = useState(false); // 로그아웃 상태에서 로그인 성공 감지용
  const { toast } = useToast();

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
            "🔧 개발 모드: JSESSIONID 감지됨, 하드코딩된 회원 정보 사용"
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

          // 로그아웃 상태에서 로그인 성공 시 토스트 표시 (개발 모드)
          if (wasLoggedOut || !state.isAuthenticated) {
            toast({
              description: `환영합니다, ${mockUser.nickname}님! (개발 모드)`,
            });
            setWasLoggedOut(false);

            // URL 쿼리 파라미터에서 리다이렉트 URL 확인 (개발 모드)
            if (typeof window !== "undefined") {
              const urlParams = new URLSearchParams(window.location.search);
              const redirectFromUrl = urlParams.get("redirect");
              const redirectFromStorage =
                localStorage.getItem("auth_redirect_url");

              console.log("🔄 리다이렉트 확인 (개발모드):", {
                fromUrl: redirectFromUrl,
                fromStorage: redirectFromStorage,
                currentUrl: window.location.href,
              });

              const redirectUrl = redirectFromUrl || redirectFromStorage;

              if (redirectUrl) {
                localStorage.removeItem("auth_redirect_url");
                // URL 파라미터 정리
                if (urlParams.has("redirect")) {
                  const newUrl = new URL(window.location.href);
                  newUrl.searchParams.delete("redirect");
                  window.history.replaceState({}, "", newUrl.toString());
                }

                console.log("🚀 리다이렉트 실행 (개발모드):", redirectUrl);

                // 약간의 지연을 두어 토스트가 표시된 후 리다이렉트
                setTimeout(() => {
                  window.location.href = redirectUrl;
                }, 1000);
              }
            }
          }
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

        // 로그아웃 상태에서 로그인 성공 시 토스트 표시
        if (wasLoggedOut || !state.isAuthenticated) {
          toast({
            description: `환영합니다, ${user.nickname}님!`,
          });
          setWasLoggedOut(false);

          // URL 쿼리 파라미터에서 리다이렉트 URL 확인
          if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectFromUrl = urlParams.get("redirect");
            const redirectFromStorage =
              localStorage.getItem("auth_redirect_url");

            console.log("🔄 리다이렉트 확인:", {
              fromUrl: redirectFromUrl,
              fromStorage: redirectFromStorage,
              currentUrl: window.location.href,
            });

            const redirectUrl = redirectFromUrl || redirectFromStorage;

            if (redirectUrl) {
              localStorage.removeItem("auth_redirect_url");
              // URL 파라미터 정리
              if (urlParams.has("redirect")) {
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete("redirect");
                window.history.replaceState({}, "", newUrl.toString());
              }

              console.log("🚀 리다이렉트 실행:", redirectUrl);

              // 약간의 지연을 두어 토스트가 표시된 후 리다이렉트
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 1000);
            }
          }
        }
      } else {
        setState({
          isAuthenticated: false,
          user: null,
          loading: false,
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
      });
      if (state.isAuthenticated) {
        setWasLoggedOut(true); // 로그인 상태에서 오류가 발생한 경우
      }
    }
  };

  const login = (provider: OAuth2Provider, redirectUrl?: string) => {
    // 리다이렉트 URL이 제공되면 localStorage에도 저장 (백업용)
    if (redirectUrl && typeof window !== "undefined") {
      console.log("💾 리다이렉트 URL 저장:", redirectUrl);
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
