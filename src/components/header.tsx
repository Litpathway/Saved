"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Brand, ArrowLink } from "./ui";
export function Header({ hero = false }: { hero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState(false);
  return (
    <header className={`header ${hero ? "header-hero" : ""}`}>
      <Brand />
      <nav aria-label="Main navigation" className={open ? "nav open" : "nav"}>
        <div className="nav-dropdown">
          <button
            aria-expanded={services}
            onClick={() => setServices(!services)}
          >
            Shipping <ChevronDown size={13} />
          </button>
          {services && (
            <div className="dropdown">
              <Link href="/shipping" onClick={() => setServices(false)}>
                Explore shipping options
              </Link>
              <Link href="/track">Track a shipment</Link>
              <Link href="/quote">Request a quotation</Link>
            </div>
          )}
        </div>
        <Link href="/about">About us</Link>
        <Link href="/#process">Our process</Link>
        <Link href="/#faq">FAQs</Link>
        <Link href="/contact">Contact</Link>
      </nav>
      <div className="header-cta">
        <ArrowLink href="/quote">Get a quote</ArrowLink>
      </div>
      <button
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
