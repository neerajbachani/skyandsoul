import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductInfo } from "@/components/catalog/ProductInfo";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  getProductBySlug,
} from "@/lib/catalog";
import { formatInr } from "@/lib/money";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.tagline ?? product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <SiteShell>
      <section className="bg-white px-5 py-12 sm:px-8 sm:py-16">
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

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} alt={product.imageAlt} />

            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                {product.category.name}
              </p>
              <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate sm:text-5xl">
                {product.name}
              </h1>
              {product.tagline ? (
                <p className="mt-4 font-serif text-xl italic text-earth">
                  {product.tagline}
                </p>
              ) : null}
              <p className="mt-6 font-sans text-lg font-medium tracking-wide text-chocolate">
                {formatInr(product.price)}
              </p>

              <dl className="mt-8 grid gap-4 border-y border-chocolate/10 py-6 sm:grid-cols-3">
                {product.material ? (
                  <div>
                    <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
                      Material
                    </dt>
                    <dd className="mt-1 font-serif text-base text-chocolate">
                      {product.material}
                    </dd>
                  </div>
                ) : null}
                {product.size ? (
                  <div>
                    <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
                      Size
                    </dt>
                    <dd className="mt-1 font-serif text-base text-chocolate">
                      {product.size}
                    </dd>
                  </div>
                ) : null}
                {product.ageRange ? (
                  <div>
                    <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
                      Age
                    </dt>
                    <dd className="mt-1 font-serif text-base text-chocolate">
                      {product.ageRange}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-8">
                <AddToCartButton
                  productId={product.id}
                  productName={product.name}
                />
              </div>
              <p className="mt-3">
                <Link
                  href={`/collections/${product.category.slug}`}
                  className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px]"
                >
                  More in {product.category.name}
                </Link>
              </p>
              <p className="mt-4 font-sans text-xs text-chocolate/55">
                Secure checkout with Razorpay. Sign in to complete your order.
              </p>

              <ProductInfo
                description={product.description}
                features={product.features}
                careInstructions={product.careInstructions}
              />
            </div>
          </div>
        </div>
      </section>

      {product.related && product.related.length > 0 ? (
        <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-10 font-serif text-3xl font-medium text-chocolate">
              You May Also Love
            </h2>
            <ProductGrid products={product.related} />
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
