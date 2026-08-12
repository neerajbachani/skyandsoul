import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CollectionHero } from "@/components/catalog/CollectionHero";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { FrameItLanding } from "@/components/catalog/FrameItLanding";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { getCategoryBySlug, listCategories } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Collection" };
  return {
    title: category.name,
    description: category.description,
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
      <CollectionHero
        title={category.name}
        description={category.description}
        image={category.image}
        imageAlt={category.imageAlt}
      />
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: category.name },
            ]}
          />
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="font-sans text-sm text-chocolate/60">
              {category.pagination?.total ?? category.products.length} pieces
            </p>
            <Button href="/search" showArrow variant="text">
              Search the nest
            </Button>
          </div>
          <ProductGrid products={productsWithCategory} />
          {category.products.length === 0 ? (
            <div className="mt-10 text-center">
              <Link
                href="/contact"
                className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px]"
              >
                Ask about this collection
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
