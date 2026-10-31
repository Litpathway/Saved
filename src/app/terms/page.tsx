import { Header } from "@/components/header";
export const metadata = { title: "Website terms" };
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <h1>Website terms.</h1>
        <p>Clear expectations for using this platform.</p>
      </section>
      <article className="legal content">
        <h2>Requests and bookings</h2>
        <p>
          A quote request is an enquiry. It does not create a shipping contract,
          reserve capacity, or confirm a price. Routes, methods, fees,
          documents, and service availability must be confirmed separately by
          Savelanded Company.
        </p>
        <h2>Tracking and estimates</h2>
        <p>
          Shipment tracking reflects milestones entered by authorized team
          members. It is not live GPS tracking or an external carrier
          integration. Estimated dates are not delivery guarantees.
        </p>
        <h2>Responsible use</h2>
        <p>
          Use this website only for lawful enquiries and authorized access. Do
          not attempt to access another customer’s information, guess tracking
          numbers, disrupt the site, or submit harmful content.
        </p>
        <h2>Content and assistance</h2>
        <p>
          Illustrative imagery does not represent company-owned equipment,
          offices, routes, or partners. General shipping information and
          automated support do not replace a confirmed quotation or specific
          advice from our team.
        </p>
        <h2>Launch review</h2>
        <p>
          Shipping contract terms, liability, insurance, customs
          responsibilities, cancellation provisions, legal entity details, and
          governing law must be supplied and legally reviewed by the company
          before production bookings are accepted.
        </p>
      </article>
    </>
  );
}
