"use client";

import { useRef } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  if (images.length < 2) return null;

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-canvas h-svh sm:h-auto pt-20 pb-6 sm:py-32 flex flex-col justify-between sm:block"
      aria-label={`${SITE.name} spotlight`}
    >
      <Reveal className="mb-2 px-5 text-center sm:mb-14 sm:px-8">
        <p
          data-reveal
          className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage"
        >
          Spotlight
        </p>
        <h2
          data-reveal
          className="mt-1 font-serif text-2xl font-medium text-chocolate sm:mt-3 sm:text-4xl"
        >
          {SITE.name} Spotlight
        </h2>
      </Reveal>

      <PolaroidStackSlider
        pinSectionRef={sectionRef}
        className="my-auto sm:my-0 sm:mt-4"
        images={images}
      />

      <div className="mt-2 flex justify-center px-5 sm:mt-12">
        <Button href="/collections" showArrow>
          View All
        </Button>
      </div>
    </section>
  );
}
