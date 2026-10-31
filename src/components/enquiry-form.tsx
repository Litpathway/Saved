"use client";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
export function EnquiryForm({ kind }: { kind: "QUOTE" | "CONTACT" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    reference: string;
    message: string;
  } | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const r = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form.entries()), kind }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setSuccess(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to submit. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={42} />
        <h2>Your request is with us.</h2>
        <p>{success.message}</p>
        <p className="reference">Reference: {success.reference}</p>
        <button className="pill pill-dark" onClick={() => setSuccess(null)}>
          Send another enquiry <ArrowUpRight size={18} />
        </button>
      </div>
    );
  return (
    <form onSubmit={submit} className="enquiry-form">
      <div className="form-grid">
        <label>
          Your name <span>*</span>
          <input
            name="name"
            autoComplete="name"
            maxLength={100}
            required
            placeholder="Full name"
          />
        </label>
        <label>
          Email address <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            placeholder="you@company.com"
          />
        </label>
        <label>
          Phone number
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="Include country code"
          />
        </label>
        {kind === "QUOTE" && (
          <>
            <label>
              Preferred shipping method
              <select name="method">
                <option value="Not sure">Help me choose</option>
                <option>Sea</option>
                <option>Air</option>
              </select>
            </label>
            <label>
              Origin <span>*</span>
              <input
                name="origin"
                maxLength={160}
                placeholder="City and country"
                required
              />
            </label>
            <label>
              Destination <span>*</span>
              <input
                name="destination"
                maxLength={160}
                placeholder="City and country"
                required
              />
            </label>
            <label className="full">
              What are you shipping? <span>*</span>
              <textarea
                name="cargo"
                maxLength={2000}
                required
                placeholder="Describe the goods, quantity, and any special requirements"
                rows={3}
              />
            </label>
            <label>
              Weight, if known
              <input name="weight" maxLength={80} placeholder="e.g. 250 kg" />
            </label>
            <label>
              Dimensions, if known
              <input
                name="dimensions"
                maxLength={100}
                placeholder="Length × width × height, with units"
              />
            </label>
          </>
        )}
        <label className="full">
          {kind === "QUOTE" ? "Additional instructions" : "Your message"}{" "}
          <span>*</span>
          <textarea
            name="message"
            required
            maxLength={4000}
            rows={4}
            placeholder={
              kind === "QUOTE"
                ? "Share preferred timing and anything else we should know."
                : "How can we help?"
            }
          />
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="form-note">
        By submitting, you agree that we may use these details to respond to
        your enquiry. Read our <a href="/privacy">privacy notice</a>. Do not
        include payment details or identity documents.
      </p>
      {kind === "QUOTE" && (
        <p className="form-note">
          Available methods, pricing, and delivery estimates are subject to
          confirmation by our team. This form does not create a booking.
        </p>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button type="submit" className="pill pill-dark" disabled={busy}>
        {busy ? (
          <>
            <Loader2 size={17} className="spin" />
            Saving your request…
          </>
        ) : (
          <>
            Send {kind === "QUOTE" ? "quote request" : "message"}
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
