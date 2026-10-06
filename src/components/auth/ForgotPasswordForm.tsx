"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(
        data.message ||
          "If an account exists for that email, we sent a link to reset the password.",
      );
    } catch {
      setMessage(
        "If an account exists for that email, we sent a link to reset the password.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
      </label>
      {message ? <p className="font-serif text-base text-earth">{message}</p> : null}
      <Button type="submit" variant="filled" className="min-h-12 w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center font-serif text-base text-chocolate/70">
        <Link href="/auth/login" className="text-earth underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
