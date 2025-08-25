import { AuthRequiredRoute } from "@/components/guards";
import { MyPageContent } from "@/components/mypage/mypage-content";

export default function MyPage() {
  return (
    <AuthRequiredRoute>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
          <p className="text-gray-600">
            내가 작성한 글과 댓글을 관리할 수 있습니다.
          </p>
        </div>
        <MyPageContent />
      </div>
    </AuthRequiredRoute>
  );
}
