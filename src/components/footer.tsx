import Link from "next/link";
import { company } from "@/lib/company";
import { Brand } from "./ui";
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Brand />
          <p>
            China to Nigeria.
            <br />
            Sourcing. Shipping. Support.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/track">Track shipment</Link>
          <Link href="/quote">Request a quote</Link>
          <Link href="/shipping">Shipping information</Link>
        </div>
        <div>
          <h3>Company</h3>
          <Link href="/about">About Savelanded</Link>
          <Link href="/contact">Contact our team</Link>
          <Link href="/admin">Administrator portal</Link>
        </div>
        <div>
          <h3>Contact our team</h3>
          <a className="contact-email" href={`mailto:${company.email}`}>
            {company.email}
          </a>
          <a href="tel:+8618248547224">Wolex: +86 182 4854 7224</a>
          <a href={company.whatsapp}>WhatsApp ↗</a>
          <a href={company.facebook} target="_blank" rel="noreferrer">
            Facebook ↗
          </a>
          <a href={company.instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {company.name}
        </span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms of use</Link>
        </div>
      </div>
    </footer>
  );
}
