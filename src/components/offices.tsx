import { ArrowUpRight } from "lucide-react";
import { company } from "@/lib/company";
import { Eyebrow } from "./ui";
export function Offices() {
  return (
    <section className="offices content" id="offices">
      <Eyebrow>Close to your next move</Eyebrow>
      <h2>
        China to Nigeria.
        <br />
        People on both sides.
      </h2>
      <div className="office-grid">
        {company.offices.map((o) => (
          <article key={o.city}>
            <span className="tiny">{o.label}</span>
            <h3>{o.city}</h3>
            <p>{o.address}</p>
            <a
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(o.address)
              }
              target="_blank"
              rel="noreferrer"
            >
              Find directions <ArrowUpRight size={16} />
            </a>
          </article>
        ))}
      </div>
      <p className="form-note">
        Please confirm office hours and directions with our team before
        visiting.
      </p>
    </section>
  );
}
