"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          Stay Close
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
          Join Our Nest
        </h2>
        <p className="mt-4 font-serif text-lg leading-relaxed text-chocolate/75">
          Stories, new arrivals, and little moments — delivered gently to your inbox.
        </p>

        {submitted ? (
          <p className="mt-10 font-serif text-xl text-earth">
            Welcome to the nest. We&apos;ll be in touch soon.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="min-h-12 flex-1 border border-chocolate/20 bg-canvas px-4 font-sans text-sm text-chocolate placeholder:text-chocolate/40 focus:border-earth focus:outline-none"
            />
            <Button type="submit" variant="filled" className="min-h-12">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
