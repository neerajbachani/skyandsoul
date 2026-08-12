import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchContent } from "@/components/catalog/SearchContent";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Sky n Soul blankets, toys, frames, and little extras.",
};

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;

  return (
    <SiteShell>
      <Suspense
        fallback={
          <section className="bg-canvas px-5 py-20">
            <p className="font-serif text-lg text-chocolate/70">Loading search…</p>
          </section>
        }
      >
        <SearchContent key={q} />
      </Suspense>
    </SiteShell>
  );
}
