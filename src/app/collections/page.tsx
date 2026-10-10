import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { CollectionsHero } from "@/components/catalog/CollectionsHero";
import { CollectionsCategoryNav } from "@/components/catalog/CollectionsCategoryNav";
import { CollectionOverviewCard } from "@/components/catalog/CollectionOverviewCard";
import { CollectionsCustomizerBanner } from "@/components/catalog/CollectionsCustomizerBanner";
import { CollectionsPromise } from "@/components/catalog/CollectionsPromise";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { listCategoriesWithProducts } from "@/lib/catalog";
import { collectionHref } from "@/lib/money";

export const metadata: Metadata = {
  title: "Shop All Collections — Handcrafted Heirlooms | Sky n Soul",
  description:
    "Explore our complete artisanal catalog: hand-crocheted baby blankets, soft animal companions, keepsake frames, customizable memory gifts, and nursery extras.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const categories = await listCategoriesWithProducts(4);

  const blankets = categories.find((c) => c.slug === "blankets");
  const toys = categories.find((c) => c.slug === "toys");
  const frames = categories.find((c) => c.slug === "frames");
  const frameItYourWay = categories.find((c) => c.slug === "frame-it-your-way");
  const littleExtras = categories.find((c) => c.slug === "little-extras");

  return (
    <SiteShell>
      {/* 1. Editorial Hero Section */}
      <CollectionsHero />

      {/* 2. Interactive Quick Jump Sub-Navigation */}
      <CollectionsCategoryNav />

      {/* 3. The 5 Corners of the Nest — Category Overview Gateway */}
      <section
        id="collections-grid"
        className="scroll-mt-20 border-b border-chocolate/10 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                Discover By Category
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-chocolate sm:text-4xl">
                The Five Corners of the Nest
              </h2>
              <p className="mt-2 max-w-xl font-serif text-lg leading-relaxed text-chocolate/75">
                Every collection is shaped with organic care and timeless heirloom aesthetics.
              </p>
            </div>
            <p className="font-sans text-xs uppercase tracking-wider text-chocolate/50">
              Handmade in Jaipur · Shipped Pan-India
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((category) => (
              <CollectionOverviewCard
                key={category.id}
                category={category}
                isCustomizer={category.slug === "frame-it-your-way"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Category Showcase 1: Blankets */}
      {blankets && (
        <section
          id="blankets"
          className="scroll-mt-20 border-b border-chocolate/10 bg-canvas px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  01 / Nursery Comfort
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
                  Handcrafted Baby Blankets
                </h2>
                <p className="mt-2 max-w-2xl font-serif text-base leading-relaxed text-chocolate/75 sm:text-lg">
                  {blankets.description}
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href={collectionHref("blankets")}
                  className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] transition-colors hover:text-chocolate"
                >
                  View All Blankets ({blankets.productCount}) →
                </Link>
              </div>
            </div>

            <ProductGrid products={blankets.products} />
          </div>
        </section>
      )}

      {/* 5. Category Showcase 2: Toys */}
      {toys && (
        <section
          id="toys"
          className="scroll-mt-20 border-b border-chocolate/10 bg-white px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  02 / Playful Companions
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
                  Soft Crochet Toys
                </h2>
                <p className="mt-2 max-w-2xl font-serif text-base leading-relaxed text-chocolate/75 sm:text-lg">
                  {toys.description}
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href={collectionHref("toys")}
                  className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] transition-colors hover:text-chocolate"
                >
                  View All Toys ({toys.productCount}) →
                </Link>
              </div>
            </div>

            <ProductGrid products={toys.products} />
          </div>
        </section>
      )}

      {/* 6. Feature Intermission: Frame It Your Way Interactive Studio */}
      <CollectionsCustomizerBanner />

      {/* 7. Category Showcase 3: Frames */}
      {frames && (
        <section
          id="frames"
          className="scroll-mt-20 border-b border-chocolate/10 bg-white px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  03 / Timeless Keepsakes
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
                  Memory & Milestone Frames
                </h2>
                <p className="mt-2 max-w-2xl font-serif text-base leading-relaxed text-chocolate/75 sm:text-lg">
                  {frames.description}
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href={collectionHref("frames")}
                  className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] transition-colors hover:text-chocolate"
                >
                  View All Frames ({frames.productCount}) →
                </Link>
              </div>
            </div>

            <ProductGrid products={frames.products} />
          </div>
        </section>
      )}

      {/* 8. Category Showcase 4: Little Extras */}
      {littleExtras && (
        <section
          id="little-extras"
          className="scroll-mt-20 border-b border-chocolate/10 bg-canvas px-5 py-16 sm:px-8 sm:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  04 / Little Delights
                </p>
                <h2 className="mt-2 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
                  Keychains & Little Extras
                </h2>
                <p className="mt-2 max-w-2xl font-serif text-base leading-relaxed text-chocolate/75 sm:text-lg">
                  {littleExtras.description}
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href={collectionHref("little-extras")}
                  className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] transition-colors hover:text-chocolate"
                >
                  View All Little Extras ({littleExtras.productCount}) →
                </Link>
              </div>
            </div>

            <ProductGrid products={littleExtras.products} />
          </div>
        </section>
      )}

      {/* 9. Artisan Philosophy & Gifting Concierge */}
      <CollectionsPromise />
    </SiteShell>
  );
}
