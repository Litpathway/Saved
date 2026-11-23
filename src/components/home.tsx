"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Globe2, MessageCircle, Plane, ShieldCheck, Ship } from "lucide-react";
import { ReferenceHeader } from "./reference-header";

const services = [
  ["Air freight from China to Nigeria", "Air", "Ship time-sensitive cargo by air. Contact our team for available routes, timing, and a reviewed rate."],
  ["Sea freight from China to Nigeria", "Sea", "Move larger shipments by sea. Share your cargo volume and destination to discuss available options."],
  ["Shipment planning", "Plan", "Confirm the shipping method, documents, scope, and costs with our team before booking."],
  ["Cargo updates", "Track", "Follow the latest recorded milestones with the tracking number supplied by our team."],
] as const;
const steps = [
  ["Share your requirements", "Tell us your cargo, origin, destination, weight, and dimensions."],
  ["Review your options", "Our team confirms the available method, scope, and quotation."],
  ["Arrange dispatch", "Confirm the shipping details and required documents before handover."],
  ["Follow your shipment", "Use your tracking number to view recorded shipment updates."],
  ["Complete delivery", "Contact our team for the final update and delivery arrangements."],
] as const;

export function Home() {
  const [dimensions, setDimensions] = useState(["", "", "", "1"]);
  const values = dimensions.map(Number);
  const cbm = values.every((n) => Number.isFinite(n) && n > 0) ? values.reduce((a, b) => a * b, 1) / 1_000_000 : 0;
  return <div className="reference-home">
    <ReferenceHeader />

    <section className="rh-hero"><div className="rh-wrap rh-hero-grid"><div>
      <span className="rh-hero-tag">● &nbsp; CHINA • NIGERIA • INTERNATIONAL TRADE</span>
      <h1>Connecting China to Nigeria. <em>Simplifying Global Trade.</em></h1>
      <p>Sea and air freight from China to Nigeria, supported by our offices in Yiwu, Guangzhou, and Lagos.</p>
      <div className="rh-actions"><Link className="rh-button" href="/quote">Request a Quote <ArrowRight size={17}/></Link><Link className="rh-button rh-outline" href="#services">Explore Services</Link></div>
      <div className="rh-hero-foot">YIWU • GUANGZHOU • LAGOS <span>│</span> PLAN • SHIP • TRACK</div>
    </div><aside className="rh-dispatch"><div className="rh-dispatch-head"><div><small>ACTIVE TRADE CORRIDOR</small><h2>Direct Shipping Options</h2></div><span>Enquiries open</span></div>
      <div className="rh-route"><small>AIR FREIGHT</small><strong>China → Nigeria</strong><p>Ask our team about available air shipping options.</p></div>
      <div className="rh-route"><small>SEA FREIGHT</small><strong>China → Nigeria</strong><p>Discuss shipment volume, destination, and sea freight arrangements.</p></div>
      <Link href="#calculator">Calculate your cargo volume <ArrowRight size={14}/></Link>
    </aside></div></section>

    <section className="rh-benefits"><div className="rh-wrap rh-four">
      {[[ShieldCheck,"China–Nigeria focus","Sea and air freight enquiries for cargo moving from China to Nigeria."],[ClipboardCheck,"Reviewed quotations","Our team confirms methods, scope, availability, and costs for each request."],[Globe2,"Three office locations","Speak to our offices in Yiwu, Guangzhou, or Lagos."],[MessageCircle,"Shipment support","Get help with a quote, shipping question, or recorded cargo update."]].map(([Icon,title,copy]) => <article key={title as string}><span className="rh-icon"><Icon size={20}/></span><h3>{title as string}</h3><p>{copy as string}</p></article>)}
    </div></section>

    <section className="rh-section rh-about"><div className="rh-wrap rh-two"><div><h2>Connecting businesses across the China–Nigeria corridor.</h2><p>Savelanded supports sea and air freight from China to Nigeria. Our team can help you review shipping arrangements and follow recorded shipment updates.</p><div className="rh-actions"><Link className="rh-button rh-dark" href="/about">Read Our Story <ArrowRight size={16}/></Link><Link className="rh-button rh-light" href="/contact">View Our Offices</Link></div></div><div className="rh-office-grid"><article><small>CHINA OFFICE</small><h3>Yiwu</h3><p>Speak with our Yiwu team about your shipping requirements.</p></article><article><small>SOUTH CHINA OFFICE</small><h3>Guangzhou</h3><p>Contact our Guangzhou office for cargo and dispatch enquiries.</p></article><article><small>NIGERIA OFFICE</small><h3>Lagos</h3><p>Get local assistance with shipment updates and delivery questions.</p></article></div></div></section>

    <section className="rh-section rh-pale" id="services"><div className="rh-wrap"><div className="rh-centered"><h2>Sea & air freight, built around your cargo.</h2><p>Tell us what you are shipping. Our team will confirm the available options.</p></div><div className="rh-four rh-service-grid">{services.map(([title,tag,copy],i) => <article key={title}><div className="rh-service-top"><span>{String(i+1).padStart(2,"0")}</span><small>{tag}</small></div><h3>{title}</h3><p>{copy}</p><Link href={i === 3 ? "/track" : "/quote"}>{i === 3 ? "Track a shipment" : "Request a rate"} <ArrowRight size={15}/></Link></article>)}</div><div className="rh-center-action"><Link className="rh-button rh-dark" href="/shipping">Compare Shipping Options <ArrowRight size={16}/></Link></div></div></section>

    <section className="rh-section"><div className="rh-wrap"><div className="rh-section-head"><h2>How we move your cargo, step by step.</h2><Link className="rh-button" href="/quote">Start Your Shipment <ArrowRight size={16}/></Link></div><div className="rh-five">{steps.map(([title,copy],i)=><article key={title} className={i === 4 ? "rh-final-step" : ""}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="rh-section rh-pale" id="calculator"><div className="rh-wrap"><div className="rh-centered"><h2>Choose the shipping mode for your cargo.</h2><p>Use cargo size and urgency to start a conversation with our team.</p></div><div className="rh-two rh-modes"><article><Plane size={26}/><h3>Air freight from China to Nigeria</h3><p>For shipments where timing matters. Availability, route, pricing, and estimated arrival are confirmed for each request.</p><Link href="/quote">Ask about air freight <ArrowRight size={16}/></Link></article><article><Ship size={26}/><h3>Sea freight from China to Nigeria</h3><p>For larger cargo volumes. Share your dimensions and destination so our team can review the options.</p><Link href="/quote">Ask about sea freight <ArrowRight size={16}/></Link></article></div><div className="rh-calculator"><div><h3>Calculate cargo volume</h3><p>Enter dimensions in centimetres. This estimate helps you prepare a quote request; it is not a shipping price.</p></div><div className="rh-fields">{["Length","Width","Height","Pieces"].map((label,i)=><label key={label}>{label}<input type="number" min="0.01" step="any" inputMode="decimal" value={dimensions[i]} onChange={(e)=>setDimensions(dimensions.map((value,j)=>j===i?e.target.value:value))}/></label>)}<output aria-live="polite"><strong>{cbm ? cbm.toFixed(3) : "0.000"} m³</strong><span>Total CBM</span></output></div></div></div></section>

    <section className="rh-section rh-corridor"><div className="rh-wrap"><div className="rh-section-head"><div><h2>China–Nigeria trade corridor</h2><p>Shipping details are confirmed for each cargo request.</p></div><Link className="rh-button" href="/quote">Request a Corridor Rate <ArrowRight size={16}/></Link></div><div className="rh-table-wrap" role="region" aria-label="China–Nigeria freight comparison" tabIndex={0}><table><thead><tr><th>Freight method</th><th>Origin</th><th>Destination</th><th>What to share</th></tr></thead><tbody><tr><th>Air freight</th><td>China</td><td>Nigeria</td><td>Cargo description, weight, dimensions, and required timing</td></tr><tr><th>Sea freight</th><td>China</td><td>Nigeria</td><td>Cargo description, volume, weight, and destination</td></tr></tbody></table></div></div></section>
    <section className="rh-section rh-closing"><div className="rh-wrap"><h2>Ready to plan your shipment?</h2><p>Send your cargo details to our team for a reviewed quote.</p><Link className="rh-button" href="/quote">Request a Quote <ArrowRight size={16}/></Link></div></section>
  </div>;
}
