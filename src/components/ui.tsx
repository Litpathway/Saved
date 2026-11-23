import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
export function LogoImage({ large = false }: { large?: boolean }) {
  return <span className={large ? "site-logo-mark is-large" : "site-logo-mark"}>
    <Image src="/images/company/logo-straightened.png" alt={large ? "Savelanded Import and Export Company Limited" : ""} width={large ? 300 : 80} height={large ? 273 : 73} />
  </span>;
}
export function Brand({ large = false }: { large?: boolean }) {
  return (
    <Link href="/" className={large ? "brand brand-large" : "brand"}>
      <LogoImage large={large} />
      {!large && <span>
        Savelanded
        <span className="brand-sub">IMPORT & EXPORT COMPANY LIMITED</span>
      </span>}
    </Link>
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}
