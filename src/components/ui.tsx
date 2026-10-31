import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";
export function ArrowLink({
  href,
  children,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <Link className={`pill ${dark ? "pill-dark" : ""}`} href={href}>
      {children}
      <ArrowUpRight size={19} />
    </Link>
  );
}
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Savelanded Company home">
      <span className="brand-icon">
        <Globe2 size={30} />
      </span>
      <span>
        Savelanded
        <span className="brand-sub">COMPANY · SHIPPING & LOGISTICS</span>
      </span>
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}
