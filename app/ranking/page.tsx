import { RankingTabs } from "@/components/ranking-tabs"

export default function RankingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Rankings</h1>
        <p className="text-gray-600">Updated daily at 00:10 based on previous day's activity</p>
      </div>

      <RankingTabs />
    </div>
  )
}
