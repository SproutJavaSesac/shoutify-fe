import { AdminProtectedRoute } from "@/components/admin-protected-route";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminPanel />
    </AdminProtectedRoute>
  );
}
