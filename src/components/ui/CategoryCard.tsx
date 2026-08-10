import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="group relative block aspect-[3/4] overflow-hidden bg-sky/30"
    >
      <Image
        src={category.image}
        alt={category.imageAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/25 via-transparent to-transparent" />
      <span className="absolute bottom-6 left-1/2 z-10 w-[calc(100%-2.5rem)] -translate-x-1/2 bg-white px-4 py-3 text-center font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-chocolate shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md sm:w-auto sm:min-w-[12rem]">
        {category.title} →
      </span>
    </Link>
  );
}
