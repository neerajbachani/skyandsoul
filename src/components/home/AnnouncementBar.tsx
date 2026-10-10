"use client";

import { useEffect, useState, useCallback } from "react";
import { RetroCta } from "@/components/ui/retro-cta";

interface AnnouncementItem {
  id: string;
  badge: string;
  message: React.ReactNode;
  ctaText: string;
  ctaHref: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "first-order",
    badge: "10% OFF",
    message: (
      <span>
        Flat 10% off on your first heirloom order with code{" "}
        <strong className="rounded bg-[#1E3A4F]/10 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-[#1E3A4F] sm:text-[11px]">
          FIRST10
        </strong>
      </span>
    ),
    ctaText: "SHOP NOW",
    ctaHref: "/collections",
  },
  {
    id: "free-shipping",
    badge: "FREE SHIPPING",
    message: (
      <span>
        Complimentary pan-India delivery on all orders above{" "}
        <strong className="font-semibold text-chocolate">₹999</strong>
      </span>
    ),
    ctaText: "EXPLORE",
    ctaHref: "/collections",
  },
  {
    id: "heirloom-craft",
    badge: "HANDMADE",
    message: (
      <span>
        Crafted with pure love in Jaipur · Heirloom crochet blankets &amp; memory frames
      </span>
    ),
    ctaText: "DISCOVER",
    ctaHref: "/collections/blankets",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, next]);

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <aside
      aria-label="Announcements & Offers"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative z-40 border-b border-[#1E3A4F]/15 bg-sky px-2 py-2 select-none sm:px-4 sm:py-2"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 sm:gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous offer"
          className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-chocolate/70 transition-colors hover:bg-black/5 hover:text-chocolate focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1E3A4F]"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Center Content */}
        <div
          role="region"
          aria-live="polite"
          className="flex min-w-0 flex-1 items-center justify-center"
        >
          <div
            key={current.id}
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center transition-all duration-300 sm:gap-x-3"
          >
            {/* Retro 3D Badge */}
            <span className="inline-flex shrink-0 items-center drop-shadow-sm">
              <RetroCta
                label={current.badge}
                theme="mustard-navy"
                size="xs"
                className="pointer-events-none"
              />
            </span>

            {/* Vintage Diamond Divider */}
            <span
              aria-hidden="true"
              className="hidden text-[10px] text-chocolate/40 sm:inline-block"
            >
              ✦
            </span>

            {/* Announcement Message */}
            <p className="font-sans text-[11px] font-medium tracking-[0.02em] text-chocolate sm:text-xs">
              {current.message}
            </p>

            {/* Retro 3D Action Link */}
            <span className="inline-flex shrink-0 items-center drop-shadow-sm">
              <RetroCta
                label={current.ctaText}
                href={current.ctaHref}
                theme="mustard-navy"
                size="xs"
              />
            </span>
          </div>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={next}
          aria-label="Next offer"
          className="group flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-chocolate/70 transition-colors hover:bg-black/5 hover:text-chocolate focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1E3A4F]"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="mt-1 flex items-center justify-center gap-1 sm:hidden">
        {ANNOUNCEMENTS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to offer ${idx + 1}`}
            className={`h-1 rounded-full transition-all ${
              idx === currentIndex
                ? "w-4 bg-[#1E3A4F]"
                : "w-1.5 bg-[#1E3A4F]/25 hover:bg-[#1E3A4F]/50"
            }`}
          />
        ))}
      </div>
    </aside>
  );
}
