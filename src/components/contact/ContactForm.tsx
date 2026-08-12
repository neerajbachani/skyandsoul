"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-sm border border-sage/40 bg-sky/30 px-5 py-6 font-serif text-xl text-earth">
        Thank you — we have your note. We will reply soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          required
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
          name="email"
          type="email"
          required
          className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-chocolate/20 bg-white px-4 py-3 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
        />
      </div>
      <Button type="submit" variant="filled">
        Send Message
      </Button>
      <p className="font-sans text-xs text-chocolate/55">
        Form submissions are local in Phase A — for a guaranteed reply, email{" "}
        {SITE.email}.
      </p>
    </form>
  );
}
