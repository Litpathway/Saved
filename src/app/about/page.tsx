import Image from "next/image";
import { Header } from "@/components/header";
import { Eyebrow, ArrowLink } from "@/components/ui";
import { Offices } from "@/components/offices";
import { company } from "@/lib/company";
export const metadata = { title: "About us" };
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <Eyebrow>About Savelanded</Eyebrow>
        <h1>
          Connecting China.
          <br />
          Supporting Nigerian business.
        </h1>
        <p>
          {company.name} connects manufacturers in China with businesses across
          Nigeria.
        </p>
      </section>
      <section className="about-grid content">
        <div className="about-image">
          <Image
            src="/images/company/yiwu.jpg"
            alt="Savelanded Import and Export Company Limited office sign in Yiwu"
            fill
            sizes="(max-width:768px) 100vw, 600px"
          />
        </div>
        <div>
          <Eyebrow>From sourcing to shipping</Eyebrow>
          <h2>
            Trade with clarity.
            <br />
            Move with confidence.
          </h2>
          <p className="section-copy">
            Our work brings together sourcing, supplier verification, quality
            assurance, and logistics coordination. With offices in Yiwu,
            Guangzhou, and Lagos, we help customers discuss their requirements
            with a team on both sides of the journey.
          </p>
          <p className="section-copy">
            Professionalism, integrity, and clear communication guide our
            approach. Contact us to confirm service scope, pricing, and timing
            for your next shipment.
          </p>
          <ArrowLink href="/contact" dark>
            Talk to our team
          </ArrowLink>
        </div>
      </section>
      <Offices />
      <section className="content company-leadership">
        <Eyebrow>Our people</Eyebrow>
        <h2>Meet the team.</h2>
        <div className="office-grid">
          {company.contacts.slice(0, 3).map((c) => (
            <article key={c.name}>
              <span className="tiny">{c.role}</span>
              <h3>{c.name}</h3>
              <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
