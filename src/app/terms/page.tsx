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
          For shipment-specific information, contact our team. Automated support
          does not replace a confirmed quotation or advice about your shipment.
        </p>
        <h2>Your shipping agreement</h2>
        <p>
          Confirm the price, shipping method, documentation, and applicable
          terms with our team before booking. Website enquiries do not create a
          shipping agreement.
        </p>
      </article>
    </>
  );
}
