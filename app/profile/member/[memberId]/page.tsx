import { UserProfile } from "@/components/user-profile";
import { IdType } from "@/types/apis";

interface PublicProfilePageProps {
  params: Promise<{ id: IdType }>; // Next.js 15에서 params는 Promise
}

export default async function PostDetailPage({
  params,
}: PublicProfilePageProps) {
  const { id } = await params; // params를 await해서 사용

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserProfile memberId={id} />
    </div>
  );
}
