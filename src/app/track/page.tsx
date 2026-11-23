import { Suspense } from "react";
import { ReferenceHeader } from "@/components/reference-header";
import { Tracker } from "@/components/tracker";

export const metadata = {
  title: "Track your shipment",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <div className="reference-home rh-subpage rh-track-page">
    <ReferenceHeader />
    <section className="rh-subhero"><div className="rh-wrap"><h1>Track your cargo</h1><p>Enter your Yiwu or Guangzhou manifest number to see the latest recorded shipment updates. Older tracking numbers also work.</p></div></section>
    <section className="rh-section rh-pale"><div className="rh-wrap"><Suspense fallback={<p>Loading tracking…</p>}><Tracker /></Suspense></div></section>
  </div>;
}
