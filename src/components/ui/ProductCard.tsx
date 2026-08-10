import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={product.href} className="group block">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-sky/20">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <p className="mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-sage">
        {product.category}
      </p>
      <h3 className="font-serif text-lg font-medium text-chocolate transition-colors group-hover:text-earth sm:text-xl">
        {product.name}
      </h3>
      <p className="mt-1 font-sans text-sm font-medium tracking-wide text-earth">
        {formatPrice(product.price)}
      </p>
    </Link>
  );
}
