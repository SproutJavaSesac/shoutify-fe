"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 새로운 API 구조를 사용한 예시 컴포넌트들
import { NewPostFeed } from "@/components/examples/new-post-feed";

// 개발자 도구들
import { DevAuthController, useAuth } from "@/lib/auth";

export default function DevTestPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user } = useAuth();

  const categories = [
    "All",
    "melancholy",
    "joyful",
    "contemplative",
    "romantic",
    "inspiring",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              🧪 개발 테스트 페이지 (로그인 불필요)
            </CardTitle>
            <div className="text-center space-y-2">
              <div className="flex justify-center space-x-4">
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated
                    ? `로그인됨 (${user?.nickname})`
                    : "비로그인"}
                </Badge>
                <Badge variant="outline">개발 모드</Badge>
              </div>
              <p className="text-sm text-gray-600">
                이 페이지에서는 로그인 없이도 모든 기능을 테스트할 수 있습니다.
                <br />
                우측 하단의 개발자 도구로 로그인 상태를 쉽게 변경할 수 있어요!
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* 테스트 섹션들 */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">게시글 피드</TabsTrigger>
            <TabsTrigger value="api">API 테스트</TabsTrigger>
            <TabsTrigger value="components">컴포넌트</TabsTrigger>
            <TabsTrigger value="tools">개발 도구</TabsTrigger>
          </TabsList>

          {/* 게시글 피드 테스트 */}
          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>📝 새로운 API 구조 - 게시글 피드</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="게시글 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    클리어
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <NewPostFeed
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* API 테스트 */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🔌 API 연결 테스트</CardTitle>
                <p className="text-sm text-gray-600">
                  백엔드가 꺼져있어도 Mock 데이터로 테스트 가능합니다.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">✅ 작동하는 API들 (Mock)</h4>
                    <ul className="text-sm space-y-1 text-green-600">
                      <li>• 게시글 목록 조회</li>
                      <li>• 댓글 목록 조회</li>
                      <li>• 랭킹 조회</li>
                      <li>• 사용자 정보 조회</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">⚠️ 백엔드 필요한 API들</h4>
                    <ul className="text-sm space-y-1 text-orange-600">
                      <li>• 실제 OAuth2 로그인</li>
                      <li>• 게시글 작성/수정/삭제</li>
                      <li>• 댓글 작성</li>
                      <li>• 반응하기</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 컴포넌트 테스트 */}
          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🧩 컴포넌트 테스트</CardTitle>
                <p className="text-sm text-gray-600">
                  `components/examples/` 폴더의 예시 컴포넌트들을 테스트할 수
                  있습니다.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild variant="outline">
                    <a href="/examples/new-post-feed" target="_blank">
                      📝 새 게시글 피드
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/examples/my-page" target="_blank">
                      👤 마이페이지
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/examples/navigation" target="_blank">
                      🧭 네비게이션
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/examples/with-auth" target="_blank">
                      🔐 인증 테스트
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 개발 도구 */}
          <TabsContent value="tools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>🛠️ 개발 도구</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    🔧 개발자 도구 사용법
                  </h4>
                  <ol className="text-sm text-yellow-700 space-y-1">
                    <li>
                      1. 페이지 우측 하단의 "🔧 개발자 도구" 박스를 찾으세요
                    </li>
                    <li>
                      2. "Mock 로그인" 버튼으로 즉시 로그인 (백엔드 불필요)
                    </li>
                    <li>3. "실제 OAuth2 로그인"으로 백엔드 연결 테스트</li>
                    <li>4. "로그아웃" 버튼으로 인증 상태 해제</li>
                  </ol>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    🚀 개발 팁
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 대부분의 기능이 Mock 데이터로 작동합니다</li>
                    <li>• API 에러는 자동으로 fallback 처리됩니다</li>
                    <li>• 개발자 도구는 프로덕션에서 자동 숨김</li>
                    <li>• 모든 타입과 API가 도메인별로 분리되어 있어요</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 빠른 액세스 버튼들 */}
        <Card>
          <CardHeader>
            <CardTitle>🔗 빠른 링크</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild>
                <a href="/">홈</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/posts">게시글</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/mypage">마이페이지</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/admin">관리자</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 개발자 도구 컴포넌트 */}
      <DevAuthController />
    </div>
  );
}
