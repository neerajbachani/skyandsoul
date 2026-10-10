"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/Button";
import {
  EDITORIAL_PRODUCTS,
  EDITORIAL_IMAGES,
  EDITORIAL_COPY,
  type EditorialBannerContent,
} from "@/lib/editorial-constants";
import { collectionHref, formatInr } from "@/lib/money";

export {
  EDITORIAL_PRODUCTS,
  EDITORIAL_IMAGES,
  EDITORIAL_COPY,
  type EditorialBannerContent,
};

const CATEGORY_CHIPS = [
  { label: "All Items", href: "/collections" },
  { label: "Blankets", href: collectionHref("blankets") },
  { label: "Toys", href: collectionHref("toys") },
  { label: "Frames", href: collectionHref("frames") },
  { label: "Accessories", href: collectionHref("little-extras") },
] as const;

const TRUST_METRICS = [
  {
    icon: (
      <svg className="h-4 w-4 text-earth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    label: "100% Organic Cotton",
    sub: "Certified baby-safe yarn",
  },
  {
    icon: (
      <svg className="h-4 w-4 text-earth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    ),
    label: "Master Artisan Made",
    sub: "Slow-crafted in India",
  },
  {
    icon: (
      <svg className="h-4 w-4 text-earth" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    label: "Pan-India Express",
    sub: "Free shipping & tracked",
  },
] as const;

export function EditorialBanner({ content }: { content: EditorialBannerContent }) {
  // Local state for active mobile tap view (0 = primary, 1 = secondary)
  const [activeViewOverrides, setActiveViewOverrides] = useState<Record<string, number>>({});

  const toggleCardView = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveViewOverrides((prev) => ({
      ...prev,
      [id]: prev[id] === 1 ? 0 : 1,
    }));
  };

  return (
    <section className="relative overflow-hidden border-y border-chocolate/[0.08] bg-[#fcfaf7] py-16 sm:py-24 lg:py-28">
      {/* Ambient background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-sky/25 blur-3xl" />
        <div className="absolute bottom-0 left-[-10%] h-80 w-80 rounded-full bg-sage/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          
          {/* Left Column: Editorial & Merchandising Story */}
          <div data-reveal className="space-y-7 lg:col-span-5">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sage/30 bg-sage/10 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
              <span>{content.eyebrow}</span>
            </div>

            {/* Editorial Heading */}
            <h2 className="font-serif text-3xl font-medium leading-[1.18] text-chocolate sm:text-4xl lg:text-[2.65rem]">
              {content.heading}
            </h2>

            {/* Descriptive Body */}
            <p className="font-serif text-lg leading-relaxed text-chocolate/80 sm:text-xl">
              {content.body}
            </p>

            {/* Category Quick Chips */}
            <div className="space-y-2.5 pt-1">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-chocolate/55">
                Explore Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_CHIPS.map((chip) => (
                  <Link
                    key={chip.label}
                    href={chip.href}
                    className="inline-flex items-center rounded-full border border-chocolate/12 bg-white px-3.5 py-1.5 font-sans text-xs font-medium text-chocolate/85 shadow-xs transition-all duration-200 hover:border-earth hover:bg-chocolate hover:text-white hover:shadow-sm"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-1 gap-3.5 border-t border-chocolate/10 pt-6 sm:grid-cols-3 sm:gap-2">
              {TRUST_METRICS.map((metric) => (
                <div key={metric.label} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-earth/10">
                    {metric.icon}
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold text-chocolate">
                      {metric.label}
                    </p>
                    <p className="font-sans text-[11px] text-chocolate/65">
                      {metric.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href={content.ctaHref} variant="filled" showArrow>
                {content.cta}
              </Button>
              <Link
                href="/collections"
                className="inline-flex items-center gap-1 font-sans text-xs font-medium uppercase tracking-[0.14em] text-chocolate/75 underline underline-offset-4 decoration-chocolate/30 transition-colors hover:text-earth hover:decoration-earth"
              >
                Browse Catalog
              </Link>
            </div>

            {/* Customer Rating Proof Badge */}
            <div className="flex items-center gap-3 border-t border-chocolate/10 pt-5">
              <div className="flex text-earth">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <p className="font-sans text-xs text-chocolate/80">
                <strong className="font-semibold text-chocolate">4.9/5 Rating</strong> from 350+ happy families across India
              </p>
            </div>
          </div>

          {/* Right Column: 2x2 Shoppable E-Commerce Products with Hover Swap */}
          <div data-reveal className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
              {EDITORIAL_PRODUCTS.map((fallbackProduct, index) => {
                const dynamicImage = content.images?.[index];
                const primarySrc = dynamicImage?.src || fallbackProduct.primaryImage.src;
                const primaryAlt = dynamicImage?.alt || fallbackProduct.primaryImage.alt;
                const primaryPos = dynamicImage?.objectPosition || fallbackProduct.primaryImage.objectPosition;

                const secondarySrc =
                  dynamicImage?.secondarySrc || fallbackProduct.secondaryImage.src;
                const secondaryAlt =
                  fallbackProduct.secondaryImage.alt || primaryAlt;
                const secondaryPos =
                  fallbackProduct.secondaryImage.objectPosition || "object-center";

                const productName = dynamicImage?.name || fallbackProduct.name;
                const productCategory = dynamicImage?.category || fallbackProduct.category;
                const productPrice = dynamicImage?.price ?? fallbackProduct.price;
                const originalPrice = dynamicImage?.originalPrice ?? fallbackProduct.originalPrice;
                const badge = dynamicImage?.badge || fallbackProduct.badge;
                const targetHref = dynamicImage?.href || fallbackProduct.href;

                const isMobileSwapped = activeViewOverrides[fallbackProduct.id] === 1;

                return (
                  <div
                    key={fallbackProduct.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-chocolate/10 bg-white p-2 shadow-xs transition-all duration-500 hover:-translate-y-1 hover:border-chocolate/25 hover:shadow-xl sm:p-3"
                  >
                    {/* Visual Image Container with Dual-Layer Animation */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-canvas">
                      <Link
                        href={targetHref}
                        className="absolute inset-0 z-0 block focus:outline-none"
                        aria-label={`View ${productName}`}
                      >
                        {/* Primary Image: Scales up and fades out on hover */}
                        <div
                          className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                            isMobileSwapped
                              ? "scale-105 opacity-0"
                              : "scale-100 opacity-100 group-hover:scale-105 group-hover:opacity-0"
                          }`}
                        >
                          <Image
                            src={primarySrc}
                            alt={primaryAlt}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 25vw"
                            className={`object-cover ${primaryPos}`}
                          />
                        </div>

                        {/* Secondary Image: Scales in and fades in on hover */}
                        <div
                          className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                            isMobileSwapped
                              ? "scale-100 opacity-100"
                              : "scale-105 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={secondarySrc}
                            alt={secondaryAlt}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 35vw, 25vw"
                            className={`object-cover ${secondaryPos}`}
                          />
                        </div>
                      </Link>

                      {/* Top Left Badge */}
                      {badge && (
                        <div className="pointer-events-none absolute left-2.5 top-2.5 z-10">
                          <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-wider text-chocolate shadow-xs backdrop-blur-md sm:text-[10px]">
                            {badge}
                          </span>
                        </div>
                      )}

                      {/* Top Right Quick-Action Pill */}
                      <Link
                        href={targetHref}
                        aria-label={`Quick view ${productName}`}
                        className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-chocolate shadow-xs backdrop-blur-md transition-all duration-300 hover:bg-chocolate hover:text-white active:scale-95 sm:h-8 sm:w-8"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </Link>

                      {/* Bottom Image Indicator & Mobile Toggle */}
                      <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-xs backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={(e) => toggleCardView(fallbackProduct.id, e)}
                          title="Toggle angle"
                          aria-label="Toggle product view angle"
                          className="flex items-center gap-1 text-[9px] font-sans font-medium uppercase tracking-wider text-chocolate"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                              isMobileSwapped
                                ? "bg-chocolate/30"
                                : "bg-chocolate group-hover:bg-chocolate/30"
                            }`}
                          />
                          <span
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                              isMobileSwapped
                                ? "bg-chocolate"
                                : "bg-chocolate/30 group-hover:bg-chocolate"
                            }`}
                          />
                          <span className="hidden sm:inline text-[9px] pl-0.5 text-chocolate/60">
                            Swap
                          </span>
                        </button>
                      </div>

                      {/* Hover Slide-Up "Quick Shop" Bar */}
                      <Link
                        href={targetHref}
                        className="absolute inset-x-2 bottom-2 z-10 hidden translate-y-3 items-center justify-center rounded-lg bg-chocolate/95 py-2 text-center font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-white opacity-0 shadow-md backdrop-blur-xs transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:bg-earth sm:flex"
                      >
                        <span>View Product</span>
                        <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </Link>
                    </div>

                    {/* Bottom Product Details */}
                    <div className="pt-2.5 sm:pt-3">
                      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-sage sm:text-[11px]">
                        {productCategory}
                      </p>
                      <h3 className="mt-0.5 truncate font-serif text-base font-medium text-chocolate transition-colors duration-200 group-hover:text-earth sm:text-lg">
                        <Link href={targetHref} className="hover:underline">
                          {productName}
                        </Link>
                      </h3>

                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-sans text-xs font-semibold text-chocolate sm:text-sm">
                          {formatInr(productPrice)}
                        </span>
                        {originalPrice && originalPrice > productPrice && (
                          <span className="font-sans text-[11px] text-chocolate/45 line-through sm:text-xs">
                            {formatInr(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </Reveal>
      </div>
    </section>
  );
}

