"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Ship,
  Plane,
  ScanLine,
  Plus,
  Minus,
  PackageCheck,
  UsersRound,
  Star,
} from "lucide-react";
import { Offices } from "./offices";
import { Header } from "./header";
import { ArrowLink } from "./ui";
const services = [
  {
    name: "Sea freight",
    icon: Ship,
    description: "Sea freight",
    detail:
      "Shipping from China to Nigeria. Send your cargo weight and volume for a quote.",
    image: "/images/company/warehouse.jpg",
    anchor: "sea",
  },
  {
    name: "Air freight",
    icon: Plane,
    description: "Air freight",
    detail:
      "Air shipping from China to Nigeria. Contact our team for rates and shipping arrangements.",
    image: "/images/company/guangzhou.jpg",
    anchor: "air",
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
    "Use your manifest or tracking number to see the container's estimated stage or the latest update entered by our team. Tracking does not represent live GPS movement.",
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
    "Enter the Yiwu or Guangzhou manifest number supplied by our team. Older tracking numbers also work. Container stages are estimated from the shipping schedule, and our team can post corrections.",
  ],
  [
    "How much does shipping cost?",
    "Pricing depends on the route, cargo, dimensions, weight, and confirmed shipping method. Send a quote request for a reviewed quotation. We do not publish automatic or guaranteed prices.",
  ],
  [
    "Which destinations and services are available?",
    "We offer sea and air freight from China to Nigeria, with offices in Yiwu, Guangzhou, and Lagos. Confirm specific methods and delivery arrangements with our team.",
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
  const [step, setStep] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);
  const [number, setNumber] = useState("");
  return (
    <>
      <section className="hero">
        <Image
          src="/images/company/warehouse.jpg"
          alt="Cargo loading at Savelanded"
          fill
          priority
          sizes="(max-width: 1648px) 100vw, 1600px"
          className="hero-image"
        />
        <div className="hero-shade" />
        <Header hero />
        <div className="hero-copy">
          <h1>
            From China to Nigeria.
            <br />
            Sea and air freight.
          </h1>
          <p>
            Ship with Savelanded from China to Nigeria.
            <br className="desktop" /> Contact our offices in Yiwu, Guangzhou,
            or Lagos.
          </p>
          <ArrowLink href="/quote">Get a shipping quote</ArrowLink>
          <Link className="hero-track-link" href="/track">
            Track your shipment <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="hero-metrics" aria-label="Company metrics">
          <div><Ship aria-hidden="true" /><strong>1.5k+</strong><span>Containers offloaded</span></div>
          <div><UsersRound aria-hidden="true" /><strong>5k+</strong><span>Customers satisfied</span></div>
          <div><Star aria-hidden="true" /><strong>97.7%</strong><span>Rating</span></div>
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
      <section className="process content" id="process">
        <div>
          <h2>
            How to ship
            <br />
            with Savelanded.
          </h2>
          <p className="section-copy">
            Request a quote, confirm the shipping details, and track your cargo.
          </p>
          <div className="process-visual">
            <Image
              src="/images/company/warehouse.jpg"
              alt="Cargo handling and loading photo published by Savelanded"
              fill
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 640px, 560px"
            />
            <div className="process-float">
              <span>
                <PackageCheck size={26} />
              </span>
              <h3>
                Shipment updates.
                <br />
                Track online.
              </h3>
              <p>
                Enter your tracking number to see the latest recorded update.
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
            <h2>
              Importing from China?
              <br />
              We can help.
            </h2>
            <p>
              Contact our offices in Yiwu, Guangzhou, or Lagos for sea and air
              freight enquiries.
            </p>
          </div>
          <ArrowLink href="/shipping">Explore shipping</ArrowLink>
        </div>
        <div className="shipping-grid freight-grid">
          {services.map((m, i) => (
            <article
              key={m.name}
              className={`shipping-card shipping-card-${i}`}
            >
              <Image
                src={m.image}
                alt="Shipping and cargo image published on Savelanded’s website"
                fill
                sizes="(max-width: 767px) 90vw, 400px"
              />
              <div className="shipping-overlay" />
              <span className="shipping-tag">
                <m.icon size={14} />
                {m.name}
              </span>
              <div className="shipping-card-copy">
                <h3>{m.description}</h3>
                <p>{m.detail}</p>
                <Link href={`/shipping#${m.anchor}`}>
                  Learn about {m.name.toLowerCase()} <ArrowUpRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="showcase-note">
          Specific transport methods, prices, and delivery arrangements are
          confirmed for each shipment.
        </p>
      </section>
      <Offices />
      <section className="journey-strip content">
        <span>
          SEA & AIR FREIGHT
          <br />
          <strong>CHINA TO NIGERIA</strong>
        </span>
        <p>
          Tell us what you’re shipping.
          <br />
          Get a quote from our team.
        </p>
        <ArrowLink href="/quote" dark>
          Request a quote
        </ArrowLink>
      </section>
      <section className="faq content" id="faq">
        <div>
          <h2>
            Frequently asked
            <br />
            questions.
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
        <span>GET A QUOTE</span>
        <h2>
          Send us your
          <br />
          shipping requirements.
        </h2>
        <ArrowLink href="/quote">Get a shipping quote</ArrowLink>
      </section>
    </>
  );
}
