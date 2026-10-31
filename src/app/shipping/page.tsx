import { Ship, Plane, Truck, TrainFront } from "lucide-react";
import { Header } from "@/components/header";
import Image from "next/image";
import { Eyebrow, ArrowLink } from "@/components/ui";
export const metadata = { title: "Shipping information" };
const methods = [
  {
    name: "Sea",
    icon: Ship,
    text: "Share the volume, packaging, and nature of your cargo. Ask our team about options for your origin and destination.",
    details:
      "Useful details: number of cartons or pallets, total volume, weight, and any handling requirements.",
  },
  {
    name: "Air",
    icon: Plane,
    text: "If timing is a priority, share your preferred dates and cargo requirements so our team can assess the options.",
    details:
      "Useful details: cargo dimensions, total weight, contents, and any batteries or restricted materials.",
  },
  {
    name: "Road",
    icon: Truck,
    text: "Tell us where the shipment needs to be collected or delivered. Our team can confirm the applicable arrangements.",
    details:
      "Useful details: collection and delivery areas, vehicle access, cargo weight, and unloading requirements.",
  },
  {
    name: "Rail",
    icon: TrainFront,
    text: "Ask whether rail is suitable and available for the route you are considering.",
    details:
      "Useful details: origin and destination, shipment size, cargo type, and preferred timing.",
  },
];
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <Eyebrow>Shipping information</Eyebrow>
        <h1>
          China to Nigeria.
          <br />
          From sourcing to shipping.
        </h1>
        <p>
          We support sourcing, supplier verification, quality assurance, and
          logistics coordination for businesses importing from China to Nigeria.
          Confirm the transport method and service scope for your cargo.
        </p>
      </section>
      <section className="about-grid content" id="sourcing">
        <div className="about-image">
          <Image
            src="/images/company/shipping.webp"
            alt="Yiwu International Trade Market, as pictured on Savelanded’s website"
            fill
            sizes="(max-width:768px) 100vw, 600px"
          />
        </div>
        <div>
          <Eyebrow>Sourcing support</Eyebrow>
          <h2>Find your next opportunity.</h2>
          <p className="section-copy">
            Discuss sourcing in Yiwu and Guangzhou with our team. Our website
            highlights toys and gifts, electronics, jewellery and fashion
            accessories, homeware, stationery, packaging, and promotional
            products.
          </p>
          <p className="section-copy">
            Guangzhou sourcing information covers Baima, Shisanhang, and Zhongda
            fabric markets. These are sourcing destinations, not claimed
            business partnerships.
          </p>
          <ArrowLink href="/contact" dark>
            Discuss your requirements
          </ArrowLink>
        </div>
      </section>
      <section className="method-grid content">
        <article id="supplier-verification">
          <h2>Supplier verification & quality assurance</h2>
          <p>
            Discuss the supplier and product checks you need before arranging an
            order. We will confirm the scope and any requirements for your
            goods.
          </p>
          <ArrowLink href="/quote" dark>
            Discuss product requirements
          </ArrowLink>
        </article>
        <article id="logistics">
          <h2>China–Nigeria logistics coordination</h2>
          <p>
            Our team supports shipping from China to Nigeria, with offices in
            Yiwu, Guangzhou, and Lagos. Contact us to confirm the method,
            collection arrangements, documentation, and pricing for your
            shipment.
          </p>
          <ArrowLink href="/quote" dark>
            Request a shipping quote
          </ArrowLink>
        </article>
      </section>
      <section
        className="method-grid content"
        aria-label="Transport methods to discuss"
      >
        {methods.map((m) => (
          <article key={m.name} id={m.name.toLowerCase()}>
            <m.icon size={38} strokeWidth={1.3} />
            <h2>{m.name} freight</h2>
            <p>{m.text}</p>
            <p className="small">{m.details}</p>
            <ArrowLink href="/quote" dark>
              Discuss {m.name.toLowerCase()} shipping
            </ArrowLink>
          </article>
        ))}
      </section>
    </>
  );
}
