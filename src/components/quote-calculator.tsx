"use client";
import { useState } from "react";
import { EnquiryForm } from "./enquiry-form";

export function QuoteCalculator() {
  const [values, setValues] = useState(["", "", "", "1", ""]);
  const [copied, setCopied] = useState(false);
  const [metrics, setMetrics] = useState<{ weight: string; dimensions: string }>();
  const [l, w, h, count, weight] = values.map(Number);
  const valid = [l, w, h, count].every((n) => Number.isFinite(n) && n > 0);
  const cbm = valid ? l * w * h * count / 1_000_000 : 0;
  const gross = valid && weight > 0 ? count * weight : 0;
  const volumetric = valid ? l * w * h * count / 6000 : 0;
  const summary = `${cbm.toFixed(3)} CBM; ${gross ? gross.toFixed(1) + " kg gross; " : ""}${volumetric.toFixed(1)} kg volumetric weight; ${count || 0} cartons, ${l || 0} × ${w || 0} × ${h || 0} cm.`;
  function copy() {
    if (!valid) return;
    setMetrics({ weight: gross ? `${gross.toFixed(1)} kg` : "", dimensions: summary });
    setCopied(true);
    document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return <div className="rh-quote-grid">
    <section className="rh-quote-card"><small>VOLUME & WEIGHT ESTIMATOR</small><h2>CBM & Air Volumetric Calculator</h2><p>Enter carton dimensions in centimetres and gross weight in kilograms.</p>
      <div className="rh-quote-fields">{["Length (cm)", "Width (cm)", "Height (cm)", "Number of cartons", "Weight per carton (kg)"].map((label,i)=><label key={label}>{label}<input type="number" min="0.01" step="any" inputMode="decimal" value={values[i]} onChange={(e)=>{setValues(values.map((v,j)=>i===j?e.target.value:v));setCopied(false);}} /></label>)}</div>
      <div className="rh-quote-result" aria-live="polite"><div><span>Total sea volume</span><strong>{cbm.toFixed(3)} CBM</strong></div><div><span>Air volumetric weight</span><strong>{volumetric.toFixed(1)} kg</strong></div><div><span>Total gross weight</span><strong>{gross ? `${gross.toFixed(1)} kg` : "—"}</strong></div><p>Air chargeable weight is generally the greater of gross and volumetric weight. Our team confirms the final method and rate.</p><button type="button" disabled={!valid} onClick={copy}>{copied ? "Metrics added to quote form" : "Copy calculated metrics to quote form"}</button></div>
    </section>
    <section className="rh-quote-card" id="quote-form"><small>DIRECT QUOTATION REQUEST</small><h2>Request a custom shipping quote</h2><p>Complete your shipment details. Our team will review the available options and reply.</p><EnquiryForm kind="QUOTE" metrics={metrics}/></section>
  </div>;
}
