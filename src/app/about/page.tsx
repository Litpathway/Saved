import Image from "next/image";
import { Header } from "@/components/header";
import { Eyebrow, ArrowLink } from "@/components/ui";
export const metadata = { title: "About us" };
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <Eyebrow>About Savelanded</Eyebrow>
        <h1>
          Behind every shipment,
          <br />a conversation.
        </h1>
        <p>
          Savelanded Company’s online home for shipping enquiries, shipment
          updates, and customer support.
        </p>
      </section>
      <section className="about-grid content">
        <div className="about-image">
          <Image
            src="/images/hero.webp"
            alt="Illustrative freight port with cargo truck and shipping containers"
            fill
            sizes="(max-width:768px) 100vw, 600px"
          />
        </div>
        <div>
          <Eyebrow>Our approach</Eyebrow>
          <h2>
            Make the next step
            <br />a clear one.
          </h2>
          <p className="section-copy">
            Use this platform to share shipping requirements with our team,
            follow recorded shipment milestones, and ask for assistance when you
            need it.
          </p>
          <p className="section-copy">
            Every request starts with your cargo and destination. Our team must
            confirm route availability, service scope, pricing, and timing
            before a booking.
          </p>
          <ArrowLink href="/contact" dark>
            Meet us in a conversation
          </ArrowLink>
        </div>
      </section>
    </>
  );
}
