import { SiteHeader } from "@/components/site-header";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-pad pt-0">
        <AdminDashboard />
      </main>
    </>
  );
}
