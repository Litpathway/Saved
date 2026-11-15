import { redirect } from "next/navigation";
import { localAdminEnabled } from "@/lib/local-development";
import { adminAvailability } from "@/lib/admin-availability";
import { AdminStatus } from "@/components/admin-status";
import { Header } from "@/components/header";
import { AdminLogin } from "@/components/admin-login";
export const metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (localAdminEnabled()) redirect("/edit-tracking");
  const destination =
    (await searchParams).next === "/edit-tracking"
      ? "/edit-tracking"
      : "/admin";
  const availability = await adminAvailability();
  return (
    <>
      <Header />
      {availability.status === "ready" ? (
        <AdminLogin destination={destination} />
      ) : (
        <AdminStatus availability={availability} />
      )}
    </>
  );
}
