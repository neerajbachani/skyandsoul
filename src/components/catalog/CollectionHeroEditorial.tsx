import Image from "next/image";
import {
  CollectionHeroSlider,
  type CollectionHeroSlide,
} from "@/components/catalog/CollectionHeroSlider";
import type { CollectionEditorial } from "@/lib/collection-editorial-data";

type CollectionHeroEditorialProps = {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  slides?: readonly CollectionHeroSlide[];
  editorial?: CollectionEditorial;
};

export function CollectionHeroEditorial({
  title,
  description,
  image,
  imageAlt,
  slides,
  editorial,
}: CollectionHeroEditorialProps) {
  return (
    <section className="relative overflow-hidden border-b border-chocolate/10 bg-gradient-to-b from-[#f7f5f0] via-canvas to-canvas">
      {/* Subtle organic ambient radial light */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-sky/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-20 -left-20 h-80 w-80 rounded-full bg-sage/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Editorial Typography & Provenance */}
          <div className="lg:col-span-6 xl:col-span-7">
            {/* Roman Numeral & Subheading */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
                {editorial?.romanNumeral ?? "Sky n Soul Atelier"}
              </span>
              <span className="h-1 w-1 rounded-full bg-chocolate/30" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-chocolate/55">
                {editorial?.subheading ?? "Curated Collection"}
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="mt-4 font-serif text-4xl font-normal leading-[1.08] text-balance text-chocolate sm:text-5xl lg:text-6xl tracking-tight">
              {title}
            </h1>

            {/* Poetic Tagline & Description */}
            <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-chocolate/85 sm:text-xl">
              {editorial?.tagline ?? description}
            </p>

            {editorial?.storyNote && editorial.tagline ? (
              <p className="mt-3 max-w-2xl font-serif text-base italic leading-relaxed text-chocolate/70">
                {editorial.storyNote}
              </p>
            ) : null}

            {/* Craftsmanship Pills */}
            {editorial?.pills && editorial.pills.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2">
                {editorial.pills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-chocolate/10 bg-white/70 px-3 py-1 font-sans text-xs font-medium text-chocolate/80 backdrop-blur-sm shadow-xs"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-earth/70" />
                    {pill}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Craft Guarantee Footer */}
            <div className="mt-8 flex items-center gap-4 border-t border-chocolate/10 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-earth/10 text-earth font-serif text-sm font-semibold">
                JN
              </div>
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-chocolate">
                  Handcrafted in Jaipur
                </p>
                <p className="font-sans text-xs text-chocolate/60">
                  {editorial?.craftHighlight ?? "Artisanal quality for delicate beginnings"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Double-bezel Showcase Visual */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="relative rounded-3xl bg-white p-2.5 sm:p-3 shadow-[0_12px_36px_-8px_rgba(75,50,34,0.12)] ring-1 ring-chocolate/10">
              {slides && slides.length > 1 ? (
                <CollectionHeroSlider slides={slides} label={title} />
              ) : image ? (
                <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden rounded-2xl bg-canvas">
                  <Image
                    src={image}
                    alt={imageAlt ?? title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate/20 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-white/85 px-3 py-1.5 backdrop-blur-md">
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-chocolate">
                      Artisan Spotlight
                    </span>
                    <span className="font-sans text-[10px] text-chocolate/60">
                      Jaipur, Rajasthan
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
