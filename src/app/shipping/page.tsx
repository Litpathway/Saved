import { Ship, Plane, Truck, TrainFront } from "lucide-react";
import { Header } from "@/components/header";
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
          Find the right fit
          <br />
          for your cargo.
        </h1>
        <p>
          These are shipping methods you can ask us about. Availability and
          service scope must be confirmed for your request.
        </p>
      </section>
      <section className="method-grid content">
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
