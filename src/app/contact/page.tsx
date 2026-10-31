import { Header } from "@/components/header";
import { Eyebrow } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
import { Offices } from "@/components/offices";
import { company } from "@/lib/company";
export const metadata = { title: "Contact our team" };
export default function Page() {
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || company.email;
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "");
  return (
    <>
      <Header />
      <section className="page-intro content">
        <Eyebrow>Here to help</Eyebrow>
        <h1>
          Contact Savelanded.
          <br />
          China & Nigeria.
        </h1>
        <p>
          Connect with our team in China and Nigeria for sea and air freight
          enquiries.
        </p>
      </section>
      <section className="form-layout content">
        <aside>
          <h2>Talk to Savelanded.</h2>
          <p>
            For shipment questions, include your tracking number so our team can
            help.
          </p>
          <p>
            <a className="text-link contact-email" href={`mailto:${email}`}>
              {email}
            </a>
          </p>
          {phone && (
            <p>
              <a className="text-link" href={`tel:${phone}`}>
                {phone}
              </a>
            </p>
          )}
          <div className="company-contacts">
            {company.contacts.map((c) => (
              <div key={c.phone}>
                <strong>{c.name}</strong>
                <span>{c.role}</span>
                <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>
              </div>
            ))}
          </div>
          <a
            className="pill pill-dark"
            href={whatsapp ? `https://wa.me/${whatsapp}` : company.whatsapp}
          >
            Chat on WhatsApp ↗
          </a>
          <div className="business-hours">
            <h3>General enquiry hours</h3>
            {company.hours.map((h) => (
              <p key={h}>{h}</p>
            ))}
            <p className="form-note">
              Office hours may vary. Please confirm locally before visiting.
            </p>
          </div>
          <div className="aside-note">
            Do not send sensitive documents, card details, or passwords through
            this form.
          </div>
        </aside>
        <EnquiryForm kind="CONTACT" />
      </section>
      <Offices />
    </>
  );
}
