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
          About Savelanded.
          <br />
          China–Nigeria shipping.
        </h1>
        <p>
          {company.name} provides sea and air freight from China to Nigeria.
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
          <Eyebrow>Sea & air freight</Eyebrow>
          <h2>
            Import and export.
            <br />
            Sea and air freight.
          </h2>
          <p className="section-copy">
            We ship cargo from China to Nigeria by sea and air. Our offices in
            Yiwu, Guangzhou, and Lagos handle shipping enquiries and help
            customers arrange their shipments.
          </p>
          <p className="section-copy">
            Send us the cargo description, weight, and destination for a
            quotation. Our team will confirm pricing, documents, and shipping
            arrangements before you book.
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
