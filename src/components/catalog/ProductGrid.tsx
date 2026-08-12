import { ProductCard } from "@/components/ui/ProductCard";
import type { ProductWithCategory } from "@/lib/types";

type ProductGridProps = {
  products: Array<
    Pick<
      ProductWithCategory,
      "id" | "slug" | "name" | "price" | "images" | "imageAlt" | "category"
    >
  >;
  emptyMessage?: string;
};

export function ProductGrid({
  products,
  emptyMessage = "No products in this collection yet.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center font-serif text-lg text-chocolate/70">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
