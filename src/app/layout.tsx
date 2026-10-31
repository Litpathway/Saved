import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Chat } from "@/components/chat";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.savelandedcompany.com"),
  title: {
    default: "Savelanded Company | China–Nigeria Sea & Air Freight",
    template: "%s | Savelanded Company",
  },
  description:
    "Sea and air freight from China to Nigeria. Contact Savelanded in Yiwu, Guangzhou, and Lagos.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Savelanded Company",
    description: "China–Nigeria Sea & Air Freight. ",
    images: ["/images/company/warehouse.jpg"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <main id="main">{children}</main>
        <Footer />
        <Chat />
      </body>
    </html>
  );
}
