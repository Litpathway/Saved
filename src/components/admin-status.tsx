import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { AdminAvailability } from "@/lib/admin-availability";

type Unavailable = Exclude<AdminAvailability, { status: "ready" }>;
export function AdminStatus({ availability }: { availability: Unavailable }) {
  const setup = availability.status === "setup-required";
  const account = availability.status === "account-required";
  return (
    <section
      className="login admin-status"
      aria-labelledby="admin-status-heading"
    >
      <ShieldCheck size={30} aria-hidden="true" />
      <span className="eyebrow">Secure administration</span>
      <h1 id="admin-status-heading">
        {setup || account
          ? "Administrator setup required"
          : "Administration temporarily unavailable"}
      </h1>
      <p>
        {setup
          ? "This deployment needs its secure server configuration before administrators can sign in."
          : account
            ? "The database is connected, but an authorized administrator account has not been provisioned yet."
            : "We could not connect to the administration service. Please try again shortly or contact the site operator."}
      </p>
      {setup && (
        <div className="aside-note">
          <h2>For the site operator</h2>
          <p>
            In Vercel → Project Settings → Environment Variables, configure:
          </p>
          <ul>
            {availability.missing.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
          <p>
            Use a hosted PostgreSQL database and a securely generated
            authentication secret. Set <code>NEXTAUTH_URL</code> to this site’s
            HTTPS address, then redeploy. Never paste secret values into this
            page.
          </p>
        </div>
      )}
      {account && (
        <div className="aside-note">
          <p>
            The site operator must run the documented{" "}
            <code>npm run admin:create</code> setup against this deployment’s
            database using a private email and password. There is no public
            registration or default password.
          </p>
        </div>
      )}
      {availability.status === "unavailable" && (
        <div className="aside-note">
          <p>
            Site operator: verify the production database connection and run the
            reviewed database migrations. Detailed diagnostics belong in private
            server logs.
          </p>
        </div>
      )}
      <div className="admin-status-actions">
        <a className="pill pill-dark" href="/admin/login">
          Check again <ArrowUpRight size={17} />
        </a>
        <Link href="/" className="text-link">
          Back to website
        </Link>
      </div>
    </section>
  );
}
