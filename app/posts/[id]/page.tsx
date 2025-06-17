import { PostDetail } from "@/components/post-detail";
import { CommentsSection } from "@/components/comments-section";
import { RecommendedPosts } from "@/components/recommended-posts";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PostDetail postId={params.id} />
      <RecommendedPosts />
      <CommentsSection postId={params.id} />
    </div>
  );
}
