import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/shipping",
    "/quote",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({ url: "https://www.savelandedcompany.com" + path }));
}
