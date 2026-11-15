import Image from "next/image";
import { Ship, Plane } from "lucide-react";
import { Header } from "@/components/header";
import { ArrowLink } from "@/components/ui";
export const metadata = { title: "Sea and air freight" };
const methods = [
  {
    name: "Sea",
    icon: Ship,
    image: "/images/company/warehouse.jpg",
    alt: "Cargo loading photo published by Savelanded",
    text: "Sea freight from China to Nigeria. Send us your cargo weight, volume, and packaging details for a quotation.",
    details:
      "Include the number of cartons or pallets, total weight, and dimensions.",
  },
  {
    name: "Air",
    icon: Plane,
    image: "/images/company/guangzhou.jpg",
    alt: "Cargo handling photo published by Savelanded",
    text: "Air freight from China to Nigeria. Contact our team with your cargo details and preferred shipping date for a quotation.",
    details:
      "Include the contents, dimensions, total weight, and any batteries or restricted materials.",
  },
];
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <h1>
          China to Nigeria.
          <br />
          Sea and air freight.
        </h1>
        <p>
          Contact our offices in Yiwu, Guangzhou, or Lagos for freight rates and
          shipping arrangements.
        </p>
      </section>
      <section className="method-grid content" aria-label="Freight services">
        {methods.map((m) => (
          <article key={m.name} id={m.name.toLowerCase()}>
            <div
              className={`freight-photo freight-photo-${m.name.toLowerCase()}`}
            >
              <Image
                src={m.image}
                alt={m.alt}
                fill
                sizes="(max-width: 767px) 100vw, 580px"
              />
            </div>
            <div className="freight-details">
              <h2>
                <m.icon size={28} strokeWidth={1.5} aria-hidden="true" />
                {m.name} freight
              </h2>
              <p>{m.text}</p>
              <p className="small">{m.details}</p>
              <ArrowLink href="/quote" dark>
                Request a {m.name.toLowerCase()} freight quote
              </ArrowLink>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
