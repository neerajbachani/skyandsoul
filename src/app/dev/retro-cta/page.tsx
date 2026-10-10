"use client";

import { useState } from "react";
import Link from "next/link";
import { RetroCta, RETRO_THEMES, RetroSizeKey, RetroThemeKey } from "@/components/ui/retro-cta";

const THEME_SECTIONS: Array<{
  theme: RetroThemeKey;
  label: string;
  sub: string;
  bgHex: string;
  bgClass: string;
  description: string;
}> = [
  {
    theme: "mustard-navy",
    label: "Mustard & Navy",
    sub: "For blue / Sky (#C3D4E4) / cobalt backgrounds",
    bgHex: "#C3D4E4",
    bgClass: "bg-[#C3D4E4]",
    description: "Fill: #E8A93A | Shadow: #1E3A4F",
  },
  {
    theme: "cream-chocolate",
    label: "Cream & Chocolate",
    sub: "For sage (#889A6F) and deep green backgrounds",
    bgHex: "#889A6F",
    bgClass: "bg-[#889A6F]",
    description: "Fill: #FAFAF8 | Shadow: #4B3222",
  },
  {
    theme: "chocolate-sky",
    label: "Chocolate & Sky",
    sub: "For Canvas (#FAFAF8) and light backgrounds",
    bgHex: "#FAFAF8",
    bgClass: "bg-[#FAFAF8] border border-chocolate/15",
    description: "Fill: #4B3222 | Shadow: #C3D4E4",
  },
  {
    theme: "mustard-chocolate",
    label: "Mustard & Chocolate",
    sub: "For warm earth backgrounds (#80592C)",
    bgHex: "#80592C",
    bgClass: "bg-[#80592C]",
    description: "Fill: #E8A93A | Shadow: #4B3222",
  },
  {
    theme: "white-rust",
    label: "White & Rust",
    sub: "For photo overlays / dark backgrounds",
    bgHex: "#2F1E14",
    bgClass: "bg-[#2F1E14]",
    description: "Fill: #FFFFFF | Shadow: #A0482A",
  },
];

const SAMPLE_LABELS = [
  "Key Chains",
  "Frames",
  "Coasters",
  "Toys",
  "Blankets",
];

