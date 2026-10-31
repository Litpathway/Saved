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
  const user = await administrator();
  if (!user) redirect("/admin/login");
  return (
    <>
      <Header />
      <AdminDashboard role={user.role} />
    </>
  );
}
