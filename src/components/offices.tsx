import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { company } from "@/lib/company";
const officePhotos = {
  Yiwu: { src: "/images/company/yiwu.jpg", alt: "Savelanded office sign in Yiwu", caption: "Yiwu office" },
  Guangzhou: { src: "/images/company/guangzhou.jpg", alt: "Savelanded cargo handling", caption: "Company cargo operations" },
  Lagos: { src: "/images/company/lagos.jpg", alt: "Savelanded cargo loading", caption: "Company loading operations" },
} as const;

export function Offices({ withImages = false }: { withImages?: boolean }) {
  return (
    <section className="offices content" id="offices">
      <h2>
        China to Nigeria.
        <br />
        Yiwu, Guangzhou & Lagos.
      </h2>
      <div className="office-grid">
        {company.offices.map((o) => (
          <article key={o.city} className={withImages ? "office-with-image" : undefined}>
            {withImages && (
              <div className="office-photo">
                <Image
                  src={officePhotos[o.city as keyof typeof officePhotos].src}
                  alt={officePhotos[o.city as keyof typeof officePhotos].alt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 33vw, 370px"
                />
                <span className="office-photo-caption">
                  {officePhotos[o.city as keyof typeof officePhotos].caption}
                </span>
              </div>
            )}
            <div className="office-card-body">
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
            </div>
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
