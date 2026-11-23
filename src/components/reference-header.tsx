"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Box, Menu, X } from "lucide-react";

export function ReferenceHeader() {
  const [menu, setMenu] = useState(false);
  return <><div className="rh-top"><div className="rh-wrap">● &nbsp; DIRECT CHINA–NIGERIA CORRIDOR: YIWU • GUANGZHOU • LAGOS <span>SEA & AIR FREIGHT ENQUIRIES</span></div></div>
    <header className="rh-header"><div className="rh-wrap rh-nav">
      <Link href="/" className="rh-brand"><span className="rh-logo"><Box size={21}/></span><span>SAVELANDED<small>IMPORT & EXPORT CO. LTD</small></span></Link>
      <button className="rh-menu" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      <nav className={menu ? "rh-links is-open" : "rh-links"} aria-label="Main navigation">
        <Link href="/" onClick={() => setMenu(false)}>Home</Link><Link href="/about" onClick={() => setMenu(false)}>About Us</Link><Link href="/shipping" onClick={() => setMenu(false)}>Services</Link><Link href="/quote" onClick={() => setMenu(false)}>CBM Calculator <b>TOOL</b></Link><Link href="/contact" onClick={() => setMenu(false)}>Contact & Offices</Link><Link href="/track" onClick={() => setMenu(false)}>Track Cargo</Link>
      </nav><Link className="rh-button rh-nav-cta" href="/quote">Request a Quote <ArrowRight size={16}/></Link>
    </div></header></>;
}
