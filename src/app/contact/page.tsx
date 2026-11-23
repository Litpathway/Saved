import { ReferenceHeader } from "@/components/reference-header";
import { EnquiryForm } from "@/components/enquiry-form";
import { company } from "@/lib/company";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const metadata = { title: "Contact & offices" };
export default function Page() {
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || company.email;
  return <div className="reference-home rh-subpage"><ReferenceHeader/><section className="rh-subhero"><div className="rh-wrap"><h1>Speak with Savelanded</h1><p>Ask about a shipment, request a quote, or arrange a visit to one of our offices.</p></div></section>
    <section className="rh-section"><div className="rh-wrap"><div className="rh-contact-grid">{company.contacts.slice(0,2).map((c)=><article key={c.phone}><h2>{c.name}</h2><p>{c.role}</p><a className="rh-contact-number" href={`tel:${c.phone.replace(/\s/g,"")}`}>{c.phone}</a><a className="rh-button" href={`https://wa.me/${c.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer">Chat on WhatsApp <ArrowRight size={15}/></a></article>)}<article><h2>Email</h2><p>For shipping enquiries and documents requested by our team.</p><a className="rh-contact-number" href={`mailto:${email}`}>{email}</a><a className="rh-button rh-dark" href={`mailto:${email}`}>Send an email <ArrowRight size={15}/></a></article></div>
      <div className="rh-directory"><h2>Office & warehouse directory</h2><div>{company.offices.map((office)=><article key={office.city}><small>{office.label}</small><h3>{office.city}</h3><p>{office.address}</p><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`} target="_blank" rel="noreferrer">Find directions <ArrowRight size={14}/></a></article>)}</div><p>Confirm directions and opening hours with the team before visiting.</p></div>
      <div className="rh-contact-form"><div><h2>Send an enquiry</h2><p>Include your tracking number if your question is about a shipment.</p></div><EnquiryForm kind="CONTACT"/></div></div></section><section className="rh-subcta"><div className="rh-wrap"><div><h2>Ready to request a shipping quote?</h2><p>Tell us about your cargo and our team will review it.</p></div><Link className="rh-button" href="/quote">Request a quote <ArrowRight size={16}/></Link></div></section></div>;
}
