import { Header } from "@/components/header";
import { AdminLogin } from "@/components/admin-login";
export const metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <Header />
      <AdminLogin />
    </>
  );
}
