import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CollectionHeroEditorial } from "@/components/catalog/CollectionHeroEditorial";
import { CollectionInteractiveGrid } from "@/components/catalog/CollectionInteractiveGrid";
import { FrameItLanding } from "@/components/catalog/FrameItLanding";
import { SiteShell } from "@/components/layout/SiteShell";
import { getCategoryBySlug } from "@/lib/catalog";
import { LITTLE_EXTRAS_HERO_SLIDES } from "@/lib/catalog-images";
import { COLLECTION_EDITORIALS } from "@/lib/collection-editorial-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Collection" };
  const editorial = COLLECTION_EDITORIALS[slug];
  return {
    title: `${category.name} — Handcrafted Heirloom Catalog | Sky n Soul`,
    description: editorial?.tagline ?? category.description,
  };
}

export default async function CollectionSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  if (slug === "frame-it-your-way") {
    return (
      <SiteShell>
        <FrameItLanding category={category} />
      </SiteShell>
    );
  }

  const editorial = COLLECTION_EDITORIALS[slug];

  const productsWithCategory = category.products.map((product) => ({
    ...product,
    category: {
      id: category.id,
      slug: category.slug,
      name: category.name,
    },
  }));

  return (
    <SiteShell>
      {/* 1. High-Taste Editorial Hero */}
      <CollectionHeroEditorial
        title={category.name}
        description={category.description}
        image={category.image}
        imageAlt={category.imageAlt}
        slides={slug === "little-extras" ? LITTLE_EXTRAS_HERO_SLIDES : undefined}
        editorial={editorial}
      />

      {/* 2. Interactive Catalog Grid & Stories */}
      <section className="bg-white px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: category.name },
            ]}
          />

          <CollectionInteractiveGrid
            products={productsWithCategory}
            editorial={editorial}
            collectionSlug={slug}
          />

          {category.products.length === 0 ? (
            <div className="mt-12 text-center">
              <Link
                href="/contact"
                className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-earth underline underline-offset-8 transition-colors hover:text-chocolate"
              >
                Inquire about this bespoke collection
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* 3. Artisanal Heirloom Assurance Ribbon */}
      <section className="border-t border-chocolate/10 bg-[#faf8f5] px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-chocolate/5 bg-white/60 p-6 shadow-xs backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth/10 text-earth font-serif text-lg font-bold">
                01
              </div>
              <h4 className="mt-4 font-serif text-xl font-medium text-chocolate">
                100% Baby-Safe Yarn
              </h4>
              <p className="mt-2 font-serif text-sm leading-relaxed text-chocolate/75">
                Every thread is tested for softness and durability, keeping sensitive skin safe and rash-free.
              </p>
            </div>

            <div className="rounded-2xl border border-chocolate/5 bg-white/60 p-6 shadow-xs backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth/10 text-earth font-serif text-lg font-bold">
                02
              </div>
              <h4 className="mt-4 font-serif text-xl font-medium text-chocolate">
                Jaipur Women Artisans
              </h4>
              <p className="mt-2 font-serif text-sm leading-relaxed text-chocolate/75">
                Hand-crocheted stitch by stitch, providing sustainable livelihood to women craftspeople in Rajasthan.
              </p>
            </div>

            <div className="rounded-2xl border border-chocolate/5 bg-white/60 p-6 shadow-xs backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth/10 text-earth font-serif text-lg font-bold">
                03
              </div>
              <h4 className="mt-4 font-serif text-xl font-medium text-chocolate">
                Heirloom Gift Wrapping
              </h4>
              <p className="mt-2 font-serif text-sm leading-relaxed text-chocolate/75">
                Complimentary signature packaging with cotton tie-ribbons and personalized handwritten note cards.
              </p>
            </div>

            <div className="rounded-2xl border border-chocolate/5 bg-white/60 p-6 shadow-xs backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth/10 text-earth font-serif text-lg font-bold">
                04
              </div>
              <h4 className="mt-4 font-serif text-xl font-medium text-chocolate">
                Pan-India Safe Delivery
              </h4>
              <p className="mt-2 font-serif text-sm leading-relaxed text-chocolate/75">
                Carefully inspected, dust-bagged, and securely dispatched with express tracking across India.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
