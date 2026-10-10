import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CLOUDINARY } from "@/lib/catalog-images";

export function CollectionsHero() {
  return (
    <section className="relative overflow-hidden border-b border-chocolate/10 bg-canvas py-10 sm:py-16 lg:py-20">
      {/* Delicate background atmosphere wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-sage/10 blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collections" },
          ]}
        />

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Brand Story & Navigation */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-sage/20 bg-white/80 px-3 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-chocolate/80">
                Handcrafted Heirloom Catalog
              </span>
            </div>

            <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-chocolate sm:text-5xl lg:text-6xl">
              Treasures for the Nest
            </h1>

            <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-chocolate/80 sm:text-xl">
              Hand-crocheted baby blankets, comforting companions, keepsake frames,
              and nursery extras. Crafted with patient care in Jaipur using 100%
              breathable cotton yarn — designed to hold first smiles and become
              cherished family heirlooms.
            </p>

            {/* Artisan Highlights Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 rounded-sm border border-chocolate/10 bg-white/60 px-3.5 py-2">
                <span className="text-earth">✦</span>
                <span className="font-sans text-xs font-medium tracking-wide text-chocolate/90">
                  100% Pure Cotton Yarn
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-sm border border-chocolate/10 bg-white/60 px-3.5 py-2">
                <span className="text-earth">✦</span>
                <span className="font-sans text-xs font-medium tracking-wide text-chocolate/90">
                  Heirloom Keepsake Quality
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-sm border border-chocolate/10 bg-white/60 px-3.5 py-2">
                <span className="text-earth">✦</span>
                <span className="font-sans text-xs font-medium tracking-wide text-chocolate/90">
                  Gift-Ready Packaging
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <a
                href="#collections-grid"
                className="inline-flex items-center gap-2 bg-chocolate px-6 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-all hover:bg-earth"
              >
                <span>Browse All Collections</span>
                <span aria-hidden="true">↓</span>
              </a>

              <Link
                href="/collections/frame-it-your-way"
                className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] transition-colors hover:text-chocolate"
              >
                Personalize a Frame →
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Showcase Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-chocolate/10 bg-sky/20 shadow-md">
                <Image
                  src={CLOUDINARY.blanketsShopBanner}
                  alt="Mother and baby cuddled on a handmade crochet blanket"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/35 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 rounded-sm border border-white/20 bg-white/95 p-4 shadow-sm backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">
                  <p className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-sage">
                    Jaipur Atelier
                  </p>
                  <p className="mt-1 font-serif text-base font-medium text-chocolate">
                    Woven stitch-by-stitch for memories that last forever
                  </p>
                </div>
              </div>

              {/* Decorative Accent Pill Card */}
              <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-sm border border-chocolate/10 bg-canvas px-4 py-3 shadow-md sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky/30 text-xs text-chocolate">
                  🧶
                </span>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-chocolate/60">
                    Artisanal Standard
                  </p>
                  <p className="font-sans text-xs font-medium text-chocolate">
                    Safe for Sensitive Skin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
