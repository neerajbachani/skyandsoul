import { CategoryCard } from "@/components/ui/CategoryCard";
import { CATEGORIES } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <section id="shop" className="bg-white px-5 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Explore
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
            Shop by Collection
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {CATEGORIES.map((category) => (
            <div key={category.id} id={category.id}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
