import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminOnlyRoute } from "@/components/guards";

export default function AdminPage() {
  return (
    <AdminOnlyRoute>
      <AdminPanel />
    </AdminOnlyRoute>
  );
}
