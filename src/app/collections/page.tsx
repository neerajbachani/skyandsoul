import type { Metadata } from "next";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CollectionHero } from "@/components/catalog/CollectionHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { listCategories, listProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description:
    "Explore handmade blankets, crochet toys, frames, and little extras from Sky n Soul.",
};

export default async function CollectionsPage() {
  const [categories, featured] = await Promise.all([
    listCategories(),
    listProducts({ featured: true, limit: 8 }),
  ]);

  const shopCategories = categories.filter(
    (category) => category.slug !== "frame-it-your-way",
  );

  return (
    <SiteShell>
      <CollectionHero
        eyebrow="Shop"
        title="All Collections"
        description="Explore handmade blankets, soft companions, frames, and little extras — crafted for the moments that become forever."
      />

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              Browse
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate">
              Shop by Collection
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {shopCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              Featured
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate">
              From the Nest
            </h2>
          </div>
          <ProductGrid products={featured.products} />
        </div>
      </section>
    </SiteShell>
  );
}
