import { ProfileEditForm } from "@/components/profile-edit-form"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your profile information and account settings</p>
        </div>

        <ProfileEditForm />
      </div>
    </ProtectedRoute>
  )
}
