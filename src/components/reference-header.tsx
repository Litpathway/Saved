"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Box, Menu, X } from "lucide-react";

export function ReferenceHeader() {
  const [menu, setMenu] = useState(false);
  return <><div className="rh-top"><div className="rh-wrap">China to Nigeria shipping <span>Yiwu · Guangzhou · Lagos</span></div></div>
    <header className="rh-header"><div className="rh-wrap rh-nav">
      <Link href="/" className="rh-brand"><span className="rh-logo"><Box size={21}/></span><span>SAVELANDED<small>IMPORT & EXPORT CO. LTD</small></span></Link>
      <button className="rh-menu" aria-label={menu ? "Close menu" : "Open menu"} aria-controls="rh-main-nav" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      <nav id="rh-main-nav" className={menu ? "rh-links is-open" : "rh-links"} aria-label="Main navigation">
        <Link href="/" onClick={() => setMenu(false)}>Home</Link><Link href="/about" onClick={() => setMenu(false)}>About</Link><Link href="/shipping" onClick={() => setMenu(false)}>Shipping</Link><Link href="/quote" onClick={() => setMenu(false)}>CBM calculator</Link><Link href="/contact" onClick={() => setMenu(false)}>Contact</Link><Link href="/track" onClick={() => setMenu(false)}>Track cargo</Link>
      </nav><Link className="rh-button rh-nav-cta" href="/quote">Request a quote <ArrowRight size={16}/></Link>
    </div></header></>;
}
