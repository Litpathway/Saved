import { redirect } from "next/navigation";
import { administrator, passwordChangeRequired } from "@/lib/auth";
import { Header } from "@/components/header";
import { GalleryManager } from "@/components/gallery-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Manage gallery", robots: { index: false, follow: false } };

export default async function AdminGalleryPage() {
  if (await passwordChangeRequired()) redirect("/admin/change-password");
  if (!(await administrator())) redirect("/admin/login?next=/admin/gallery");
  return <><Header /><GalleryManager /></>;
}
