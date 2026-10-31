import { Suspense } from "react";
import { Header } from "@/components/header";
import { Eyebrow } from "@/components/ui";
import { Tracker } from "@/components/tracker";
export const metadata = {
  title: "Track your shipment",
  robots: { index: false, follow: true },
};
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <Eyebrow>Shipment tracking</Eyebrow>
        <h1>
          Track your shipment.
          <br />
          Enter your tracking number.
        </h1>
        <p>Find your latest recorded shipment update and follow its journey.</p>
      </section>
      <section className="content tracker-section">
        <Suspense fallback={<p>Loading tracking…</p>}>
          <Tracker />
        </Suspense>
      </section>
    </>
  );
}
