"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/reveal";
import { prefersReducedMotion } from "@/components/motion/reduced-motion";
import { BRAND_STORY } from "@/lib/constants";

function quoteLines(quote: string) {
  return (quote.match(/[^.!?]+[.!?]?/g) ?? [quote])
    .map((line) => line.trim())
    .filter(Boolean);
}

export function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const lines = quoteLines(BRAND_STORY.quote);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const lineEls = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll("[data-story-line]"),
        );
        const body = section.querySelector<HTMLElement>("[data-story-body]");
        const bar = section.querySelector<HTMLElement>("[data-story-progress]");
        const [first, ...rest] = lineEls;

        const trigger = {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
        };

        if (first) gsap.set(first, { opacity: 1, y: 0 });

        const tl = gsap.timeline({ scrollTrigger: trigger });
        if (rest.length) {
          tl.from(rest, {
            y: 28,
            opacity: 0,
            stagger: 0.28,
            duration: 0.4,
            ease: "none",
          });
        }
        if (body) {
          tl.from(body, { y: 18, opacity: 0, duration: 0.35, ease: "none" }, "-=0.05");
        }

        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative bg-canvas md:h-[180vh]">
      <div className="relative flex items-center overflow-hidden px-5 py-24 sm:px-8 sm:py-32 md:sticky md:top-0 md:h-[100dvh] md:py-0">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-sky)_0%,transparent_62%)]" />
          <div className="absolute -top-12 left-[8%] h-44 w-72 rounded-full bg-sky/80 blur-3xl animate-sky-drift motion-reduce:animate-none" />
          <div className="absolute top-[28%] right-[6%] h-36 w-64 rounded-full bg-white/80 blur-3xl animate-sky-drift motion-reduce:animate-none [animation-delay:-7s]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.045] mix-blend-multiply">
            <filter id="story-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="4"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#story-grain)" />
          </svg>
        </div>

        <div className="relative mx-auto w-full max-w-3xl text-center">
          {lines.map((line, index) => {
            const text =
              index === 0
                ? `“${line}`
                : index === lines.length - 1
                  ? `${line}”`
                  : line;
            return (
              <p
                key={line}
                data-story-line
                className="font-serif text-[2rem] font-medium leading-[1.12] text-balance text-chocolate sm:text-5xl md:text-6xl"
              >
                {text}
              </p>
            );
          })}
          <p
            data-story-body
            className="mx-auto mt-8 max-w-[42rem] font-serif text-lg leading-relaxed text-chocolate/80 sm:text-xl"
          >
            {BRAND_STORY.body}
          </p>
        </div>

        <div
          data-story-progress
          className="absolute inset-x-8 bottom-8 hidden h-px origin-left bg-sage md:block"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
