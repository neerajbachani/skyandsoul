import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ProductDetailClient } from "@/components/catalog/ProductDetailClient";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { SiteShell } from "@/components/layout/SiteShell";
import { getProductBySlug } from "@/lib/catalog";
import { CLOUDINARY } from "@/lib/catalog-images";

const LEGACY_TEA_COASTER_SLUG = "crochet-tea-coaster";
const LEGACY_TEA_COASTER_TARGET = "/products/crochet-tea-coasters-set-of-4";

type TeaPackView = "set4" | "set6";

function teaCoasterPresentation(slug: string): {
  singles: string[];
  fixedPackView?: TeaPackView;
  customizePacks: boolean;
} | null {
  if (slug === "customized-crochet-tea-coaster") {
    return {
      singles: [...CLOUDINARY.teaCoasterGallery],
      customizePacks: true,
    };
  }
  if (slug === "crochet-tea-coasters-set-of-4") {
    return {
      singles: [...CLOUDINARY.teaCoasterSet4Gallery],
      fixedPackView: "set4",
      customizePacks: false,
    };
  }
  if (slug === "crochet-tea-coasters-set-of-6") {
    return {
      singles: [...CLOUDINARY.teaCoasterSet6Gallery],
      fixedPackView: "set6",
      customizePacks: false,
    };
  }
  return null;
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === LEGACY_TEA_COASTER_SLUG) {
    return {
      title: "Crochet Tea Coasters — Set of 4",
    };
  }
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: `${product.name} — Handcrafted Heirloom | Sky n Soul`,
    description: product.tagline ?? product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === LEGACY_TEA_COASTER_SLUG) {
    redirect(LEGACY_TEA_COASTER_TARGET);
  }
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const teaCoaster = teaCoasterPresentation(product.slug);
  const singles = teaCoaster?.singles ?? product.images;
  const packVariants = product.variants.map((variant) => ({
    id: variant.id,
    slug: variant.slug,
    name: variant.name,
    price: variant.price,
    badge: variant.badge,
    images: teaCoaster?.customizePacks
      ? variant.slug === "set-of-6"
        ? [...CLOUDINARY.teaCoasterSet6Gallery]
        : variant.slug === "set-of-4"
          ? [...CLOUDINARY.teaCoasterSet4Gallery]
          : variant.images
      : variant.images,
    trackStock: variant.trackStock,
    stockQuantity: variant.stockQuantity,
  }));

  return (
    <SiteShell>
      <section className="bg-white px-5 py-10 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              {
                label: product.category.name,
                href: `/collections/${product.category.slug}`,
              },
              { label: product.name },
            ]}
          />

          <ProductDetailClient
            productId={product.id}
            productName={product.name}
            tagline={product.tagline}
            description={product.description}
            features={product.features}
            careInstructions={product.careInstructions}
            material={product.material}
            size={product.size}
            ageRange={product.ageRange}
            categoryName={product.category.name}
            categorySlug={product.category.slug}
            basePrice={product.price}
            imageAlt={product.imageAlt}
            singles={singles}
            variants={packVariants}
            requiresPatternSelection={product.requiresPatternSelection}
            fixedPackView={teaCoaster?.fixedPackView}
            trackStock={product.trackStock}
            stockQuantity={product.stockQuantity}
          />
        </div>
      </section>

      {/* Curated Companions / Recommendations */}
      {product.related && product.related.length > 0 ? (
        <section className="border-t border-chocolate/10 bg-canvas px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
                  Complete the Nursery
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-chocolate">
                  Pairs Beautifully With
                </h2>
              </div>
              <p className="font-sans text-xs text-chocolate/55">
                Thoughtfully matched by our Jaipur stylists
              </p>
            </div>
            <ProductGrid products={product.related} />
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
