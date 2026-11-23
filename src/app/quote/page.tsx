import { ReferenceHeader } from "@/components/reference-header";
import { QuoteCalculator } from "@/components/quote-calculator";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const metadata = { title: "CBM calculator & shipping quote" };
export default function Page() {
  return <div className="reference-home rh-subpage"><ReferenceHeader/><section className="rh-subhero"><div className="rh-wrap"><h1>Freight CBM Calculator & Shipping Quote</h1><p>Estimate shipment volume and air volumetric weight, then send your cargo details to our team for a reviewed quote.</p></div></section><main className="rh-quote-area"><div className="rh-wrap"><QuoteCalculator/></div></main><section className="rh-subcta"><div className="rh-wrap"><div><h2>Ready to ship from China?</h2><p>Speak to our team about sea and air freight options.</p></div><Link className="rh-button" href="/contact">Contact our offices <ArrowRight size={16}/></Link></div></section></div>;
}
