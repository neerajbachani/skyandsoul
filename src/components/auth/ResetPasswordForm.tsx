"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not reset password");
      setMessage(data.message || "Password updated. You can sign in now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setPending(false);
    }
  }

  if (!token) {
    return (
      <p className="font-serif text-lg text-chocolate/75">
        This reset link is missing a token. Request a new one from the sign-in page.
      </p>
    );
  }

  if (message) {
    return (
      <div className="space-y-6">
        <p className="font-serif text-lg text-earth">{message}</p>
        <Button href="/auth/login" variant="filled">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <p className="border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <label className="block">
        <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          New password
        </span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
      </label>
      <Button type="submit" variant="filled" className="min-h-12 w-full" disabled={pending}>
        {pending ? "Saving…" : "Update password"}
      </Button>
      <p className="text-center font-serif text-base text-chocolate/70">
        <Link href="/auth/forgot-password" className="text-earth underline underline-offset-4">
          Request a new link
        </Link>
      </p>
    </form>
  );
}
