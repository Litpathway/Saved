import Link from "next/link";
import { Brand } from "./ui";
export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Brand />
          <p>
            Shipping made clearer.
            <br />
            Every step of the way.
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
          <h3>Let’s talk logistics.</h3>
          <p>
            Have cargo in mind?
            <br />
            Start with a conversation.
          </p>
          <Link className="text-link" href="/contact">
            Get in touch ↗
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Savelanded Company</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms of use</Link>
        </div>
      </div>
    </footer>
  );
}
