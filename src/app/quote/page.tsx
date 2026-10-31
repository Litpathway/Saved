import { Header } from "@/components/header";
import { Eyebrow } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
export const metadata = { title: "Request a shipping quote" };
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <Eyebrow>Your next move</Eyebrow>
        <h1>
          Let’s talk
          <br />
          about your cargo.
        </h1>
        <p>
          Tell us what you have in mind. Our team will review your requirements
          and confirm the available options.
        </p>
      </section>
      <section className="form-layout content">
        <aside>
          <span className="big-number">01 /</span>
          <h2>
            A little detail.
            <br />A better starting point.
          </h2>
          <p>
            Have the origin, destination, and cargo details ready. Weight and
            dimensions help us understand your shipment.
          </p>
          <p>
            Not sure about the best shipping method? We can discuss it with you.
          </p>
        </aside>
        <EnquiryForm kind="QUOTE" />
      </section>
    </>
  );
}
