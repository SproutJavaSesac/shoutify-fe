import { RankingTabs } from "@/components/ranking-tabs";

export default function RankingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">전체 랭킹</h1>
        <p className="text-gray-600">
          매일 00:10에 전날 활동을 기반으로 업데이트됩니다.
        </p>
      </div>
      <RankingTabs />
    </div>
  );
}
