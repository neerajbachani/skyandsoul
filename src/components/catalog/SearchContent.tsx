"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Button } from "@/components/ui/Button";
import { useSearch } from "@/hooks/useSearch";

export function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState(urlQuery);
  const activeQuery = urlQuery;
  const { data, isFetching, isError } = useSearch(activeQuery);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = draft.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  }

  const showResults = activeQuery.trim().length >= 2;

  return (
    <section className="bg-canvas px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          Search
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate sm:text-5xl">
          Find a piece from the nest
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <label htmlFor="search-q" className="sr-only">
            Search products
          </label>
          <input
            id="search-q"
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Try bedtime, fox, frame…"
            className="min-h-12 flex-1 border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate placeholder:text-chocolate/40 focus:border-earth focus:outline-none"
          />
          <Button type="submit" variant="filled" className="min-h-12">
            Search
          </Button>
        </form>

        <div className="mt-14">
          {!showResults ? (
            <p className="font-serif text-lg text-chocolate/70">
              Type at least two letters and search blankets, toys, frames, and
              little extras.
            </p>
          ) : isFetching ? (
            <p className="font-serif text-lg text-chocolate/70">Searching…</p>
          ) : isError ? (
            <p className="font-serif text-lg text-chocolate/70">
              Something went wrong. Please try again.
            </p>
          ) : (
            <>
              <p className="mb-8 font-sans text-sm text-chocolate/60">
                {data?.pagination.total ?? 0} results for “{activeQuery.trim()}”
              </p>
              <ProductGrid
                products={data?.products ?? []}
                emptyMessage="No pieces matched that search. Try another word."
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
