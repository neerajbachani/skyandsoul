import Image from "next/image";
import Link from "next/link";
import { formatInr, productHref } from "@/lib/money";
import type { ProductWithCategory } from "@/lib/types";

type ProductCardProps = {
  product: Pick<
    ProductWithCategory,
    "slug" | "name" | "price" | "images" | "imageAlt" | "category"
  > & {
    category: string | Pick<ProductWithCategory["category"], "name" | "slug">;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const categoryLabel =
    typeof product.category === "string"
      ? product.category
      : product.category.name;
  const image = product.images[0] ?? "/logo.png";

  return (
    <Link href={productHref(product.slug)} className="group block">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-sky/20">
        <Image
          src={image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
        />
      </div>
      <p className="mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-sage">
        {categoryLabel}
      </p>
      <h3 className="font-serif text-lg font-medium text-chocolate transition-colors group-hover:text-earth sm:text-xl">
        {product.name}
      </h3>
      <p className="mt-1 font-sans text-sm font-medium tracking-wide text-earth">
        {formatInr(product.price)}
      </p>
    </Link>
  );
}
