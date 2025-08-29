"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { POST_ROUTES } from "@/constants/posts";
import {
  ArrowDown,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  MessageCircle,
  PenTool,
  Share2,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-24">
        <div className="flex flex-col items-center mb-12">
          <PenTool className="h-12 w-12 text-gray-900 mb-4" />
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
            이렇게 변환됩니다
          </h2>
          <p className="text-center text-gray-600 mb-12">
            일상의 단순한 표현이 어떻게 문학적으로 변환되는지 확인해보세요
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 예시 1 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    변환 전
                  </span>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                  <p className="text-gray-800 text-center">
                    "오늘 진짜 짜증났어. 모든 게 다 싫다."
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-red-600 font-medium">
                      😤 분노
                    </span>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-5 w-5" />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    변환 후
                  </span>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300 shadow-md">
                  <p className="text-gray-800 italic text-center">
                    "오늘 마음이 무거운 구름에 가려진 듯하다. 모든 것이 잿빛으로
                    물들어 보인다."
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-blue-600 font-medium">
                      📖 현대 문학 스타일
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 예시 2 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    변환 전
                  </span>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                  <p className="text-gray-800 text-center">
                    "너무 기뻐! 세상이 다 내 것 같아!"
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-yellow-600 font-medium">
                      😄 기쁨
                    </span>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="flex items-center gap-1 text-green-500">
                    <ArrowDown className="h-5 w-5" />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    변환 후
                  </span>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300 shadow-md">
                  <p className="text-gray-800 italic text-center">
                    "가슴 속 샘물이 솟구쳐 오르고, 온 세상이 환한 빛으로
                    물들었다."
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-green-600 font-medium">
                      ✨ 힙스터 피드 스타일
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 예시 3 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    변환 전
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                  <p className="text-gray-800 text-center">
                    "졸라 피곤해... 죽고 싶다"
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-600 font-medium">
                      😔 우울
                    </span>
                  </div>
                </div>

                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center space-x-1">
                    <ArrowDown className="h-5 w-5 text-purple-600" />
                    </div>
                </div>

                <div className="text-center mb-4">
                  <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    변환 후
                  </span>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300 shadow-md">
                  <p className="text-gray-800 italic text-center">
                    "지친 영혼이 안식을 갈망하며, 깊은 잠 속으로 스며들고
                    싶어한다."
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-purple-600 font-medium">
                      📻 한밤중의 라디오
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 예시 4 */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    변환 전
                  </span>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200 mb-4">
                  <p className="text-gray-800 text-center">
                    "아 진짜 설레! 심쿵이야!"
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-pink-600 font-medium">
                      💕 설렘
                    </span>
                  </div>
                </div>

                <div className="flex justify-center items-center mb-4">
                  <div className="flex items-center space-x-1">
                    <ArrowDown className="h-5 w-5 text-rose-600" />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <span className="text-sm font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                    변환 후
                  </span>
                </div>
                <div className="p-4 bg-rose-50 rounded-lg border-2 border-rose-300 shadow-md">
                  <p className="text-gray-800 italic text-center">
                    "가슴 속 작은 새가 날개를 펼치며, 봄바람처럼 달콤한 떨림이
                    스며든다."
                  </p>
                  <div className="text-center mt-2">
                    <span className="text-xs text-rose-600 font-medium">
                      📝 수필 스타일
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 효과 및 가치 섹션 통합 */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            구절구절이 특별한 이유
          </h2>
          <p className="text-center text-gray-600 mb-12">
            단순한 글쓰기 도구를 넘어, 당신의 표현력을 근본적으로 바꿔주는 AI
            첨삭 서비스입니다.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI 맞춤형 첨삭</h3>
              <p className="text-gray-600">
                목적에 따라 달라지는 스타일. 학술용, 전문가용, SNS용으로 각각
                다른 톤앤매너로 첨삭해드립니다.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">실시간 점수 제공</h3>
              <p className="text-gray-600">
                작문 실력, 창의성, 감정 표현도 등을 점수로 확인하며 글쓰기
                실력을 체계적으로 향상시키세요.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">랭킹 & 소셜 기능</h3>
              <p className="text-gray-600">
                다른 사용자들과 점수를 비교하고, 좋은 글을 SNS에 공유하며
                동기부여를 얻으세요.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <PenTool className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">글쓰기 연습 도구</h3>
              <p className="text-gray-600">
                매일 조금씩 글을 쓰고 첨삭받으며 자연스럽게 표현력이 향상됩니다.
                어휘력도 덤으로 늘어나요.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">즉시 활용 가능</h3>
              <p className="text-gray-600">
                첨삭된 글을 바로 SNS, 블로그, 과제 등에 활용할 수 있어 실용성이
                뛰어납니다.
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">재미있는 학습</h3>
              <p className="text-gray-600">
                딱딱한 공부가 아닌 놀이하듯 글쓰기를 배우고, 내 글이 변화하는
                재미를 느껴보세요.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl text-center">
            <p className="text-blue-800 font-medium mb-2">
              ✨ 무료 베타 서비스 체험 중
            </p>
            <p className="text-blue-600 text-sm">
              사용자 피드백을 바탕으로 지속적으로 업데이트되는 AI 첨삭 서비스
            </p>
          </div>
        </div>
      </section>

      {/* 주요 기능 소개 섹션 */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            구절구절의 핵심 기능들
          </h2>
          <p className="text-center text-gray-600 mb-12">
            단순한 변환을 넘어, 체계적인 글쓰기 성장 플랫폼을 경험해보세요
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <PenTool className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                목적별 AI 첨삭
              </h3>
              <p className="text-sm text-gray-600 text-center">
                학술용, 전문가용, SNS용 각각 다른 스타일로 맞춤 첨삭
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                실시간 점수 시스템
              </h3>
              <p className="text-sm text-gray-600 text-center">
                작문, 창의성, 감정 표현 등 세부 점수로 실력 확인
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                랭킹 시스템
              </h3>
              <p className="text-sm text-gray-600 text-center">
                다른 사용자들과 점수 비교하며 동기부여 UP
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-500">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Share2 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                SNS 공유 기능
              </h3>
              <p className="text-sm text-gray-600 text-center">
                첨삭된 멋진 글을 바로 SNS에 공유하고 자랑하기
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                댓글 & 반응 시스템
              </h3>
              <p className="text-sm text-gray-600 text-center">
                다른 사용자들과 소통하며 함께 성장하는 커뮤니티
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                성취 배지 시스템
              </h3>
              <p className="text-sm text-gray-600 text-center">
                다양한 도전과제를 달성하며 글쓰기 실력 레벨업
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                사용자 프로필
              </h3>
              <p className="text-sm text-gray-600 text-center">
                내 글쓰기 히스토리와 성장 과정을 한눈에 확인
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-500">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">
                신고 & 관리 시스템
              </h3>
              <p className="text-sm text-gray-600 text-center">
                건전한 커뮤니티 환경을 위한 신고 및 관리 기능
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href={POST_ROUTES.CREATE}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold px-8 py-3"
              >
                모든 기능 무료로 체험하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 타겟별 어필 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            이런 분들에게 특히 도움이 됩니다
          </h2>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <div className="text-6xl mb-2">🎓</div>
                <h3 className="text-xl font-bold mb-2">학습자 & 수험생</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-2">
                  <strong>수능, 논술, 글쓰기 실력 향상</strong>에 직접적 도움
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 감정을 다양하게 표현하는 어휘력 확장</li>
                  <li>• 문학 작품 연계로 국어 성적 향상</li>
                  <li>• 논술과 작문에 바로 활용 가능한 표현력</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <div className="text-6xl mb-2">💼</div>
                <h3 className="text-xl font-bold mb-2">직장인 & 전문가</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-2">
                  <strong>업무, 소통에서 전문성</strong>을 보여주고 싶은 분
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 기획서, 보고서 작성 시 표현력 향상</li>
                  <li>• 동료, 고객과의 메신저에서 품격 있는 소통</li>
                  <li>• 개인 브랜딩을 위한 글쓰기 실력 UP</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <div className="text-6xl mb-2">✨</div>
                <h3 className="text-xl font-bold mb-2">
                  세련된 표현을 원하는 분
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-2">
                  <strong>SNS, 일상 대화에서 매력적으로</strong> 소통하고 싶은
                  분
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 인스타그램, 블로그 게시글이 더 감각적으로</li>
                  <li>• 연인, 친구와의 대화에서 특별함 어필</li>
                  <li>• "글 정말 잘 쓰네요" 칭찬받는 경험</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/3">
                <div className="text-6xl mb-2">📝</div>
                <h3 className="text-xl font-bold mb-2">
                  글쓰기 연습을 원하는 분
                </h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-2">
                  <strong>체계적인 피드백</strong>으로 글쓰기 실력을 늘리고 싶은
                  분
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI 점수로 객관적인 실력 확인</li>
                  <li>• 매일 조금씩, 부담 없는 글쓰기 연습</li>
                  <li>• 실제 활용 가능한 실용적 표현 학습</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작해보세요</h2>
          <p className="text-xl mb-8 opacity-90">
            당신의 일상을 문학으로 바꿔보세요
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
          <p className="mt-4 text-sm opacity-75">회원가입 후 즉시 체험 가능</p>
        </div>
      </section>
    </main>
  );
}
