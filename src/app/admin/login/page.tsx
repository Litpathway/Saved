import { adminAvailability } from "@/lib/admin-availability";
import { AdminStatus } from "@/components/admin-status";
import { Header } from "@/components/header";
import { AdminLogin } from "@/components/admin-login";
export const metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function Page() {
  const availability = await adminAvailability();
  return (
    <>
      <Header />
      {availability.status === "ready" ? (
        <AdminLogin />
      ) : (
        <AdminStatus availability={availability} />
      )}
    </>
  );
}
