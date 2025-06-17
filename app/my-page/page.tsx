import { MyPageTabs } from "@/components/my-page-tabs"
import { ProtectedRoute } from "@/components/protected-route"

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Page</h1>
          <p className="text-gray-600">Manage your posts, comments, bookmarks, and achievements</p>
        </div>

        <MyPageTabs />
      </div>
    </ProtectedRoute>
  )
}
