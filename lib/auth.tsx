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

export function AuthProvider({ children }: AuthProviderProps) {
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

// 인증이 필요한 컴포넌트를 위한 HOC
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading, login } = useAuth();

    if (loading) {
      return <div>로딩 중...</div>;
    }

    if (!isAuthenticated) {
      // 로그인 페이지로 리디렉션하거나 로그인 모달을 표시
      // 여기서는 간단하게 로그인 버튼을 보여주는 예시
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="mb-4">로그인이 필요한 서비스입니다.</p>
          <button
            onClick={() => login("google")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Google로 로그인
          </button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// 로그인 버튼 컴포넌트 (AuthModal 사용으로 인해 현재는 불필요)
/*
export function LoginButton() {
  const handleLogin = () => {
    // 바로 리다이렉트
    console.log("🚀 구글 로그인 시작");
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:8080";
    window.location.href = `${backendUrl}/api/oauth2/authorization/google`;
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Google로 로그인
    </button>
  );
}
*/

// 로그아웃 버튼 컴포넌트
export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      로그아웃
    </button>
  );
}

// 사용자 정보 표시 컴포넌트
export function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{user.nickname}</span>
      <span className="text-xs text-gray-400">({user.email})</span>
    </div>
  );
}

// 개발 환경용 인증 컨트롤러 (개발 중에만 표시)
export function DevAuthController() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const { isAuthenticated, user, logout } = useAuth();

  const setMockAuth = () => {
    // JSESSIONID 쿠키 설정하여 하드코딩된 인증 트리거
    document.cookie = "JSESSIONID=mock-session-id; path=/";
    window.location.reload();
  };

  const clearMockAuth = () => {
    // JSESSIONID 쿠키 삭제
    document.cookie =
      "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4 shadow-lg">
      <div className="text-xs font-bold text-yellow-800 mb-2">
        🔧 개발자 도구
      </div>

      <div className="text-xs text-yellow-700 mb-2">
        현재 상태:{" "}
        {isAuthenticated ? `로그인됨 (${user?.nickname})` : "비로그인"}
      </div>

      <div className="space-y-2">
        {!isAuthenticated ? (
          <div className="space-y-1">
            <button
              onClick={setMockAuth}
              className="w-full text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Mock 로그인 (하드코딩)
            </button>
            <button
              onClick={() => {
                console.log("🚀 실제 OAuth2 로그인 시작");
                const backendUrl =
                  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
                  "http://localhost:8080";
                window.location.href = `${backendUrl}/api/oauth2/authorization/google`;
              }}
              className="w-full text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              실제 OAuth2 로그인
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <button
              onClick={logout}
              className="w-full text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              로그아웃
            </button>
            {user?.id === 1 && (
              <button
                onClick={clearMockAuth}
                className="w-full text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Mock 세션 삭제
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
