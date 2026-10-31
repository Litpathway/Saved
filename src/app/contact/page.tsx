import { Header } from "@/components/header";
import { Eyebrow } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
export const metadata = { title: "Contact our team" };
export default function Page() {
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL;
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "");
  return (
    <>
      <Header />
      <section className="page-intro content">
        <Eyebrow>Here to help</Eyebrow>
        <h1>
          A conversation.
          <br />A clearer way forward.
        </h1>
        <p>
          Questions about a shipment or planning something new? Send our team a
          message.
        </p>
      </section>
      <section className="form-layout content">
        <aside>
          <h2>Talk to Savelanded.</h2>
          <p>
            For shipment questions, include your tracking number so our team can
            help.
          </p>
          {email && (
            <p>
              <a className="text-link" href={`mailto:${email}`}>
                {email}
              </a>
            </p>
          )}
          {phone && (
            <p>
              <a className="text-link" href={`tel:${phone}`}>
                {phone}
              </a>
            </p>
          )}
          {whatsapp && (
            <a className="pill pill-dark" href={`https://wa.me/${whatsapp}`}>
              Chat on WhatsApp ↗
            </a>
          )}
          {process.env.NEXT_PUBLIC_BUSINESS_ADDRESS && (
            <p>{process.env.NEXT_PUBLIC_BUSINESS_ADDRESS}</p>
          )}
          {process.env.NEXT_PUBLIC_BUSINESS_HOURS && (
            <p>{process.env.NEXT_PUBLIC_BUSINESS_HOURS}</p>
          )}
          <div className="aside-note">
            Use this form for general enquiries. Please do not send sensitive
            documents, card details, or passwords.
          </div>
        </aside>
        <EnquiryForm kind="CONTACT" />
      </section>
    </>
  );
}
