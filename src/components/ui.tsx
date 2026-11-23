import Link from "next/link";
import { ArrowUpRight, Box } from "lucide-react";
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
    <Link href="/" className="brand">
      <span className="brand-art brand-mark"><Box size={24} aria-hidden="true" /></span>
      <span>
        Savelanded
        <span className="brand-sub">IMPORT & EXPORT COMPANY LIMITED</span>
      </span>
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}
