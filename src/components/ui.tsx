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
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Savelanded Company home">
      <Image
        className="brand-art"
        src="/images/company/brand.png"
        alt=""
        width={63}
        height={42}
      />
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
