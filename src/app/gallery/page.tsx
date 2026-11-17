import { db } from "@/lib/db";
import { Header } from "@/components/header";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Gallery",
  description: "Photos and videos from Savelanded's shipping operations.",
};

export default async function GalleryPage() {
  const items = await db.galleryItem.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <>
      <Header />
      <section className="page-intro content gallery-intro">
        <h1>Our work, in pictures.</h1>
        <p>Photos and videos shared by the Savelanded team.</p>
      </section>
      <section className="content gallery-section" aria-label="Photo and video gallery">
        {items.length ? (
          <div className="gallery-grid">
            {items.map((item) => (
              <figure className="gallery-item" key={item.id}>
                <div className="gallery-media">
                  {item.kind === "video" ? (
                    <video controls preload="metadata" playsInline aria-label={item.title} src={item.url} />
                  ) : (
                    // External Blob images retain their original dimensions and resolution.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.description || item.title} loading="lazy" />
                  )}
                </div>
                <figcaption>
                  <h2>{item.title}</h2>
                  {item.description && <p>{item.description}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="gallery-empty">
            <h2>Gallery coming soon.</h2>
            <p>Our team will share photos and videos here.</p>
          </div>
        )}
      </section>
    </>
  );
}
