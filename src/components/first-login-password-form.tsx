"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ArrowUpRight } from "lucide-react";

export function FirstLoginPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    if (newPassword !== data.get("confirmPassword")) {
      setError("The new passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Choose a password different from your temporary password.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setError(result?.error ?? "Could not change the password. Try again.");
        return;
      }
      form.reset();
      await signOut({ redirect: false });
      router.replace("/admin/login?changed=1");
      router.refresh();
    } catch {
      setError("Could not change the password. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="login" onSubmit={submit}>
      <h1>Set your password</h1>
      <p className="form-note">
        Change your temporary password before opening administration. This step
        appears only on your first sign in.
      </p>
      <label>
        Temporary password
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
        />
      </label>
      <label>
        New password
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={14}
          maxLength={200}
        />
      </label>
      <label>
        Confirm new password
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={14}
          maxLength={200}
        />
      </label>
      <p className="form-note">
        Use at least 14 characters and a password you have not used before.
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="pill pill-dark" type="submit" disabled={busy}>
        {busy ? "Saving password…" : "Save password"}
        <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