export default function RetroCtaDemoPage() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  const handleClick = (name: string) => {
    setClickCount((c) => c + 1);
    setLastClicked(name);
  };

  return (
    <main className="min-h-screen bg-[#F5F2EB] px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <header className="border-b border-chocolate/15 pb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-chocolate sm:text-4xl">
                RetroCta Design System & Showcase
              </h1>
              <p className="mt-2 text-sm text-chocolate/80">
                Vintage 3D block-lettering call-to-action inspired by traditional Indian hand-painted shop signage and retro poster typography.
              </p>
            </div>
            <Link
              href="/"
              className="mt-4 inline-flex items-center text-xs font-medium uppercase tracking-wider text-earth hover:underline sm:mt-0"
            >
              ← Back to store
            </Link>
          </div>

          {/* Interactive Status Indicator */}
          {lastClicked ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-sage/20 px-4 py-1.5 text-xs font-medium text-chocolate">
              <span>Pressed: <strong>{lastClicked}</strong></span>
              <span className="text-chocolate/50">•</span>
              <span>Total Button Clicks: {clickCount}</span>
            </div>
          ) : null}
        </header>

        {/* 1. All Themes on Matching Backgrounds */}
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-chocolate">
              1. Color Themes on Matching Backgrounds
            </h2>
            <p className="text-xs uppercase tracking-wider text-chocolate/70">
              Each theme calibrated to its intended background palette
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {THEME_SECTIONS.map((item, idx) => {
              const label = SAMPLE_LABELS[idx % SAMPLE_LABELS.length];
              return (
                <div
                  key={item.theme}
                  className={`flex flex-col justify-between rounded-2xl p-8 shadow-sm transition-shadow hover:shadow-md ${item.bgClass}`}
                >
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <RetroCta
                      label={label}
                      theme={item.theme}
                      size="lg"
                      href={`/collections/${label.toLowerCase().replace(" ", "-")}`}
                    />
                  </div>

                  <div className="mt-4 border-t border-black/10 pt-4 text-xs">
                    <div className="font-semibold text-chocolate">{item.label}</div>
                    <div className="text-[11px] opacity-75">{item.sub}</div>
                    <div className="mt-1 font-mono text-[10px] opacity-60">
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Fluid Sizes */}
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-chocolate">
              2. Scale Hierarchy (xs, sm, md, lg, xl)
            </h2>
            <p className="text-xs uppercase tracking-wider text-chocolate/70">
              Fluid sizing with clamp() and scaled extrusion depth (xs: 2, sm: 3, md: 4, lg: 6, xl: 8)
            </p>
          </div>

          <div className="space-y-4 rounded-2xl bg-[#C3D4E4] p-8">
            {(["xs", "sm", "md", "lg", "xl"] as RetroSizeKey[]).map((size) => (
              <div
                key={size}
                className="flex flex-col items-start justify-between gap-3 border-b border-[#1E3A4F]/15 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <div className="w-24 shrink-0 font-mono text-xs uppercase tracking-wider text-[#1E3A4F]">
                  Size {size}
                </div>
                <div className="flex-1">
                  <RetroCta
                    label="Key Chains"
                    size={size}
                    theme="mustard-navy"
                    href="/collections/key-chains"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Stacked Eyebrow Variant */}
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-chocolate">
              3. Stacked Headline with Eyebrow
            </h2>
            <p className="text-xs uppercase tracking-wider text-chocolate/70">
              Stacked small uppercase line (45% scale) over chunky primary text with merged aria-label
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#889A6F] p-8 text-center">
              <RetroCta
                eyebrow="Shop"
                label="Key Chains"
                theme="cream-chocolate"
                size="lg"
                href="/collections/key-chains"
              />
              <span className="mt-4 text-[11px] uppercase tracking-wider text-white/80">
                cream-chocolate • eyebrow + label
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#C3D4E4] p-8 text-center">
              <RetroCta
                eyebrow="Explore"
                label="Frames"
                theme="mustard-navy"
                size="lg"
                href="/collections/frames"
              />
              <span className="mt-4 text-[11px] uppercase tracking-wider text-[#1E3A4F]/80">
                mustard-navy • eyebrow + label
              </span>
            </div>
          </div>
        </section>

        {/* 4. Underline / Divider Variant */}
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-chocolate">
              4. Ornate Vintage Underline Divider
            </h2>
            <p className="text-xs uppercase tracking-wider text-chocolate/70">
              Rounded 3px divider with rotated diamond terminals in the fill color
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#80592C] p-8 text-center">
              <RetroCta
                label="Blankets"
                theme="mustard-chocolate"
                size="md"
                underline
                href="/collections/blankets"
              />
              <span className="mt-4 text-[11px] uppercase tracking-wider text-white/80">
                Underline (md)
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#C3D4E4] p-8 text-center">
              <RetroCta
                eyebrow="Shop"
                label="Frames"
                theme="mustard-navy"
                size="lg"
                underline
                href="/collections/frames"
              />
              <span className="mt-4 text-[11px] uppercase tracking-wider text-[#1E3A4F]/80">
                Eyebrow + Underline (lg)
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FAFAF8] p-8 text-center border border-chocolate/10">
              <RetroCta
                label="Coasters"
                theme="chocolate-sky"
                size="md"
                underline
                href="/collections/coasters"
              />
              <span className="mt-4 text-[11px] uppercase tracking-wider text-chocolate/80">
                Underline (md)
              </span>
            </div>
          </div>
        </section>

        {/* 5. Link vs Button vs Static Span Variants */}
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-chocolate">
              5. Interactive Polymorphism: Link, Button & Static Span
            </h2>
            <p className="text-xs uppercase tracking-wider text-chocolate/70">
              Automatically selects Link (when href), Button (when onClick), or Span (display only)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Link Variant */}
            <div className="flex flex-col items-center justify-between rounded-2xl bg-[#889A6F] p-6 text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-white">
                Next.js &lt;Link&gt;
              </div>
              <div className="py-6">
                <RetroCta
                  label="Toys"
                  href="/collections/toys"
                  theme="cream-chocolate"
                  size="md"
                />
              </div>
              <p className="text-[11px] text-white/80">
                Has href • Navigates on click
              </p>
            </div>

            {/* Button Variant */}
            <div className="flex flex-col items-center justify-between rounded-2xl bg-[#FAFAF8] p-6 text-center border border-chocolate/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-chocolate">
                HTML &lt;button&gt;
              </div>
              <div className="py-6">
                <RetroCta
                  label="Coasters"
                  onClick={() => handleClick("Coasters")}
                  theme="chocolate-sky"
                  size="md"
                />
              </div>
              <p className="text-[11px] text-chocolate/70">
                Has onClick • Triggers state ({clickCount} clicks)
              </p>
            </div>

            {/* Span Variant */}
            <div className="flex flex-col items-center justify-between rounded-2xl bg-[#C3D4E4] p-6 text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#1E3A4F]">
                Static &lt;span&gt;
              </div>
              <div className="py-6">
                <RetroCta
                  label="Blankets"
                  theme="mustard-navy"
                  size="md"
                />
              </div>
              <p className="text-[11px] text-[#1E3A4F]/70">
                No href/onClick • Non-interactive badge
              </p>
            </div>
          </div>
        </section>

        {/* 6. Alignment Variants */}
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-chocolate">
              6. Alignment Options (left, center, right)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl bg-[#889A6F] p-8">
            <div className="flex flex-col">
              <span className="mb-2 font-mono text-[11px] text-white/70">align=&quot;left&quot;</span>
              <RetroCta
                eyebrow="Shop"
                label="Frames"
                theme="cream-chocolate"
                size="sm"
                align="left"
                underline
              />
            </div>
            <div className="flex flex-col">
              <span className="mb-2 font-mono text-[11px] text-white/70 text-center">align=&quot;center&quot;</span>
              <RetroCta
                eyebrow="Shop"
                label="Toys"
                theme="cream-chocolate"
                size="sm"
                align="center"
                underline
              />
            </div>
            <div className="flex flex-col">
              <span className="mb-2 font-mono text-[11px] text-white/70 text-right">align=&quot;right&quot;</span>
              <RetroCta
                eyebrow="Shop"
                label="Coasters"
                theme="cream-chocolate"
                size="sm"
                align="right"
                underline
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
