import { ReferenceHeader } from "@/components/reference-header";
import { QuoteCalculator } from "@/components/quote-calculator";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const metadata = { title: "CBM calculator & shipping quote" };
export default function Page() {
  return <div className="reference-home rh-subpage"><ReferenceHeader/><section className="rh-subhero"><div className="rh-wrap"><h1>Calculate CBM and request a quote</h1><p>Measure your cargo, then send the details for a confirmed sea or air freight quotation.</p><a className="rh-mobile-jump" href="#quote-form">Go to quote form <ArrowRight size={15}/></a></div></section><section className="rh-quote-area"><div className="rh-wrap"><QuoteCalculator/></div></section><section className="rh-subcta"><div className="rh-wrap"><div><h2>Need help measuring your cargo?</h2><p>Contact an office and we’ll help you prepare the details.</p></div><Link className="rh-button" href="/contact">Contact an office <ArrowRight size={16}/></Link></div></section></div>;
}
