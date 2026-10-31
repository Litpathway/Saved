import { adminAvailability } from "@/lib/admin-availability";
import { AdminStatus } from "@/components/admin-status";
import { redirect } from "next/navigation";
import { administrator } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Header } from "@/components/header";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Administration",
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
  try {
    user = await administrator();
  } catch {
    return (
      <>
        <Header />
        <AdminStatus availability={{ status: "unavailable" }} />
      </>
    );
  }
  if (!user) redirect("/admin/login");
  return (
    <>
      <Header />
      <AdminDashboard role={user.role} />
    </>
  );
}
