import { PostCreationForm } from "@/components/posts/post-creation-form";
import { ProtectedRoute } from "@/components/protected-route";

export default function WritePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            새 글 작성하기
          </h1>
          <p className="text-gray-600">
            당신의 생각을 공유하고, AI를 이용해 문학적인 작품으로 변화시켜
            보세요.
          </p>
        </div>

        <PostCreationForm />
      </div>
    </ProtectedRoute>
  );
}
