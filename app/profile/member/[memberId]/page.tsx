import { UserProfile } from "@/components/user-profile";

interface PublicProfilePageProps {
  params: Promise<{ memberId: string }>; // memberId로 수정
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { memberId } = await params; // memberId로 수정

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserProfile memberId={memberId} />
    </div>
  );
}
