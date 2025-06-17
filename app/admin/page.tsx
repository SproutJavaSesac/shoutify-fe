import { AdminPanel } from "@/components/admin-panel"

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage reported content, users, and AI prompting rules</p>
      </div>

      <AdminPanel />
    </div>
  )
}
