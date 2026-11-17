import { Suspense } from "react";
import { Header } from "@/components/header";
import { Tracker } from "@/components/tracker";
export const metadata = {
  title: "Track your shipment",
  robots: { index: false, follow: true },
};
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro tracking-intro content">
        <h1>Track your shipment.</h1>
        <p>
          Enter your Yiwu or Guangzhou manifest number to see the container timeline. Older tracking numbers also work.
        </p>
      </section>
      <section className="content tracker-section">
        <Suspense fallback={<p>Loading tracking…</p>}>
          <Tracker />
        </Suspense>
      </section>
    </>
  );
}
