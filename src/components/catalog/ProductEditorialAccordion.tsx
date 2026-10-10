"use client";

import { useState } from "react";
import { HANDMADE_NOTE } from "@/lib/catalog-content";

type ProductEditorialAccordionProps = {
  description: string;
  features: string[];
  careInstructions: string[];
  material?: string | null;
  size?: string | null;
  ageRange?: string | null;
};

export function ProductEditorialAccordion({
  description,
  features,
  careInstructions,
  material,
  size,
  ageRange,
}: ProductEditorialAccordionProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    story: true,
    specs: true,
    care: false,
    gifting: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="mt-10 divide-y divide-chocolate/10 border-y border-chocolate/10">
      {/* 1. Artisanal Story & Features */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle("story")}
          className="flex w-full items-center justify-between py-2 text-left transition-colors hover:text-earth"
          aria-expanded={openSections.story}
        >
          <span className="font-serif text-xl font-medium text-chocolate">
            The Artisanal Story & Details
          </span>
          <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-chocolate/15 text-xs text-chocolate/70">
            {openSections.story ? "−" : "+"}
          </span>
        </button>

        {openSections.story && (
          <div className="pt-2 pb-4 space-y-4 font-serif text-base leading-relaxed text-chocolate/80">
            {description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            {features.length > 0 && (
              <div className="mt-4 pt-3">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-sage">
                  Craft Highlights
                </p>
                <ul className="mt-2.5 space-y-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-chocolate/85">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Dimensions & Specifications */}
      {(material || size || ageRange) && (
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle("specs")}
            className="flex w-full items-center justify-between py-2 text-left transition-colors hover:text-earth"
            aria-expanded={openSections.specs}
          >
            <span className="font-serif text-xl font-medium text-chocolate">
              Specifications & Dimensions
            </span>
            <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-chocolate/15 text-xs text-chocolate/70">
              {openSections.specs ? "−" : "+"}
            </span>
          </button>

          {openSections.specs && (
            <div className="pt-3 pb-4">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {material && (
                  <div className="rounded-xl bg-canvas p-3 border border-chocolate/5">
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-chocolate/50">
                      Material
                    </dt>
                    <dd className="mt-1 font-serif text-sm font-medium text-chocolate">
                      {material}
                    </dd>
                  </div>
                )}
                {size && (
                  <div className="rounded-xl bg-canvas p-3 border border-chocolate/5">
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-chocolate/50">
                      Dimensions
                    </dt>
                    <dd className="mt-1 font-serif text-sm font-medium text-chocolate">
                      {size}
                    </dd>
                  </div>
                )}
                {ageRange && (
                  <div className="rounded-xl bg-canvas p-3 border border-chocolate/5">
                    <dt className="font-sans text-[10px] font-semibold uppercase tracking-wider text-chocolate/50">
                      Recommended Age
                    </dt>
                    <dd className="mt-1 font-serif text-sm font-medium text-chocolate">
                      {ageRange}
                    </dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 font-sans text-[11px] text-chocolate/50 italic">
                * Handcrafted measurements may vary gently by 1–2 cm, celebrating unique artisan hands.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Heirloom Care Guide */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle("care")}
          className="flex w-full items-center justify-between py-2 text-left transition-colors hover:text-earth"
          aria-expanded={openSections.care}
        >
          <span className="font-serif text-xl font-medium text-chocolate">
            Care & Preservation Guide
          </span>
          <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-chocolate/15 text-xs text-chocolate/70">
            {openSections.care ? "−" : "+"}
          </span>
        </button>

        {openSections.care && (
          <div className="pt-2 pb-4 space-y-3 font-serif text-sm leading-relaxed text-chocolate/80">
            {careInstructions.length > 0 ? (
              <ul className="space-y-2">
                {careInstructions.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-earth" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Hand wash gently with mild baby detergent in cold water. Lay flat in shade to dry.</p>
            )}

            <div className="mt-4 rounded-xl border border-earth/20 bg-earth/5 p-4 font-serif text-xs italic text-chocolate/75 leading-normal">
              {HANDMADE_NOTE}
            </div>
          </div>
        )}
      </div>

      {/* 4. Luxury Gifting & Packaging */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle("gifting")}
          className="flex w-full items-center justify-between py-2 text-left transition-colors hover:text-earth"
          aria-expanded={openSections.gifting}
        >
          <span className="font-serif text-xl font-medium text-chocolate">
            Heirloom Packaging & Gifting
          </span>
          <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-chocolate/15 text-xs text-chocolate/70">
            {openSections.gifting ? "−" : "+"}
          </span>
        </button>

        {openSections.gifting && (
          <div className="pt-2 pb-4 space-y-2 font-serif text-sm leading-relaxed text-chocolate/80">
            <p>
              Every Sky n Soul order arrives wrapped in our signature unbleached muslin dust bag, hand-tied with pure cotton ribbon to preserve tenderness.
            </p>
            <p>
              Sending this as a gift for a new mom or baby shower? You can include a custom handwritten blessing note card during checkout at zero extra charge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
