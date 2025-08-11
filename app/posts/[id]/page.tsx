import { PostDetail } from "@/components/posts/post-detail";
import { CommentsSection } from "@/components/comments/comments-section";

interface PostDetailPageProps {
  params: Promise<{ id: string }>; // Next.js 15에서 params는 Promise
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params; // params를 await해서 사용

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <PostDetail postId={id} />
        <CommentsSection postId={id} />
      </div>
    </main>
  );
}
