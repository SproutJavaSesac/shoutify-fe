"use client";

import {
  useAuth,
  LoginButton,
  LogoutButton,
  UserProfile,
  DevAuthController,
} from "@/lib/auth";

export default function Navigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Shoutify</h1>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-500">로딩 중...</div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Shoutify</h1>

              {isAuthenticated && (
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <a
                    href="/"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    홈
                  </a>
                  <a
                    href="/feed"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    피드
                  </a>
                  <a
                    href="/my-page"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    마이페이지
                  </a>
                  <a
                    href="/rankings"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    랭킹
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <UserProfile />
                  <LogoutButton />
                </>
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 개발자 도구 (개발 환경에서만 표시) */}
      <DevAuthController />
    </>
  );
}
