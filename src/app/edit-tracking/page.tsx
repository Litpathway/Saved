import { AdminDashboard } from "@/components/admin-dashboard";
import { Header } from "@/components/header";
import { AdminStatus } from "@/components/admin-status";
import { adminAvailability } from "@/lib/admin-availability";
import { administrator } from "@/lib/auth";
import { localAdminEnabled } from "@/lib/local-development";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit tracking",
  robots: { index: false, follow: false },
};
export default async function Page() {
  if (!localAdminEnabled())
    return (
      <>
        <Header />
        <AdminDashboard role="Preview" trackingOnly preview />
      </>
    );
  const availability = await adminAvailability();
  if (availability.status !== "ready")
    return (
      <>
        <Header />
        <AdminStatus availability={availability} />
      </>
    );
  const user = await administrator();
  if (!user)
    return (
      <>
        <Header />
        <AdminStatus availability={{ status: "account-required" }} />
      </>
    );
  return (
    <>
      <Header />
      <AdminDashboard role="Local owner" trackingOnly localAccess />
    </>
  );
}
