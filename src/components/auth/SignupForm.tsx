"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useSignup } from "@/hooks/useAuth";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account/orders";
  const signup = useSignup();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await signup.mutateAsync({ email, password, name: name || undefined });
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <p className="border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
          {error}
        </p>
      ) : null}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
        <p className="mt-2 font-sans text-xs text-chocolate/50">
          At least 8 characters
        </p>
      </div>
      <Button
        type="submit"
        variant="filled"
        className="w-full min-h-12"
        disabled={signup.isPending}
      >
        {signup.isPending ? "Creating account…" : "Create Account"}
      </Button>
      <p className="text-center font-serif text-base text-chocolate/70">
        Already have an account?{" "}
        <Link
          href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
          className="text-earth underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
