import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ReferenceHeader } from "@/components/reference-header";
import { company } from "@/lib/company";

export const metadata = { title: "About us" };

export default function Page() {
  return <div className="reference-home rh-subpage rh-about-page">
    <ReferenceHeader />
    <section className="rh-subhero"><div className="rh-wrap"><h1>People on the ground in China and Nigeria.</h1><p>Savelanded helps customers arrange sea and air freight through our teams in Yiwu, Guangzhou, and Lagos.</p></div></section>
    <section className="rh-section"><div className="rh-wrap rh-about-story"><div><h2>Talk to the people handling your shipment.</h2><p>Our offices coordinate cargo enquiries, shipping arrangements, and delivery questions. Share what you are sending and where it needs to go. We’ll confirm the route, documents, and cost before you book.</p><Link className="rh-button rh-dark" href="/contact">Contact an office <ArrowRight size={16}/></Link></div><figure><Image src="/images/company/yiwu.jpg" alt="Savelanded office sign in Yiwu" fill sizes="(max-width:760px) 100vw, 50vw" /></figure></div></section>
    <section className="rh-section rh-pale"><div className="rh-wrap"><div className="rh-section-head"><div><h2>Our offices</h2><p>Find the right team for your cargo and destination.</p></div></div><div className="rh-about-offices">{company.offices.map((office) => <article key={office.city}><small>{office.label}</small><h3>{office.city}</h3><p>{office.address}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`} target="_blank" rel="noreferrer">Find directions <ArrowUpRight size={16}/></a></article>)}</div><p className="rh-office-note">Please confirm office hours and directions with our team before visiting.</p></div></section>
    <section className="rh-section rh-closing"><div className="rh-wrap"><h2>Ready to discuss your cargo?</h2><p>Send the details to our team for a reviewed quote.</p><Link className="rh-button" href="/quote">Request a quote <ArrowRight size={16}/></Link></div></section>
  </div>;
}
