"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/hooks/useSearch";
import { formatInr, productHref, collectionHref } from "@/lib/money";
import type { CategorySummary } from "@/lib/types";

const POPULAR_SEARCH_TERMS = [
  "Bed Time Buddies",
  "Butter Cup Bliss",
  "Cozy Cub",
  "Dream Keeper",
  "Lavender Bliss",
  "Rainbow Nest",
  "Tiny Paws",
  "Crochet Lion Toy",
  "Crochet Bear Toy",
  "Crochet Pilot Bear",
  "Crochet Girl Doll",
  "Crochet Boy Doll",
  "Sunny Sam Dog Toy",
  "Cloud Nest Frame",
  "Little Roots Frame",
  "Memory Nest Frame",
  "Little Curve Frame",
  "Cotton Candy Bunny Keychain",
  "Crochet Tea Coasters",
  "Donkey Keychain",
  "Giraffe Keychain",
];

type SearchSuggestionsDropdownProps = {
  isOpen: boolean;
  query: string;
  categories: CategorySummary[];
  onSelectSuggestion: (term: string) => void;
  onSelectCategory?: (slug: string) => void;
  onClose: () => void;
};

export function SearchSuggestionsDropdown({
  isOpen,
  query,
  categories,
  onSelectSuggestion,
  onSelectCategory,
  onClose,
}: SearchSuggestionsDropdownProps) {
  const trimmed = query.trim().toLowerCase();
  const { data, isFetching } = useSearch({ query: trimmed });

  if (!isOpen) return null;

  const matchingCategories = trimmed
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.slug.toLowerCase().includes(trimmed),
      )
    : [];

  const matchingKeywords = trimmed
    ? POPULAR_SEARCH_TERMS.filter((term) =>
        term.toLowerCase().includes(trimmed),
      ).slice(0, 4)
    : POPULAR_SEARCH_TERMS.slice(0, 5);

  const products = (data?.products ?? []).slice(0, 4);
  const totalResults = data?.pagination?.total ?? products.length;

  return (
    <div
      onMouseDown={(e) => {
        // Prevent input blur when clicking inside the dropdown
        e.preventDefault();
      }}
      className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-sm border border-chocolate/15 bg-white shadow-xl backdrop-blur-md"
    >
      <div className="max-h-[min(80vh,30rem)] overflow-y-auto divide-y divide-chocolate/10">
        {/* 1. Matching Categories Section */}
        {matchingCategories.length > 0 && (
          <div className="p-3 bg-canvas/40">
            <p className="px-2 pb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-chocolate/50">
              Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchingCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={collectionHref(cat.slug)}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-full border border-chocolate/10 bg-white px-3 py-1 font-sans text-xs text-chocolate transition-colors hover:border-earth/40 hover:bg-earth/5 hover:text-earth"
                >
                  <span className="text-[10px] text-sage">📁</span>
                  <span>{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span className="text-[10px] text-chocolate/40">
                      ({cat.productCount})
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 2. Keyword Suggestions */}
        {matchingKeywords.length > 0 && (
          <div className="p-3">
            <p className="px-2 pb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-chocolate/50">
              {trimmed ? "Suggestions" : "Trending Searches"}
            </p>
            <ul className="space-y-0.5">
              {matchingKeywords.map((term) => (
                <li key={term}>
                  <button
                    type="button"
                    onClick={() => onSelectSuggestion(term)}
                    className="flex w-full items-center gap-2.5 rounded-xs px-2.5 py-1.5 text-left font-sans text-xs text-chocolate transition-colors hover:bg-canvas hover:text-earth"
                  >
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-chocolate/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                    <span>{term}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Live Product Matches */}
        {trimmed.length >= 2 && (
          <div className="p-3">
            <div className="flex items-center justify-between px-2 pb-2">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-chocolate/50">
                Products in the Nest
              </p>
              {isFetching && (
                <span className="font-sans text-[10px] text-sage animate-pulse">
                  Searching…
                </span>
              )}
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {products.map((product) => {
                  const categoryName =
                    typeof product.category === "string"
                      ? product.category
                      : product.category?.name ?? "";
                  const thumb = product.images?.[0] ?? "/logo.png";

                  return (
                    <Link
                      key={product.id}
                      href={productHref(product.slug)}
                      onClick={onClose}
                      className="group flex items-center gap-3 rounded-xs border border-chocolate/5 bg-white p-2 transition-all hover:border-earth/30 hover:bg-canvas"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xs bg-sky/20">
                        <Image
                          src={thumb}
                          alt={product.imageAlt || product.name}
                          fill
                          sizes="48px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {categoryName && (
                          <p className="font-sans text-[9px] font-medium uppercase tracking-wider text-sage">
                            {categoryName}
                          </p>
                        )}
                        <p className="truncate font-serif text-sm font-medium text-chocolate group-hover:text-earth">
                          {product.name}
                        </p>
                        <p className="font-sans text-xs font-medium text-chocolate/80">
                          {formatInr(product.price)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : !isFetching ? (
              <p className="px-2 py-1 font-serif text-xs text-chocolate/60">
                No products found matching “{query}”. Press Enter to search all.
              </p>
            ) : null}
          </div>
        )}

        {/* 4. Footer CTA: View All Results */}
        {trimmed.length >= 2 && (
          <div className="bg-canvas/60 p-2.5 text-center">
            <button
              type="button"
              onClick={() => onSelectSuggestion(query)}
              className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-4 transition-colors hover:text-chocolate"
            >
              View all {totalResults > 0 ? `${totalResults} ` : ""}results for “{query}” →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
