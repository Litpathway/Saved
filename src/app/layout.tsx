import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Chat } from "@/components/chat";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.savelandedcompany.com"),
  title: {
    default: "Savelanded Company | Shipping, made clearer",
    template: "%s | Savelanded Company",
  },
  description:
    "Request a shipping quote, follow recorded shipment updates, and connect with Savelanded Company.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Savelanded Company",
    description: "Shipping, made clearer. Every step of the way.",
    images: ["/images/hero.webp"],
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
