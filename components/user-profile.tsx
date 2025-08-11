"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Bookmark,
  Heart,
  MessageCircle,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { POST_ROUTES } from "@/constants/posts";
import {
  useMyBadges,
  useMyInfo,
  useMyPosts,
  useMyRanking,
  useUserBadges,
  useUserInfo,
  useUserPosts,
  useUserRanking,
} from "@/lib/hooks/useMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { MyBadgeSummary, MyPostSummary, RankingSummary } from "@/types/members";
import { RankingCategoryType, RankingPeriodType } from "@/types/rankings";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { IdType } from "@/types/apis";

interface UserProfileProps {
  memberId: IdType;
}

const emotionColors = {
  기쁨: "bg-yellow-100 text-yellow-800",
  분노: "bg-red-100 text-red-800",
  슬픔: "bg-blue-100 text-blue-800",
  놀람: "bg-purple-100 text-purple-800",
  두려움: "bg-gray-100 text-gray-800",
  혐오: "bg-green-100 text-green-800",
  신뢰: "bg-teal-100 text-teal-800",
  기대: "bg-orange-100 text-orange-800",
  // 영어 키도 유지 (기존 데이터 호환성)
  HAPPY: "bg-yellow-100 text-yellow-800",
  SAD: "bg-blue-100 text-blue-800",
  ANGRY: "bg-red-100 text-red-800",
  EXCITED: "bg-orange-100 text-orange-800",
  CONFUSED: "bg-purple-100 text-purple-800",
  PROUD: "bg-green-100 text-green-800",
};

// 감정 타입 영어 → 한국어 변환 맵
const emotionTypeTranslation: { [key: string]: string } = {
  HAPPY: "기쁨",
  SAD: "슬픔",
  ANGRY: "분노",
  EXCITED: "흥미",
  CONFUSED: "혼란",
  PROUD: "자랑",
};

const formatJoinDate = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: ko,
  });
};

