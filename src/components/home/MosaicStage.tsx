"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/components/motion/reveal";
import { prefersReducedMotion } from "@/components/motion/reduced-motion";

export function MosaicStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;

      const photos = root.querySelectorAll<HTMLElement>("[data-mosaic-photo]");

      photos.forEach((photo) => {
        gsap.fromTo(
          photo,
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: "none",
            scrollTrigger: {
              trigger: photo.closest("[data-mosaic-tile]") ?? photo,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
