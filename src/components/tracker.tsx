"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { trackingSchema } from "@/lib/validation";
type Shipment = {
  trackingNumber: string;
  origin: string;
  destination: string;
  method: string;
  status: string;
  estimatedDelivery: string | null;
  updatedAt: string;
  milestones: { status: string; note: string; occurredAt: string }[];
};
export function Tracker() {
  const search = useSearchParams();
  const [number, setNumber] = useState(search.get("number") ?? "");
  const [data, setData] = useState<Shipment | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const initialized = useRef(false);
  async function lookup(value: string) {
    setData(null);
    setError("");
    const parsed = trackingSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/tracking/" + encodeURIComponent(parsed.data));
      const response = await r.json();
      if (!r.ok) throw new Error(response.error);
      setData(response);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to connect. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const value = search.get("number");
      if (value) lookup(value);
    }
  }, [search]);
  return (
    <div className="tracker">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(number);
        }}
      >
        <label htmlFor="tracking-number">Your tracking number</label>
        <div className="tracking-input">
          <input
            id="tracking-number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            placeholder="SL-XXXXXXXXXXXXXXXX"
            maxLength={40}
            autoCapitalize="characters"
            aria-describedby="tracking-help"
          />
          <button disabled={busy} className="pill pill-dark">
            {busy ? (
              <Loader2 className="spin" size={18} />
            ) : (
              <>
                Track now <ArrowUpRight size={18} />
              </>
            )}
          </button>
        </div>
        <p id="tracking-help" className="form-note">
          Use the unique number supplied by our team. No account required.
        </p>
      </form>
      {error && (
        <div className="tracking-empty" role="alert">
          <Package size={33} />
          <h2>Let’s check that number.</h2>
          <p>{error}</p>
          <Link href="/contact" className="text-link">
            Ask our team for help ↗
          </Link>
        </div>
      )}
      {data && (
        <section className="tracking-result" aria-live="polite">
          <div className="result-header">
            <div>
              <span className="tiny">SHIPMENT {data.trackingNumber}</span>
              <h2>{data.status}</h2>
            </div>
            <span className="status-badge">
              <Package size={16} />
              {data.method}
            </span>
          </div>
          <div className="result-route">
            <div>
              <MapPin size={19} />
              <span>
                Origin<strong>{data.origin}</strong>
              </span>
            </div>
            <ArrowUpRight />
            <div>
              <MapPin size={19} />
              <span>
                Destination<strong>{data.destination}</strong>
              </span>
            </div>
          </div>
          <div className="result-dates">
            <p>
              Estimated delivery
              <strong>
                {data.estimatedDelivery
                  ? new Date(data.estimatedDelivery).toLocaleDateString(
                      "en-GB",
                      { timeZone: "UTC" },
                    )
                  : "Not yet provided"}
              </strong>
            </p>
            <p>
              Last recorded update
              <strong>
                {new Date(data.updatedAt).toLocaleString("en-GB", {
                  timeZone: "UTC",
                })}{" "}
                UTC
              </strong>
            </p>
          </div>
          <h3>Shipment journey</h3>
          <ol className="timeline">
            {data.milestones.map((m, i) => (
              <li key={i}>
                <span className="timeline-dot">
                  {i === data.milestones.length - 1 ? (
                    <Clock size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                </span>
                <div>
                  <strong>{m.status}</strong>
                  {m.note && <p>{m.note}</p>}
                  <time dateTime={m.occurredAt}>
                    {new Date(m.occurredAt).toLocaleString("en-GB", {
                      timeZone: "UTC",
                    })}{" "}
                    UTC
                  </time>
                </div>
              </li>
            ))}
          </ol>
          <p className="form-note">
            These milestones are recorded by our team. They do not represent
            live GPS movement. Dates are estimates unless separately confirmed.
          </p>
        </section>
      )}
    </div>
  );
}