export function UserProfile({ memberId }: Readonly<{ memberId: IdType }>) {
  // 현재 로그인한 사용자 정보 조회 (비교용)
  const { data: currentUser } = useMyInfo();

  // memberId가 현재 사용자와 같으면 내 정보, 다르면 다른 사용자 정보 조회
  const isMyProfile = currentUser?.memberId.toString() === memberId.toString();

  // 내 정보 조회 훅들
  const {
    data: myInfo,
    loading: myInfoLoading,
    error: myInfoError,
    refetch: refetchMyInfo,
  } = useMyInfo({ immediate: isMyProfile });

  const {
    data: myPosts,
    loading: myPostsLoading,
    error: myPostsError,
    refetch: refetchMyPosts,
  } = useMyPosts({ page: 1, size: 10 }, { immediate: isMyProfile });

  const {
    data: myBadges,
    loading: myBadgesLoading,
    error: myBadgesError,
    refetch: refetchMyBadges,
  } = useMyBadges({ page: 1, size: 10 }, { immediate: isMyProfile });

  const {
    data: myRanking,
    loading: myRankingLoading,
    error: myRankingError,
    refetch: refetchMyRanking,
  } = useMyRanking(
    {
      category: "POST" as RankingCategoryType,
      period: 30,
      periodType: "MONTHLY" as RankingPeriodType,
    },
    { immediate: isMyProfile },
  );

  // 다른 사용자 정보 조회 훅들
  const {
    data: userInfo,
    loading: userInfoLoading,
    error: userInfoError,
    refetch: refetchUserInfo,
  } = useUserInfo(memberId, { immediate: !isMyProfile });

  const {
    data: userPosts,
    loading: userPostsLoading,
    error: userPostsError,
    refetch: refetchUserPosts,
  } = useUserPosts(
    memberId,
    { page: 1, size: 10 },
    { immediate: !isMyProfile },
  );

  const {
    data: userBadges,
    loading: userBadgesLoading,
    error: userBadgesError,
    refetch: refetchUserBadges,
  } = useUserBadges(
    memberId,
    { page: 1, size: 10 },
    { immediate: !isMyProfile },
  );

  const {
    data: userRanking,
    loading: userRankingLoading,
    error: userRankingError,
    refetch: refetchUserRanking,
  } = useUserRanking(
    memberId,
    {
      category: "POST" as RankingCategoryType,
      period: 30,
      periodType: "MONTHLY" as RankingPeriodType,
    },
    { immediate: !isMyProfile },
  );

  // 현재 표시할 데이터 선택
  const displayInfo = isMyProfile ? myInfo : userInfo;
  const displayPosts = isMyProfile ? myPosts : userPosts;
  const displayBadges = isMyProfile ? myBadges : userBadges;
  const displayRanking = isMyProfile ? myRanking : userRanking;

  const infoLoading = isMyProfile ? myInfoLoading : userInfoLoading;
  const postsLoading = isMyProfile ? myPostsLoading : userPostsLoading;
  const badgesLoading = isMyProfile ? myBadgesLoading : userBadgesLoading;
  const rankingLoading = isMyProfile ? myRankingLoading : userRankingLoading;

  const infoError = isMyProfile ? myInfoError : userInfoError;
  const postsError = isMyProfile ? myPostsError : userPostsError;
  const badgesError = isMyProfile ? myBadgesError : userBadgesError;
  const rankingError = isMyProfile ? myRankingError : userRankingError;

  useEffect(() => {
    // memberId이 변경될 때마다 데이터 다시 조회
    if (isMyProfile) {
      refetchMyInfo();
      refetchMyPosts();
      refetchMyBadges();
      refetchMyRanking();
    } else {
      refetchUserInfo();
      refetchUserPosts();
      refetchUserBadges();
      refetchUserRanking();
    }
  }, [memberId, isMyProfile]);

  if (infoLoading || postsLoading || badgesLoading || rankingLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
      </div>
    );
  }

  if (
    infoError ||
    postsError ||
    rankingError
    // ||badgesError
  ) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          ⚠️ 프로필을 불러오는데 문제가 발생했습니다
        </div>
        <p className="text-gray-600 mb-4">잠시 후 다시 시도해주세요.</p>
        <button
          onClick={() => {
            if (isMyProfile) {
              refetchMyInfo();
              refetchMyPosts();
              refetchMyBadges();
              refetchMyRanking();
            } else {
              refetchUserInfo();
              refetchUserPosts();
              refetchUserBadges();
              refetchUserRanking();
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!myInfo) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">👤 프로필을 찾을 수 없습니다</div>
        <p className="text-gray-400">
          존재하지 않는 사용자이거나 접근 권한이 없습니다.
        </p>
      </div>
    );
  }

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "알 수 없음";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  return (
    <div className="space-y-8">
      {/* 프로필 헤더 */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={displayInfo?.profileImageUrl || "/placeholder.svg"}
                alt={displayInfo?.nickname || "사용자"}
              />
              <AvatarFallback>
                <User className="h-10 w-10 text-gray-500" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {displayInfo?.nickname || "사용자"}
              </h1>
              <p className="text-gray-600 mb-4">
                가입일: {formatJoinDate("2024-01-01")}{" "}
                {/* TODO: API에서 createdAt 추가 필요 */}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {displayPosts?.posts?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">게시글</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {displayInfo?.reactionCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">반응</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">북마크</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {displayInfo?.commentCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">댓글</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {displayBadges?.badges && displayBadges.badges.length > 0 ? (
                  displayBadges.badges
                    .filter((badge) => badge.isEarned)
                    .map((badge: MyBadgeSummary) => (
                      <Badge
                        key={badge.badgeId}
                        className="bg-yellow-100 text-yellow-800"
                      >
                        <span className="mr-1">🏆</span>
                        {badge.name}
                      </Badge>
                    ))
                ) : (
                  <div className="w-full text-center py-4">
                    <div className="text-gray-400 mb-2">🏆</div>
                    <p className="text-gray-500 text-sm">
                      아직 획득한 배지가 없습니다
                    </p>
                    <p className="text-gray-400 text-xs">
                      활동하여 첫 배지를 획득해보세요!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 카테리 순위 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>카테고리 순위</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayRanking?.rankings &&
              displayRanking.rankings.length > 0 ? (
                displayRanking.rankings.map(
                  (ranking: RankingSummary, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {displayRanking.category}
                        </h3>
                        <p className="text-sm text-gray-600">
                          순위 값: {ranking.categoryValue}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          #{ranking.rank}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ranking.rankChange}
                        </div>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">📊</div>
                  <p className="text-gray-500 mb-1">
                    아직 순위 정보가 없습니다
                  </p>
                  <p className="text-gray-400 text-sm">
                    게시글을 작성하여 랭킹에 참여해보세요!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 인기 게시글 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>인기 게시글</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayPosts?.posts && displayPosts.posts.length > 0 ? (
                displayPosts.posts
                  .slice(0, 3)
                  .map((post: MyPostSummary, index: number) => (
                    <div
                      key={post.postId}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge
                          className={
                            emotionColors[
                              (emotionTypeTranslation[post.emotionType] ||
                                post.emotionType) as keyof typeof emotionColors
                            ] || "bg-gray-100 text-gray-800"
                          }
                        >
                          {emotionTypeTranslation[post.emotionType] ||
                            post.emotionType}
                        </Badge>
                        <span className="text-sm font-bold text-gray-600">
                          #{index + 1}
                        </span>
                      </div>

                      <Link href={POST_ROUTES.DETAIL(post.postId)}>
                        <h3 className="font-medium text-gray-900 hover:text-gray-700 cursor-pointer mb-2">
                          {post.afterTitle || post.beforeTitle}
                        </h3>
                      </Link>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.reactionCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.commentCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Bookmark className="h-3 w-3" />
                          <span>0</span>
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">✍️</div>
                  <p className="text-gray-500 mb-1">
                    아직 작성한 게시글이 없습니다
                  </p>
                  <p className="text-gray-400 text-sm">
                    첫 번째 게시글을 작성해보세요!
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 순위 트렌드 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>순위 트렌드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              순위 트렌드 그래프가 여기에 표시됩니다
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
