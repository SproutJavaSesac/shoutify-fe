"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PenTool, BookOpen, Sparkles, Users, ArrowRight } from "lucide-react";
import { POST_ROUTES } from "@/constants/posts";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-24">
        <div className="flex flex-col items-center mb-12">
          <Image
            src="/favicon.ico"
            alt="구절구절 프리즘 로고"
            width={100}
            height={100}
            className="mb-4 hover:scale-105 transition-transform"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 text-center">
            구절구절
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-6 text-center max-w-3xl">
            당신의 <span className="font-bold text-red-500">감정</span>을
            <span className="font-bold text-blue-600"> 프리즘</span>에 통과시켜
            <span className="font-bold text-purple-600"> 무지개빛 문학</span>
            으로 바꿔줍니다
            <br />
            <span className="text-base text-gray-500 mt-2 block">
              "짜증나"를 "마음이 무거운 구름에 가려진 듯하다"로, AI 프리즘과
              함께 ✨
            </span>
          </p>
          <div className="flex gap-4 mt-2">
            <Link href={POST_ROUTES.CREATE}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 flex items-center"
              >
                <PenTool className="mr-2 h-5 w-5" />
                바로 변환해보기
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 실제 변환 예시 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            이렇게 바뀝니다
          </h2>
          <p className="text-center text-gray-600 mb-12">
            일상의 단순한 표현이 어떻게 문학적으로 변환되는지 확인해보세요
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 예시 1 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    변환 전
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    변환 후
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-gray-800">
                      "오늘 진짜 짜증났어. 모든 게 다 싫다."
                    </p>
                    <span className="text-xs text-red-600 font-medium">
                      😤 분노
                    </span>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-gray-800 italic">
                      "오늘 마음이 무거운 구름에 가려진 듯하다. 모든 것이
                      잿빛으로 물들어 보인다."
                    </p>
                    <span className="text-xs text-blue-600 font-medium">
                      📖 김소월 스타일
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 예시 2 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    변환 전
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    변환 후
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-gray-800">
                      "너무 기뻐! 세상이 다 내 것 같아!"
                    </p>
                    <span className="text-xs text-yellow-600 font-medium">
                      😄 기쁨
                    </span>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-gray-800 italic">
                      "가슴 속 샘물이 솟구쳐 오르고, 온 세상이 환한 빛으로
                      물들었다."
                    </p>
                    <span className="text-xs text-green-600 font-medium">
                      🌸 현대시 스타일
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 예시 3 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    변환 전
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    변환 후
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800">"졸라 피곤해... 죽고 싶다"</p>
                    <span className="text-xs text-gray-600 font-medium">
                      😔 우울
                    </span>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-gray-800 italic">
                      "지친 영혼이 안식을 갈망하며, 깊은 잠 속으로 스며들고
                      싶어한다."
                    </p>
                    <span className="text-xs text-purple-600 font-medium">
                      🎭 셰익스피어 스타일
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 예시 4 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    변환 전
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">
                    변환 후
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <p className="text-gray-800">"아 진짜 설레! 심쿵이야!"</p>
                    <span className="text-xs text-pink-600 font-medium">
                      💕 설렘
                    </span>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                    <p className="text-gray-800 italic">
                      "가슴 속 작은 새가 날개를 펼치며, 봄바람처럼 달콤한 떨림이
                      스며든다."
                    </p>
                    <span className="text-xs text-rose-600 font-medium">
                      🌹 로맨틱 시 스타일
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 효과 및 가치 섹션 */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            왜 구절구절을 써야 할까요?
          </h2>
          <p className="text-center text-gray-600 mb-12">
            단순히 욕설만 필터링하는 게 아닙니다. 당신의 감정을 더 풍부하게
            표현해보세요.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">어휘력 향상</h3>
              <p className="text-gray-600">
                "짜증나"만 쓰던 당신, 이제 100가지 방법으로 감정을 표현해보세요.
                실제로 사용하면서 자연스럽게 어휘력이 늘어납니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">있어 보이는 표현</h3>
              <p className="text-gray-600">
                SNS에 올려도 부끄럽지 않은 문학적 표현으로. "와 글 잘 쓰네"라는
                말을 들어보세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">건전한 소통</h3>
              <p className="text-gray-600">
                욕설과 비속어 대신 품격 있는 표현으로 소통해보세요. 상대방도,
                나도 기분이 좋아집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 타겟별 어필 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            누구에게 도움이 될까요?
          </h2>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <div className="text-6xl mb-2">🎓</div>
                <h3 className="text-xl font-bold mb-2">청소년 & 학생</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-2">
                  <strong>수능, 논술, 글쓰기 실력 향상</strong>에 직접적 도움
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 감정을 다양하게 표현하는 어휘력 확장</li>
                  <li>• 문학 작품 연계로 국어 성적 향상</li>
                  <li>• 친구들과 함께 쓰면서 재미있게 학습</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <div className="text-6xl mb-2">💼</div>
                <h3 className="text-xl font-bold mb-2">20-30대 직장인</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-2">
                  <strong>업무, 연애, 인간관계</strong>에서 품격 있는 소통
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SNS 게시글이 더 멋있어집니다</li>
                  <li>• 카톡, 메신저에서 감정을 세련되게 표현</li>
                  <li>• 자기계발, 글쓰기 취미와 연결</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <div className="text-6xl mb-2">📚</div>
                <h3 className="text-xl font-bold mb-2">문해력 관심있는 분들</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-2">
                  <strong>독서는 어렵지만 어휘력은 늘리고 싶은</strong> 모든 분
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 책 한 권 읽는 것보다 쉽고 재미있게</li>
                  <li>• 실생활에서 바로 써볼 수 있는 표현들</li>
                  <li>• 매일 조금씩, 부담 없이 향상</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 소개 섹션 */}
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            왜 구절구절을 써야 할까요?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                표현력이 늘어나요
              </h3>
              <p className="text-gray-600">
                매일 쓰는 일상 표현이 점점 더 풍부하고 세련되게 바뀝니다.
                글쓰기가 늘면 말하기도 자연스럽게 늘어나죠.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">💭</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                감정을 잘 전달해요
              </h3>
              <p className="text-gray-600">
                "짜증나"보다 "답답함이 마음을 무겁게 하네요"가 상대방에게 훨씬
                잘 전달되고 이해받을 수 있어요.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                상황에 맞게 써요
              </h3>
              <p className="text-gray-600">
                친구와의 대화, 직장 동료와의 소통, 연인과의 메시지까지 상황에
                맞는 톤앤매너로 표현해드려요.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                재미있게 성장해요
              </h3>
              <p className="text-gray-600">
                어려운 공부가 아니라 놀이하듯이 표현을 배워요. 내 글이 변화하는
                걸 보는 재미가 쏠쏠합니다.
              </p>
            </div>
          </div>

          <div className="bg-purple-100 p-6 rounded-xl">
            <p className="text-purple-800 font-medium mb-2">
              ✨ 지금 베타 서비스로 무료 체험 중
            </p>
            <p className="text-purple-600 text-sm">
              여러분의 소중한 피드백으로 더 나은 서비스를 만들어가고 있어요
            </p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작해보세요</h2>
          <p className="text-xl mb-8 opacity-90">
            당신의 첫 번째 감정을 문학으로 바꿔보세요
          </p>
          <Link href={POST_ROUTES.CREATE}>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-12 py-4 text-lg"
            >
              <PenTool className="mr-3 h-6 w-6" />
              무료로 변환해보기
            </Button>
          </Link>
          <p className="mt-4 text-sm opacity-75">
            회원가입 필요 없음 • 즉시 체험 가능
          </p>
        </div>
      </section>
    </main>
  );
}
