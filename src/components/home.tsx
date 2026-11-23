"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plane, Ship } from "lucide-react";
import { ReferenceHeader } from "./reference-header";

const steps = [
  ["Tell us what you are shipping", "Share the cargo, origin, destination, weight, and dimensions."],
  ["Review the quotation", "We confirm the route, scope, documents, and cost before you book."],
  ["Arrange dispatch", "Agree on the shipping details and hand over the cargo."],
  ["Follow the shipment", "Use the tracking number we provide to see recorded updates."],
] as const;

export function Home() {
  const [dimensions, setDimensions] = useState(["", "", "", "1"]);
  const values = dimensions.map(Number);
  const cbm = values.every((n) => Number.isFinite(n) && n > 0) ? values.reduce((a, b) => a * b, 1) / 1_000_000 : 0;

  return <div className="reference-home">
    <ReferenceHeader />
    <section className="rh-hero"><div className="rh-wrap rh-hero-grid"><div>
      <h1>Ship from China to Nigeria with people on the ground in both countries.</h1>
      <p>Sea and air freight, with offices in Yiwu, Guangzhou, and Lagos. Tell us about your cargo and we’ll help you plan the next move.</p>
      <div className="rh-actions"><Link className="rh-button" href="/quote">Request a quote <ArrowRight size={17}/></Link><Link className="rh-button rh-outline" href="/shipping">See shipping options</Link></div>
      <div className="rh-hero-foot">Yiwu <span>·</span> Guangzhou <span>·</span> Lagos</div>
    </div><figure className="rh-hero-photo"><Image src="/images/company/warehouse.jpg" alt="Savelanded cargo being loaded at a China warehouse" fill priority sizes="(max-width:760px) 100vw, 40vw"/><figcaption>At work in China</figcaption></figure></div></section>

    <section className="rh-section rh-about"><div className="rh-wrap rh-two"><div><h2>Talk to an office that knows your route.</h2><p>Our teams in China and Nigeria can discuss the cargo, paperwork, shipping method, and delivery arrangements with you.</p><div className="rh-actions"><Link className="rh-button rh-dark" href="/contact">Contact an office <ArrowRight size={16}/></Link><Link className="rh-button rh-light" href="/about">About Savelanded</Link></div></div><div className="rh-office-grid"><article><small>CHINA</small><h3>Yiwu</h3><p>Shipping enquiries and cargo coordination.</p></article><article><small>SOUTH CHINA</small><h3>Guangzhou</h3><p>Cargo and dispatch enquiries.</p></article><article><small>NIGERIA</small><h3>Lagos</h3><p>Shipment updates and delivery questions.</p></article></div></div></section>

    <section className="rh-section rh-pale" id="services"><div className="rh-wrap"><div className="rh-centered"><h2>Air or sea? Start with your cargo.</h2><p>Send us the details. We’ll confirm the available route, timing, and rate.</p></div><div className="rh-two rh-modes"><article><Plane size={26} aria-hidden="true"/><h3>Air freight</h3><p>For cargo where timing matters. Share the contents, weight, dimensions, and the date you need it.</p><Link href="/quote">Ask about air freight <ArrowRight size={16}/></Link></article><article><Ship size={26} aria-hidden="true"/><h3>Sea freight</h3><p>For larger shipments. Share the carton count or volume, weight, and final destination.</p><Link href="/quote">Ask about sea freight <ArrowRight size={16}/></Link></article></div><div className="rh-center-action"><Link className="rh-button rh-dark" href="/shipping">Shipping details <ArrowRight size={16}/></Link></div></div></section>

    <section className="rh-section"><div className="rh-wrap"><div className="rh-section-head"><h2>From enquiry to delivery</h2><Link className="rh-button" href="/quote">Start with a quote <ArrowRight size={16}/></Link></div><div className="rh-four rh-process">{steps.map(([title,copy],i)=><article key={title}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="rh-section rh-pale" id="calculator"><div className="rh-wrap"><div className="rh-calculator"><div><h2>Know your cargo volume?</h2><p>Enter the dimensions of one piece in centimetres and the total number of pieces. We’ll use this estimate when discussing sea freight.</p><Link href="/quote">Open the full CBM calculator <ArrowRight size={15}/></Link></div><div className="rh-fields">{["Length","Width","Height","Pieces"].map((label,i)=><label key={label}>{label}<input type="number" min="0.01" step="any" inputMode="decimal" value={dimensions[i]} onChange={(e)=>setDimensions(dimensions.map((value,j)=>j===i?e.target.value:value))}/></label>)}<output aria-live="polite"><strong>{cbm.toFixed(3)} m³</strong><span>Total CBM</span></output></div></div></div></section>

    <section className="rh-section rh-closing"><div className="rh-wrap"><h2>Have the cargo details?</h2><p>Send them to us for a reviewed shipping quote.</p><Link className="rh-button" href="/quote">Request a quote <ArrowRight size={16}/></Link></div></section>
  </div>;
}
