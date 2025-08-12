import { AuthRequiredRoute } from "@/components/guards";
import { MyPageTabs } from "@/components/mypage-tabs";

export default function MyPage() {
  return (
    <AuthRequiredRoute>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MyPageTabs />
      </div>
    </AuthRequiredRoute>
  );
}
