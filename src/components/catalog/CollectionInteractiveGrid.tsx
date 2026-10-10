"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ProductWithCategory } from "@/lib/types";
import type { CollectionEditorial } from "@/lib/collection-editorial-data";

type ProductGridItem = Pick<
  ProductWithCategory,
  "id" | "slug" | "name" | "price" | "images" | "imageAlt" | "category"
>;

type CollectionInteractiveGridProps = {
  products: ProductGridItem[];
  editorial?: CollectionEditorial;
  collectionSlug: string;
};

export function CollectionInteractiveGrid({
  products,
  editorial,
  collectionSlug,
}: CollectionInteractiveGridProps) {
  const [sortOrder, setSortOrder] = useState<"featured" | "price-asc" | "price-desc" | "title">("featured");
  const [selectedTag, setSelectedTag] = useState<string>("All Pieces");

  const filterTags = editorial?.filterTags ?? ["All Pieces"];

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Filter by tag
    if (selectedTag === "Under ₹2,500") {
      list = list.filter((p) => p.price < 2500);
    } else if (selectedTag === "Under ₹1,000") {
      list = list.filter((p) => p.price < 1000);
    } else if (selectedTag === "Bestsellers") {
      // First 50% or products marked
      list = list.slice(0, Math.max(2, Math.ceil(list.length * 0.6)));
    } else if (selectedTag === "Coaster Sets" || selectedTag === "Sets") {
      list = list.filter((p) => p.name.toLowerCase().includes("coaster") || p.name.toLowerCase().includes("set"));
    } else if (selectedTag === "Keychains & Charms") {
      list = list.filter((p) => p.name.toLowerCase().includes("keychain") || p.name.toLowerCase().includes("charm"));
    }

    // Sort
    if (sortOrder === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "title") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, selectedTag, sortOrder]);

  return (
    <div className="space-y-8">
      {/* Interactive Toolbar */}
      <div className="flex flex-col gap-5 border-b border-chocolate/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-3.5 py-1.5 font-sans text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-chocolate text-canvas shadow-xs"
                    : "bg-white text-chocolate/70 border border-chocolate/10 hover:border-chocolate/30 hover:text-chocolate"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Sort & Count Controls */}
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="font-sans text-xs font-medium text-chocolate/60">
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "piece" : "pieces"}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="sr-only">
              Sort pieces
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="appearance-none rounded-lg border border-chocolate/15 bg-white py-1.5 pl-3 pr-8 font-sans text-xs font-medium text-chocolate focus:border-earth focus:outline-none"
              >
                <option value="featured">Sort: Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title">Alphabetical</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-chocolate/60">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid with Asymmetric Artisanal Vignette */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-chocolate/20 bg-white/50 py-16 text-center">
          <p className="font-serif text-lg text-chocolate/70">
            No pieces match the selected filter.
          </p>
          <button
            type="button"
            onClick={() => setSelectedTag("All Pieces")}
            className="mt-4 font-sans text-xs font-semibold uppercase tracking-wider text-earth underline underline-offset-4"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filteredAndSortedProducts.map((product, index) => {
            // At index 2, if we have enough items and vignette exists, insert the Asymmetric Artisanal Vignette Card
            const showVignette = index === 2 && editorial?.vignette;

            return (
              <div key={product.id} className="contents">
                {showVignette ? (
                  <div className="col-span-2 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#f8f5ee] to-[#ece5d8] p-6 sm:p-8 ring-1 ring-chocolate/10 shadow-[0_2px_12px_-3px_rgba(75,50,34,0.04)]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-earth" />
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-earth">
                          {editorial.vignette.subtitle}
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-2xl font-medium leading-tight text-chocolate sm:text-3xl text-balance">
                        {editorial.vignette.title}
                      </h3>
                      <p className="mt-3 font-serif text-sm leading-relaxed text-chocolate/80 sm:text-base">
                        {editorial.vignette.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-end justify-between border-t border-chocolate/10 pt-4">
                      <div>
                        <p className="font-sans text-[10px] uppercase tracking-wider text-chocolate/55">
                          {editorial.vignette.metricLabel}
                        </p>
                        <p className="mt-0.5 font-serif text-2xl font-semibold text-chocolate">
                          {editorial.vignette.metricValue}
                        </p>
                      </div>
                      <span className="font-sans text-[11px] font-medium text-earth/90 italic">
                        {editorial.vignette.quoteAuthor ?? "Jaipur Atelier"}
                      </span>
                    </div>
                  </div>
                ) : null}

                <ProductCard product={product} priority={index < 4} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
