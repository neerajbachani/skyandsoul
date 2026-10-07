import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/Button";
import { CLOUDINARY } from "@/lib/catalog-images";

export const EDITORIAL_IMAGES = [
  {
    src: CLOUDINARY.categoryBlankets,
    alt: "Rainbow Nest crochet baby blanket folded in a kraft gift box",
    objectPosition: "object-center",
  },
  {
    src: CLOUDINARY.crochetLionToyBanner,
    alt: "Handmade crochet lion toy in a lime sweater, held up to show the full figure",
    objectPosition: "object-[center_38%]",
  },
  {
    src: CLOUDINARY.littleCurveThird,
    alt: "Little Curve cloud nursery frame with a crochet girl, puppy, flowers, and a name plaque",
    objectPosition: "object-[center_22%]",
  },
  {
    src: CLOUDINARY.bunnyKeychain,
    alt: "Pink crochet bunny keychain hanging from a wooden peg",
    objectPosition: "object-[center_42%]",
  },
] as const;

export const EDITORIAL_COPY = {
  eyebrow: "Gifting",
  heading: "The Perfect Gift for New Beginnings",
  body: "Heirloom blankets, crochet companions, named nursery frames, and little extras — a whole welcome, ready to give.",
  cta: "Shop All Gifts",
  ctaHref: "/collections",
} as const;

export type EditorialBannerContent = {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  ctaHref: string;
  images: readonly {
    src: string;
    alt: string;
    objectPosition?: string;
  }[];
};

export function EditorialBanner({ content }: { content: EditorialBannerContent }) {
  return (
    <section className="bg-sky">
      <Reveal className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="grid min-h-[420px] grid-cols-2 grid-rows-2 gap-1.5 p-1.5 sm:min-h-[520px] lg:h-full">
          {content.images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              data-reveal
              className="relative min-h-0 overflow-hidden outline outline-1 -outline-offset-1 outline-[oklch(0_0_0/0.1)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className={`object-cover ${image.objectPosition ?? "object-center"}`}
              />
            </div>
          ))}
        </div>
        <div
          data-reveal
          className="flex items-center px-5 py-16 sm:px-12 lg:px-16 lg:py-24"
        >
          <div className="max-w-md">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
              {content.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium leading-snug text-chocolate sm:text-4xl">
              {content.heading}
            </h2>
            <p className="mt-5 font-serif text-lg leading-relaxed text-chocolate/80">
              {content.body}
            </p>
            <div className="mt-8">
              <Button href={content.ctaHref} showArrow>
                {content.cta}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
