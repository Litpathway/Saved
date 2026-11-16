import { redirect } from "next/navigation";
import { sessionAdmin } from "@/lib/auth";
import { Header } from "@/components/header";
import { FirstLoginPasswordForm } from "@/components/first-login-password-form";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Set administrator password",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const admin = await sessionAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.role !== "OWNER_PASSWORD_RESET") redirect("/admin");
  return (
    <>
      <Header />
      <FirstLoginPasswordForm />
    </>
  );
}
