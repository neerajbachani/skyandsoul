"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SearchSuggestionsDropdown } from "@/components/catalog/SearchSuggestionsDropdown";
import { useSearch } from "@/hooks/useSearch";
import { collectionHref } from "@/lib/money";
import { SITE } from "@/lib/constants";
import type { CategorySummary, ProductWithCategory } from "@/lib/types";

const SUGGESTED_QUERIES = [
  "Bed Time Buddies",
  "Lion Toy",
  "Memory Nest",
  "Bunny Keychain",
  "Rainbow Nest",
  "Tea Coasters",
  "Cloud Nest",
];

type SearchContentProps = {
  initialQuery?: string;
  initialCategory?: string;
  categories: CategorySummary[];
  popularProducts: Array<
    Pick<
      ProductWithCategory,
      "id" | "slug" | "name" | "price" | "images" | "imageAlt" | "category"
    >
  >;
};

export function SearchContent({
  initialQuery = "",
  initialCategory = "",
  categories,
  popularProducts,
}: SearchContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? initialQuery;
  const urlCategory = searchParams.get("category") ?? initialCategory;

  const [draft, setDraft] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeQuery = urlQuery;
  const { data, isFetching, isError } = useSearch({
    query: activeQuery,
    category: selectedCategory || undefined,
  });

  function applySearch(newQuery: string, newCategory = selectedCategory) {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set("q", newQuery.trim());
    if (newCategory) params.set("category", newCategory);

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsDropdownOpen(false);
    applySearch(draft);
  }

  function handleSelectTag(tag: string) {
    setDraft(tag);
    setIsDropdownOpen(false);
    applySearch(tag);
  }

  function handleSelectCategory(catSlug: string) {
    const nextCategory = selectedCategory === catSlug ? "" : catSlug;
    setSelectedCategory(nextCategory);
    setIsDropdownOpen(false);
    applySearch(draft, nextCategory);
  }

  function handleClear() {
    setDraft("");
    setSelectedCategory("");
    setIsDropdownOpen(false);
    router.push("/search");
  }

  const isQueryActive = activeQuery.trim().length >= 2;
  const results = data?.products ?? [];
  const totalResults = data?.pagination?.total ?? results.length;

  const whatsappUrl = `https://wa.me/${SITE.phones[0].replace(/\+/g, "")}?text=${encodeURIComponent(
    `Hi Sky n Soul, I am searching for "${draft || "a gift"}" and would love some help finding the right piece!`,
  )}`;

  return (
    <section className="min-h-[80vh] bg-canvas py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Search" },
          ]}
        />

        {/* Search Header */}
        <div className="max-w-3xl">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Discover the Nest
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-chocolate sm:text-5xl">
            Search Our Heirloom Catalog
          </h1>
          <p className="mt-4 font-serif text-lg leading-relaxed text-chocolate/80">
            Find handcrafted crochet baby blankets, nursery animal companions,
            personalized keepsake frames, and everyday little extras.
          </p>
        </div>

        {/* Refined Artisanal Search Bar */}
        <div className="mt-8 max-w-3xl">
          <div ref={searchContainerRef} className="relative">
            <form
              onSubmit={handleSubmit}
              className="group flex flex-col gap-3 rounded-sm border border-chocolate/20 bg-white p-2 shadow-sm transition-all focus-within:border-earth focus-within:ring-2 focus-within:ring-earth/10 sm:flex-row sm:items-center sm:gap-2"
            >
              <div className="flex flex-1 items-center px-3">
                <svg
                  className="h-5 w-5 shrink-0 text-chocolate/50 transition-colors group-focus-within:text-earth"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.75}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
                <label htmlFor="search-input" className="sr-only">
                  Search products
                </label>
                <input
                  id="search-input"
                  type="search"
                  value={draft}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsDropdownOpen(false);
                    }
                  }}
                  placeholder="Search by name, category, or gift idea…"
                  autoComplete="off"
                  className="w-full bg-transparent px-3 py-2.5 font-sans text-sm text-chocolate placeholder:text-chocolate/40 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                />
                {draft && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraft("");
                      setIsDropdownOpen(false);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-chocolate/60 transition-colors hover:bg-chocolate/10 hover:text-chocolate"
                    aria-label="Clear input"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center bg-chocolate px-7 py-3 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-earth active:scale-[0.98]"
              >
                Search
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            <SearchSuggestionsDropdown
              isOpen={isDropdownOpen}
              query={draft}
              categories={categories}
              onSelectSuggestion={(term) => {
                setDraft(term);
                setIsDropdownOpen(false);
                applySearch(term);
              }}
              onSelectCategory={(slug) => {
                handleSelectCategory(slug);
                setIsDropdownOpen(false);
              }}
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>

          {/* Quick Suggestion Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-sans text-[11px] uppercase tracking-wider text-chocolate/55">
              Popular:
            </span>
            {SUGGESTED_QUERIES.map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => handleSelectTag(query)}
                className="rounded-full border border-chocolate/10 bg-white/70 px-3 py-1 font-sans text-xs text-chocolate/80 transition-all hover:border-earth/40 hover:bg-white hover:text-chocolate"
              >
                {query}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-chocolate/10 pt-4">
            <span className="font-sans text-[11px] uppercase tracking-wider text-chocolate/55">
              Filter by:
            </span>
            <button
              type="button"
              onClick={() => handleSelectCategory("")}
              className={`rounded-full px-3.5 py-1 font-sans text-xs uppercase tracking-wider transition-all ${
                !selectedCategory
                  ? "bg-chocolate text-white"
                  : "border border-chocolate/10 bg-white/70 text-chocolate/75 hover:bg-white hover:text-chocolate"
              }`}
            >
              All Categories
            </button>

            {categories
              .filter((c) => c.slug !== "frame-it-your-way")
              .map((category) => {
                const isSelected = selectedCategory === category.slug;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelectCategory(category.slug)}
                    className={`rounded-full px-3.5 py-1 font-sans text-xs uppercase tracking-wider transition-all ${
                      isSelected
                        ? "bg-chocolate text-white"
                        : "border border-chocolate/10 bg-white/70 text-chocolate/75 hover:bg-white hover:text-chocolate"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}

            <Link
              href="/collections/frame-it-your-way"
              className="inline-flex items-center gap-1 rounded-full border border-sage/40 bg-white/90 px-3.5 py-1 font-sans text-xs uppercase tracking-wider text-earth transition-colors hover:border-earth hover:text-chocolate"
            >
              <span>✦ Customizer</span>
            </Link>
          </div>
        </div>

        {/* Results / Empty / Discovery Section */}
        <div className="mt-14 border-t border-chocolate/10 pt-10">
          {isQueryActive ? (
            <div>
              {/* Status Header */}
              <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  {isFetching ? (
                    <p className="font-serif text-lg text-chocolate/70">
                      Searching the nest…
                    </p>
                  ) : isError ? (
                    <p className="font-serif text-lg text-brick">
                      Something went wrong loading search results. Please try again.
                    </p>
                  ) : (
                    <p className="font-serif text-xl font-medium text-chocolate">
                      {totalResults} {totalResults === 1 ? "piece" : "pieces"} found for “{activeQuery.trim()}”
                      {selectedCategory && (
                        <span className="text-chocolate/60">
                          {" "}in{" "}
                          {categories.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {(draft || selectedCategory) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="self-start font-sans text-xs uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] transition-colors hover:text-chocolate sm:self-auto"
                  >
                    Clear search & filters
                  </button>
                )}
              </div>

              {/* Product Grid or No-Match Box */}
              {!isFetching && results.length === 0 ? (
                <div className="rounded-sm border border-chocolate/10 bg-white p-8 text-center sm:p-14">
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                    No Direct Matches
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-chocolate sm:text-3xl">
                    No pieces matched “{activeQuery}”
                  </h3>
                  <p className="mx-auto mt-3 max-w-md font-serif text-base text-chocolate/70">
                    Try checking your spelling, using broader terms, or explore
                    popular heirloom favorites below.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="bg-chocolate px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-earth"
                    >
                      Clear Search
                    </button>
                    <Link
                      href="/collections"
                      className="border border-chocolate/20 bg-white px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-chocolate transition-colors hover:bg-canvas"
                    >
                      Browse All Collections
                    </Link>
                  </div>

                  {/* Fallback Recommendations */}
                  <div className="mt-14 border-t border-chocolate/10 pt-10 text-left">
                    <h4 className="font-serif text-2xl font-medium text-chocolate">
                      Beloved from the Nest
                    </h4>
                    <p className="mt-1 font-sans text-xs text-chocolate/60">
                      Pieces cherished by parents and loved ones
                    </p>
                    <div className="mt-6">
                      <ProductGrid products={popularProducts} />
                    </div>
                  </div>
                </div>
              ) : (
                <ProductGrid
                  products={results}
                  emptyMessage="No pieces matched that search."
                />
              )}
            </div>
          ) : (
            /* Initial Discovery State when query is empty or < 2 characters */
            <div>
              {/* Category Quick Gateways */}
              <div className="mb-14">
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  Browse by Collection
                </p>
                <h2 className="mt-2 font-serif text-2xl font-medium text-chocolate sm:text-3xl">
                  Explore Heirloom Categories
                </h2>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={collectionHref(category.slug)}
                      className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-sm border border-chocolate/10 bg-sky/20 p-4 transition-all hover:border-earth/30 hover:shadow-md"
                    >
                      <Image
                        src={category.image}
                        alt={category.imageAlt}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/70 via-chocolate/20 to-transparent" />
                      <div className="relative z-10">
                        <p className="font-serif text-lg font-medium text-white">
                          {category.name}
                        </p>
                        <p className="font-sans text-[10px] uppercase tracking-wider text-white/80">
                          {category.productCount ? `${category.productCount} pieces` : "Explore"} →
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular from the Nest */}
              <div>
                <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                      Featured Pieces
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-medium text-chocolate sm:text-3xl">
                      Treasures from the Nest
                    </h2>
                  </div>
                  <Link
                    href="/collections"
                    className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] transition-colors hover:text-chocolate"
                  >
                    View All Collections →
                  </Link>
                </div>

                <ProductGrid products={popularProducts} />
              </div>
            </div>
          )}

          {/* Concierge & Bespoke Request Callout */}
          <div className="mt-20 rounded-sm border border-chocolate/10 bg-white p-6 sm:p-10">
            <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div>
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                  Custom Orders & Gifting
                </p>
                <h3 className="mt-1 font-serif text-2xl font-medium text-chocolate sm:text-3xl">
                  Looking for a piece that is not listed?
                </h3>
                <p className="mt-2 max-w-xl font-sans text-xs leading-relaxed text-chocolate/75">
                  Our Jaipur atelier lovingly accommodates custom crochet colorways,
                  special mascot requests, and personalized newborn frames.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-chocolate px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-earth"
                >
                  <span>WhatsApp Atelier</span>
                  <span aria-hidden="true">→</span>
                </a>
                <Link
                  href="/collections/frame-it-your-way"
                  className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-chocolate underline underline-offset-[6px] transition-colors hover:text-earth"
                >
                  Bespoke Frame Studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
