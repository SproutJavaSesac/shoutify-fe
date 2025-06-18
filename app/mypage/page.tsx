import { MyPageTabs } from "@/components/mypage-tabs"
import { ProtectedRoute } from "@/components/protected-route"

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MyPageTabs />
      </div>
    </ProtectedRoute>
  )
}
