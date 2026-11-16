import { localAdminEnabled } from "@/lib/local-development";
import { adminAvailability } from "@/lib/admin-availability";
import { AdminStatus } from "@/components/admin-status";
import { redirect } from "next/navigation";
import { administrator, passwordChangeRequired } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Header } from "@/components/header";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit tracking",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const availability = await adminAvailability();
  if (availability.status !== "ready")
    return (
      <>
        <Header />
        <AdminStatus availability={availability} />
      </>
    );
  let user;
  let requiresChange = false;
  try {
    requiresChange = await passwordChangeRequired();
    user = await administrator();
  } catch {
    return (
      <>
        <Header />
        <AdminStatus availability={{ status: "unavailable" }} />
      </>
    );
  }
  if (requiresChange) redirect("/admin/change-password");
  if (!user) redirect("/admin/login?next=/edit-tracking");
  return (
    <>
      <Header />
      <AdminDashboard
        role={user.role}
        trackingOnly
        localAccess={localAdminEnabled()}
      />
    </>
  );
}
