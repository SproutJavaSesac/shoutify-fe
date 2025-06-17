import { UserProfile } from "@/components/user-profile"

export default function ProfilePage({ params }: { params: { username: string } }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserProfile username={params.username} />
    </div>
  )
}
