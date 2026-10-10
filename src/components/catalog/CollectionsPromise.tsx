import Link from "next/link";
import { SITE } from "@/lib/constants";

const PROMISES = [
  {
    num: "01",
    title: "100% Breathable Cotton",
    desc: "Spun from gentle cotton fibers that are soothing on fragile newborn skin, chemical-free, and breathable.",
  },
  {
    num: "02",
    title: "Patient Handcraft",
    desc: "Crocheted and assembled stitch-by-stitch by skilled women artisans in Jaipur with devoted attention.",
  },
  {
    num: "03",
    title: "Heirloom Durability",
    desc: "Structured weaves and tight finishing ensure every piece endures childhood play and bedtime cuddles.",
  },
  {
    num: "04",
    title: "Gift-Ready Presentation",
    desc: "Each order arrives lovingly gift-wrapped in artisanal tissue with handwritten note options.",
  },
];

export function CollectionsPromise() {
  const whatsappUrl = `https://wa.me/${SITE.phones[0].replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hi Sky n Soul, I am browsing your collections and would love some help choosing an heirloom gift!",
  )}`;

  return (
    <section className="border-t border-chocolate/10 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Artisan Philosophy
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
            The Sky n Soul Promise
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg leading-relaxed text-chocolate/75">
            Every thread woven and every detail sculpted is rooted in four timeless
            commitments to parents and little ones.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((promise) => (
            <div
              key={promise.num}
              className="group rounded-sm border border-chocolate/10 bg-canvas p-6 transition-all duration-300 hover:border-earth/30 hover:shadow-sm"
            >
              <span className="font-sans text-xs font-semibold tracking-widest text-earth">
                {promise.num}
              </span>
              <h3 className="mt-3 font-serif text-xl font-medium text-chocolate">
                {promise.title}
              </h3>
              <p className="mt-2.5 font-sans text-xs leading-relaxed text-chocolate/70">
                {promise.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bespoke Gifting Concierge Strip */}
        <div className="mt-16 rounded-sm border border-chocolate/10 bg-canvas/80 p-6 sm:p-10">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                Need Help Choosing?
              </p>
              <h3 className="mt-1 font-serif text-2xl font-medium text-chocolate sm:text-3xl">
                Bespoke Gifting & Baby Shower Assistance
              </h3>
              <p className="mt-2 max-w-xl font-sans text-xs leading-relaxed text-chocolate/75">
                Whether you are putting together a custom newborn hamper, need color
                matching for a nursery, or want delivery on a special date, our atelier
                is delighted to assist.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-chocolate px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-earth"
              >
                <span>WhatsApp Concierge</span>
                <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/contact"
                className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-chocolate underline underline-offset-[6px] transition-colors hover:text-earth"
              >
                Contact Atelier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
