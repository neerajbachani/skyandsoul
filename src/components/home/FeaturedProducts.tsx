import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/constants";

export function FeaturedProducts() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              Featured
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
              Pieces from the Nest
            </h2>
          </div>
          <Button href="#shop" showArrow>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
