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
      <p className="rounded-sm border border-sage/40 bg-sky/30 px-5 py-6 font-sans text-xl leading-relaxed text-chocolate">
        Thank you — we have your note. We will reply soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border-t border-chocolate/10 pt-10">
      <p className="font-sans text-sm font-semibold uppercase tracking-wide text-earth">
        Send a message
      </p>
      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-sans text-base font-medium text-chocolate"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="min-h-14 w-full border border-chocolate/25 bg-white px-4 font-sans text-base text-chocolate placeholder:text-chocolate/45 focus:border-earth focus:outline-none focus:ring-2 focus:ring-earth/20"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-sans text-base font-medium text-chocolate"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="min-h-14 w-full border border-chocolate/25 bg-white px-4 font-sans text-base text-chocolate placeholder:text-chocolate/45 focus:border-earth focus:outline-none focus:ring-2 focus:ring-earth/20"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-sans text-base font-medium text-chocolate"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full border border-chocolate/25 bg-white px-4 py-3 font-sans text-base leading-relaxed text-chocolate placeholder:text-chocolate/45 focus:border-earth focus:outline-none focus:ring-2 focus:ring-earth/20"
        />
      </div>
      <Button type="submit" variant="filled">
        Send Message
      </Button>
      <p className="font-sans text-base leading-relaxed text-chocolate/75">
        Form submissions are local in Phase A — for a guaranteed reply, email{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="text-earth underline underline-offset-2"
        >
          {SITE.email}
        </a>
        .
      </p>
    </form>
  );
}
