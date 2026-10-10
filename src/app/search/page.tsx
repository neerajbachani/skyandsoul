import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchContent } from "@/components/catalog/SearchContent";
import { SiteShell } from "@/components/layout/SiteShell";
import { listCategories, listProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Search Catalog — Handcrafted Heirlooms | Sky n Soul",
  description:
    "Search handcrafted crochet baby blankets, nursery companions, keepsake frames, and everyday extras from Sky n Soul.",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", category = "" } = await searchParams;

  const [categories, popular] = await Promise.all([
    listCategories(),
    listProducts({ featured: true, limit: 4 }),
  ]);

  return (
    <SiteShell>
      <Suspense
        fallback={
          <section className="bg-canvas px-5 py-24 sm:px-8">
            <div className="mx-auto max-w-7xl animate-pulse">
              <div className="h-4 w-24 bg-chocolate/10" />
              <div className="mt-4 h-10 w-72 bg-chocolate/10" />
            </div>
          </section>
        }
      >
        <SearchContent
          key={`${q}-${category}`}
          initialQuery={q}
          initialCategory={category}
          categories={categories}
          popularProducts={popular.products}
        />
      </Suspense>
    </SiteShell>
  );
}
