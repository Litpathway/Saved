"use client";
import Link from "next/link";
import { Header } from "@/components/header";
export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Header />
      <section className="login">
        <span className="eyebrow">Secure administration</span>
        <h1>We couldn’t load administration.</h1>
        <p>
          Please try again. If the problem continues, ask the site operator to
          check the private server logs.
        </p>
        <div className="admin-status-actions">
          <button className="pill pill-dark" onClick={reset}>
            Try again
          </button>
          <Link className="text-link" href="/">
            Back to website
          </Link>
        </div>
      </section>
    </>
  );
}
