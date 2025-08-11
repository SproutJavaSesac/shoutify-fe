import { ProfileEditForm } from "@/components/profile-edit-form";
import { ProtectedRoute } from "@/components/protected-route";

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프로필 수정</h1>
          <p className="text-gray-600">
            프로필 정보와 계정 설정을 업데이트하세요
          </p>
        </div>

        <ProfileEditForm />
      </div>
    </ProtectedRoute>
  );
}
