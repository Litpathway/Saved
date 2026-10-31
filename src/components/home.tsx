"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Ship,
  Plane,
  Truck,
  TrainFront,
  ScanLine,
  MessagesSquare,
  ClipboardList,
  Route,
  ShieldCheck,
  Plus,
  Minus,
  PackageCheck,
} from "lucide-react";
import { Header } from "./header";
import { ArrowLink, Eyebrow } from "./ui";
const modes = [
  {
    name: "Sea",
    icon: Ship,
    description: "For larger cargo",
    detail: "Discuss container and cargo requirements with our team.",
  },
  {
    name: "Air",
    icon: Plane,
    description: "When timing matters",
    detail: "Ask about availability for your origin and destination.",
  },
  {
    name: "Road",
    icon: Truck,
    description: "Connecting the journey",
    detail: "Discuss collection and final delivery requirements.",
  },
  {
    name: "Rail",
    icon: TrainFront,
    description: "An alternative to explore",
    detail: "Our team can confirm whether this suits your route.",
  },
];
const steps = [
  [
    "Request a quote",
    "Tell us what you’re shipping and where it needs to go.",
    "Share the cargo description, origin, destination, and known weight or dimensions. Our team will confirm available options before any booking.",
  ],
  [
    "Plan your shipment",
    "Work with our team to confirm the details.",
    "Confirm the proposed method, scope, documents, costs, and any special requirements with the team. Availability is assessed for each request.",
  ],
  [
    "Follow the progress",
    "Stay informed with recorded shipment milestones.",
    "Use your unique tracking number to see the latest update entered by our team. Tracking does not represent live GPS movement.",
  ],
  [
    "Complete the journey",
    "Check the final recorded delivery update.",
    "The tracking timeline shows delivery when our team records it. Contact support if you need help with an update or delivery arrangements.",
  ],
];
const faqs = [
  [
    "How do I track my shipment?",
    "Use the tracking number supplied by our team. Enter it on the tracking page to view recorded milestones, the current status, and the latest update.",
  ],
  [
    "How much does shipping cost?",
    "Pricing depends on the route, cargo, dimensions, weight, and confirmed shipping method. Send a quote request for a reviewed quotation. We do not publish automatic or guaranteed prices.",
  ],
  [
    "Which destinations and services are available?",
    "Please share your origin, destination, and cargo requirements with our team. Service and route availability must be confirmed for your shipment.",
  ],
  [
    "When will my shipment arrive?",
    "An estimated delivery date is shown in tracking when one has been provided by our team. Estimates are not delivery guarantees.",
  ],
  [
    "Can I speak to someone?",
    "Yes. Use the contact form to send your question, including your tracking number if relevant. Avoid sending identity documents or payment information.",
  ],
];
export function Home() {
  const [mode, setMode] = useState("Sea");
  const [step, setStep] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);
  const [number, setNumber] = useState("");
  const slider = useRef<HTMLDivElement>(null);
  const ordered = [
    ...modes.filter((m) => m.name === mode),
    ...modes.filter((m) => m.name !== mode),
  ];
  return (
    <>
      <section className="hero">
        <Image
          src="/images/hero.webp"
          alt="Illustrative cargo truck at a container port beneath a blue sky"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1260px"
          className="hero-image"
        />
        <div className="hero-shade" />
        <Header hero />
        <div className="hero-copy">
          <span className="hero-kicker">
            <span /> YOUR CARGO. OUR COMMITMENT.
          </span>
          <h1>
            A world of possibilities.
            <br />
            One shipping partner.
          </h1>
          <p>
            From the first conversation to the final milestone.
            <br className="desktop" /> A clearer way to move your cargo forward.
          </p>
          <ArrowLink href="/quote">Get a shipping quote</ArrowLink>
          <Link className="hero-track-link" href="/track">
            Track your shipment <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="route-area">
          <div className="route-caption">
            YOUR NEXT MOVE STARTS HERE <span>01 — 04</span>
          </div>
          <div
            className="route-slider"
            ref={slider}
            tabIndex={0}
            aria-label="Shipping options to discuss"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                slider.current?.scrollBy({
                  left: e.key === "ArrowRight" ? 350 : -350,
                  behavior: "smooth",
                });
              }
            }}
          >
            {ordered.map((m) => (
              <Link
                href={`/shipping#${m.name.toLowerCase()}`}
                key={m.name}
                className="route-card"
              >
                <div className="route-thumb">
                  <m.icon size={44} />
                </div>
                <div>
                  <span className="tiny">EXPLORE THE POSSIBILITIES</span>
                  <h3>{m.name} freight</h3>
                  <p>{m.description}</p>
                  <span className="route-more">
                    Check availability <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-bottom">
          <div className="mode-pills" aria-label="Explore a shipping mode">
            {modes.map((m) => (
              <button
                aria-pressed={mode === m.name}
                key={m.name}
                className={mode === m.name ? "selected" : ""}
                onClick={() => {
                  setMode(m.name);
                  slider.current?.scrollTo({ left: 0, behavior: "smooth" });
                }}
              >
                <m.icon size={16} />
                {m.name}
              </button>
            ))}
          </div>
          <span className="hero-note">Illustrative shipping scene</span>
          <div className="slider-controls">
            <button
              aria-label="Previous shipping option"
              onClick={() =>
                slider.current?.scrollBy({ left: -350, behavior: "smooth" })
              }
            >
              <ArrowLeft size={20} />
            </button>
            <button
              aria-label="Next shipping option"
              onClick={() =>
                slider.current?.scrollBy({ left: 350, behavior: "smooth" })
              }
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
      <section className="tracking-strip content">
        <div>
          <ScanLine size={29} />
          <div>
            <h2>Already on its way?</h2>
            <p>Your latest shipment update, in one place.</p>
          </div>
        </div>
        <form action="/track">
          <label className="sr-only" htmlFor="home-tracking">
            Tracking number
          </label>
          <input
            id="home-tracking"
            name="number"
            placeholder="Enter your tracking number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            maxLength={40}
          />
          <button className="pill pill-dark" type="submit">
            Track shipment <ArrowUpRight size={18} />
          </button>
        </form>
      </section>
      <section
        className="trust-grid content"
        aria-label="A clearer shipping experience"
      >
        {[
          {
            icon: MessagesSquare,
            title: "People you can talk to",
            text: "A direct line to your shipping questions.",
          },
          {
            icon: ScanLine,
            title: "Visibility at every step",
            text: "Recorded updates, easy to find.",
          },
          {
            icon: ClipboardList,
            title: "Clarity from the start",
            text: "Discuss your requirements before booking.",
          },
          {
            icon: Route,
            title: "A coordinated journey",
            text: "Stay informed from request to delivery.",
          },
        ].map((f) => (
          <div className="trust-item" key={f.title}>
            <span>
              <f.icon size={27} strokeWidth={1.4} />
            </span>
            <div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          </div>
        ))}
      </section>
      <section className="process content" id="process">
        <div>
          <Eyebrow>Our process</Eyebrow>
          <h2>
            Good logistics.
            <br />
            Clear from the start.
          </h2>
          <p className="section-copy">
            Big plans start with simple steps. Here’s how to get your next
            shipment moving with Savelanded.
          </p>
          <div className="process-visual">
            <Image
              src="/images/hero.webp"
              alt="Illustrative container port showing a coordinated shipping environment"
              fill
              sizes="400px"
            />
            <div className="process-float">
              <span>
                <PackageCheck size={26} />
              </span>
              <h3>
                Every milestone.
                <br />
                One place.
              </h3>
              <p>
                Follow the updates that matter with your unique tracking number.
              </p>
              <Link href="/track">
                Track your cargo <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </div>
        <div className="steps">
          {steps.map(([title, subtitle, detail], i) => (
            <div key={title} className={`step ${step === i ? "expanded" : ""}`}>
              <button
                aria-expanded={step === i}
                aria-controls={`step-${i}`}
                onClick={() => setStep(step === i ? -1 : i)}
              >
                <span className="step-number">0{i + 1}</span>
                <span>
                  <strong>{title}</strong>
                  <span className="step-subtitle">{subtitle}</span>
                </span>
                <span className="step-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </button>
              {step === i && (
                <p id={`step-${i}`} className="step-detail">
                  {detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="showcase" id="shipping">
        <div className="showcase-heading">
          <div>
            <Eyebrow>Shipping possibilities</Eyebrow>
            <h2>
              Different cargo.
              <br />
              The right conversation.
            </h2>
            <p>
              Explore your options. Let’s confirm what works for your shipment.
            </p>
          </div>
          <ArrowLink href="/shipping">Explore shipping</ArrowLink>
        </div>
        <div className="shipping-grid">
          {modes.slice(0, 3).map((m, i) => (
            <article
              key={m.name}
              className={`shipping-card shipping-card-${i}`}
            >
              <Image
                src="/images/hero.webp"
                alt="Illustrative port and freight transport"
                fill
                sizes="(max-width: 767px) 90vw, 400px"
              />
              <div className="shipping-overlay" />
              <span className="shipping-tag">
                <m.icon size={14} />
                {m.name} freight
              </span>
              <div className="shipping-card-copy">
                <h3>{m.description}</h3>
                <p>{m.detail}</p>
                <Link href={`/shipping#${m.name.toLowerCase()}`}>
                  Explore {m.name.toLowerCase()} shipping{" "}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="showcase-note">
          Shipping methods are shown for enquiry purposes. Routes and service
          availability require confirmation.
        </p>
      </section>
      <section className="journey-strip content">
        <span>
          FROM A QUESTION
          <br />
          <strong>TO YOUR NEXT SHIPMENT.</strong>
        </span>
        <p>
          A little detail now.
          <br />A clearer journey ahead.
        </p>
        <ArrowLink href="/quote" dark>
          Let’s get started
        </ArrowLink>
      </section>
      <section className="faq content" id="faq">
        <div>
          <Eyebrow>A little more clarity</Eyebrow>
          <h2>
            Your questions.
            <br />
            Answered.
          </h2>
          <p className="section-copy">
            Need something more specific?
            <br />
            Our team is here to help.
          </p>
          <Link href="/contact" className="text-link">
            Talk to our team <ArrowUpRight size={18} />
          </Link>
        </div>
        <div>
          {faqs.map(([q, a], i) => (
            <div className="faq-row" key={q}>
              <button
                aria-expanded={faq === i}
                aria-controls={`faq-${i}`}
                onClick={() => setFaq(faq === i ? null : i)}
              >
                {q}
                {faq === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {faq === i && <p id={`faq-${i}`}>{a}</p>}
            </div>
          ))}
        </div>
      </section>
      <section className="closing content">
        <span>LET’S MOVE FORWARD</span>
        <h2>
          Your next shipment
          <br />
          starts with a hello.
        </h2>
        <ArrowLink href="/quote">Get a shipping quote</ArrowLink>
      </section>
    </>
  );
}
