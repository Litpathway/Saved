"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
export function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const result = await signIn("credentials", {
        email: data.get("email"),
        password: data.get("password"),
        redirect: false,
      });
      if (!result || !result.ok || result.error)
        setError(
          "Unable to sign in. Check your credentials or try again later.",
        );
      else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Sign in is temporarily unavailable.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="login" onSubmit={submit}>
      <span className="eyebrow">Secure access</span>
      <h1>Administrator sign in</h1>
      <p className="form-note">
        For authorized Savelanded Company team members.
      </p>
      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="pill pill-dark" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
