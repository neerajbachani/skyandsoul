import Image from "next/image";
import Link from "next/link";
import { CLOUDINARY } from "@/lib/catalog-images";
import { collectionHref, productHref } from "@/lib/money";

export type BannerItem = {
  src: string;
  alt: string;
  href: string;
  label: string;
  objectPosition?: string;
};

type BannerSet = {
  wide: BannerItem;
  left: BannerItem;
  right: BannerItem;
};

export const PRIMARY_BANNERS: BannerSet = {
  wide: {
    src: CLOUDINARY.bedtimeBuddies,
    alt: "Bedtime Buddies granny-square crochet blanket with colorful animal faces",
    href: collectionHref("blankets"),
    label: "Blankets",
  },
  left: {
    src: CLOUDINARY.crochetPilotBearToy,
    alt: "Handmade crochet pilot bear toy with blue muffler and goggles",
    href: collectionHref("toys"),
    label: "Toys",
    objectPosition: "object-[center_35%]",
  },
  right: {
    src: CLOUDINARY.littleRootsAlt,
    alt: "Little Roots nursery frame with a wooden tree and crochet animals",
    href: collectionHref("frames"),
    label: "Frames",
  },
};

export const SECONDARY_BANNERS: BannerSet = {
  wide: {
    src: CLOUDINARY.rainbowNest,
    alt: "Rainbow Nest striped crochet baby blanket with cloud appliqués in a kraft gift box",
    href: productHref("rainbow-nest"),
    label: "Rainbow Nest",
    objectPosition: "object-center",
  },
  left: {
    src: CLOUDINARY.teaCoaster,
    alt: "Photo frame inspired crochet tea coaster",
    href: productHref("crochet-tea-coaster"),
    label: "Tea Coaster",
    objectPosition: "object-[center_40%]",
  },
  right: {
    src: CLOUDINARY.dollKeychain,
    alt: "Doll crochet keychain",
    href: productHref("doll-keychain"),
    label: "Doll Keychain",
    objectPosition: "object-[center_35%]",
  },
};

type BannerPanelProps = {
  banner: BannerItem;
  sizes: string;
  className?: string;
  wide?: boolean;
};

function BannerPanel({
  banner,
  sizes,
  className = "",
  wide = false,
}: BannerPanelProps) {
  return (
    <Link
      href={banner.href}
      className={`group relative block min-h-0 min-w-0 overflow-hidden bg-sky/20 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth ${className}`}
    >
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        sizes={sizes}
        className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${banner.objectPosition ?? "object-center"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/35 via-transparent to-transparent" />
      <span
        className={`absolute bottom-3 left-1/2 z-10 -translate-x-1/2 truncate bg-white text-center font-sans font-medium uppercase text-chocolate shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md motion-reduce:group-hover:translate-y-0 sm:bottom-4 lg:bottom-6 ${
          wide
            ? "w-auto min-w-[10rem] px-4 py-2.5 text-[10px] tracking-[0.14em] sm:px-5 sm:py-3 sm:text-[11px] sm:tracking-[0.16em]"
            : "w-[calc(100%-1.25rem)] px-2.5 py-2 text-[9px] tracking-[0.12em] sm:w-[calc(100%-1.75rem)] sm:px-4 sm:py-2.5 sm:text-[10px] sm:tracking-[0.14em] md:w-auto md:min-w-[10.5rem] lg:min-w-[12rem] lg:px-5 lg:py-3 lg:text-[11px] lg:tracking-[0.16em]"
        }`}
      >
        {banner.label} →
      </span>
    </Link>
  );
}

type BannerMosaicProps = {
  banners?: BannerSet;
  label?: string;
  eyebrow?: string;
  title?: string;
};

export function BannerMosaic({
  banners = PRIMARY_BANNERS,
  label = "Featured collection banners",
  eyebrow,
  title,
}: BannerMosaicProps) {
  return (
    <section {...(title ? {} : { "aria-label": label })}>
      {title ? (
        <div className="mb-10 px-5 text-center sm:mb-14 sm:px-8">
          {eyebrow ? (
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
            {title}
          </h2>
        </div>
      ) : null}
      <div className="grid h-[min(100svh,48rem)] grid-cols-2 grid-rows-[minmax(0,1.4fr)_minmax(0,2fr)] gap-2 sm:h-[min(110svh,56rem)] sm:gap-3 md:h-[min(120svh,68rem)] lg:h-[min(132svh,80rem)] lg:gap-4">
        <BannerPanel
          banner={banners.wide}
          sizes="100vw"
          className="col-span-2"
          wide
        />
        <BannerPanel
          banner={banners.left}
          sizes="50vw"
        />
        <BannerPanel
          banner={banners.right}
          sizes="50vw"
        />
      </div>
    </section>
  );
}
