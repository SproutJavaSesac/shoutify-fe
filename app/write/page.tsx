import { PostCreationForm } from "@/components/post-creation-form";
import { ProtectedRoute } from "@/components/protected-route";

export default function WritePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600">
            Share your thoughts and let AI transform them into literary art
          </p>
        </div>

        <PostCreationForm />
      </div>
    </ProtectedRoute>
  );
}
