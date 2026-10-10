import Image from "next/image";
import Link from "next/link";
import { collectionHref } from "@/lib/money";

type CollectionOverviewCardProps = {
  category: {
    slug: string;
    name: string;
    description: string;
    image: string;
    imageAlt: string;
    productCount?: number;
  };
  isCustomizer?: boolean;
};

export function CollectionOverviewCard({
  category,
  isCustomizer = false,
}: CollectionOverviewCardProps) {
  const href = collectionHref(category.slug);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-chocolate/10 bg-white transition-all duration-500 hover:border-earth/30 hover:shadow-lg">
      {/* Image Container */}
      <Link href={href} className="relative aspect-[4/3] w-full overflow-hidden bg-sky/20">
        <Image
          src={category.image}
          alt={category.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

        {/* Top Badges */}
        <div className="absolute left-3.5 top-3.5 right-3.5 flex items-center justify-between">
          {isCustomizer ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-earth shadow-sm">
              ✨ Bespoke Studio
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider text-chocolate/80 shadow-sm backdrop-blur-sm">
              Handcrafted
            </span>
          )}

          {category.productCount !== undefined && category.productCount > 0 && (
            <span className="rounded-full bg-chocolate/85 px-2.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider text-white shadow-sm">
              {category.productCount} Pieces
            </span>
          )}
        </div>

        {/* Title over image bottom */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5">
          <h3 className="font-serif text-2xl font-medium text-white drop-shadow-sm">
            {category.name}
          </h3>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <p className="line-clamp-2 font-sans text-xs leading-relaxed text-chocolate/75">
          {category.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-chocolate/10 pt-4">
          <Link
            href={href}
            className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-chocolate transition-colors group-hover:text-earth"
          >
            {isCustomizer ? "Start Creating →" : "View Collection →"}
          </Link>

          {!isCustomizer && (
            <a
              href={`#${category.slug}`}
              className="font-sans text-[11px] uppercase tracking-wider text-chocolate/45 transition-colors hover:text-chocolate"
            >
              Browse preview ↓
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
