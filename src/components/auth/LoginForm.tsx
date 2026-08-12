"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account/orders";
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login.mutateAsync({ email, password });
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
      </div>
      <Button
        type="submit"
        variant="filled"
        className="w-full min-h-12"
        disabled={login.isPending}
      >
        {login.isPending ? "Signing in…" : "Sign In"}
      </Button>
      <p className="text-center font-serif text-base text-chocolate/70">
        New here?{" "}
        <Link
          href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}
          className="text-earth underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
