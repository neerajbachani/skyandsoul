import Image from "next/image";
import Link from "next/link";
import { formatInr, productHref } from "@/lib/money";
import type { ProductWithCategory } from "@/lib/types";

type ProductCardProps = {
  product: Omit<
    Pick<
      ProductWithCategory,
      "slug" | "name" | "price" | "images" | "imageAlt" | "category"
    >,
    "category"
  > & {
    category: string | Pick<ProductWithCategory["category"], "name" | "slug">;
  };
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const categoryLabel =
    typeof product.category === "string"
      ? product.category
      : product.category.name;
  const primaryImage = product.images[0] ?? "/logo.png";
  const secondaryImage = product.images[1];

  return (
    <Link
      href={productHref(product.slug)}
      className="group relative flex flex-col rounded-2xl bg-white p-2.5 sm:p-3 ring-1 ring-chocolate/10 shadow-[0_2px_12px_-3px_rgba(75,50,34,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-6px_rgba(75,50,34,0.1)] hover:ring-chocolate/20"
    >
      {/* Double-bezel inner visual container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-canvas ring-1 ring-chocolate/5">
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] ${
            secondaryImage ? "group-hover:opacity-0" : ""
          }`}
        />

        {/* Secondary reveal image on hover if available */}
        {secondaryImage ? (
          <Image
            src={secondaryImage}
            alt={`${product.name} detail`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute inset-0 object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-100"
          />
        ) : null}

        {/* Floating Heirloom Badge */}
        <div className="absolute left-2.5 top-2.5 z-10">
          <span className="inline-flex items-center rounded-full bg-canvas/90 px-2 py-0.5 font-sans text-[9px] font-medium uppercase tracking-[0.12em] text-chocolate/80 backdrop-blur-md ring-1 ring-chocolate/10">
            Handcrafted
          </span>
        </div>

        {/* Subtle quick-peek hover pill */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="block w-full rounded-lg bg-white/95 py-1.5 text-center font-sans text-[11px] font-medium text-chocolate shadow-sm backdrop-blur-sm ring-1 ring-chocolate/10">
            View Details
          </span>
        </div>
      </div>

      {/* Typography & Pricing */}
      <div className="mt-3 flex flex-1 flex-col justify-between px-1 pb-1">
        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-sage">
            {categoryLabel}
          </p>
          <h3 className="mt-1 font-serif text-lg font-medium leading-snug text-chocolate transition-colors group-hover:text-earth sm:text-xl line-clamp-1">
            {product.name}
          </h3>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between border-t border-chocolate/5 pt-2">
          <p className="font-sans text-sm font-semibold tracking-wide text-earth tabular-nums sm:text-base">
            {formatInr(product.price)}
          </p>
          <span className="font-sans text-[10px] uppercase tracking-wider text-chocolate/45">
            Jaipur atelier
          </span>
        </div>
      </div>
    </Link>
  );
}
