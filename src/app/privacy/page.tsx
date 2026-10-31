import { Header } from "@/components/header";
export const metadata = { title: "Privacy notice" };
export default function Page() {
  return (
    <>
      <Header />
      <section className="page-intro content">
        <h1>Privacy notice.</h1>
        <p>How information submitted through this website is used.</p>
      </section>
      <article className="legal content">
        <h2>Enquiries and shipment information</h2>
        <p>
          We collect the details you submit in quote and contact forms to review
          and respond to your request. Authorized administrators can access
          these enquiries. Public tracking displays only a shipment’s tracking
          number, route at city or regional level, method, status, estimates,
          and recorded milestones.
        </p>
        <h2>Support assistant</h2>
        <p>
          Messages may be sent to the configured AI provider to generate a
          response using approved website information. This application does not
          store support conversation transcripts. Do not submit personal
          documents, payment information, passwords, or other sensitive data.
          The assistant may make mistakes; confirm important shipping details
          with our team.
        </p>
        <h2>Cookies and security</h2>
        <p>
          Administrator sign-in uses cookies to maintain a secure session. The
          site uses rate limiting to reduce abuse. It does not include
          advertising or analytics trackers by default. Hosting, email, and AI
          providers may process information needed to operate their services.
        </p>
        <h2>Your requests</h2>
        <p>
          Contact our team through the contact form to request access,
          correction, or deletion of submitted personal information, subject to
          applicable legal requirements. Include your enquiry reference where
          possible, without including sensitive documents.
        </p>
      </article>
    </>
  );
}
