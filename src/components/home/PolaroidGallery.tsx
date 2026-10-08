"use client";

import {
  PolaroidStackSlider,
  type PolaroidImage,
} from "@/components/PolaroidStackSlider";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";
import { productHref } from "@/lib/money";
import type { SpotlightProduct } from "@/lib/types";

type PolaroidGalleryProps = {
  products: SpotlightProduct[];
};

function spotlightImages(products: SpotlightProduct[]): PolaroidImage[] {
  return products
    .filter((product) => product.images[0])
    .map((product) => ({
      src: product.images[0],
      alt: product.imageAlt || product.name,
      caption: product.name,
      href: productHref(product.slug),
    }));
}

export function PolaroidGallery({ products }: PolaroidGalleryProps) {
  const images = spotlightImages(products);
  if (images.length < 2) return null;

  return (
    <section
      className="overflow-hidden bg-canvas py-24 sm:py-32"
      aria-label={`${SITE.name} spotlight`}
    >
      <Reveal className="mb-10 px-5 text-center sm:mb-14 sm:px-8">
        <p
          data-reveal
          className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage"
        >
          Spotlight
        </p>
        <h2
          data-reveal
          className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl"
        >
          {SITE.name} Spotlight
        </h2>
      </Reveal>

      <PolaroidStackSlider
        className="mt-2 sm:mt-4"
        images={images}
        clickHint="Scroll, drag, or use the arrow keys. Click the front card to view the product."
      />

      <div className="mt-10 flex justify-center px-5 sm:mt-12">
        <Button href="/collections" showArrow>
          View All
        </Button>
      </div>
    </section>
  );
}
