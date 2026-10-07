"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/components/motion/reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP, CustomEase);

if (!CustomEase.get("sns-enter")) {
  CustomEase.create("sns-enter", "0.2, 0, 0, 1");
}

export { gsap, useGSAP, ScrollTrigger };

export const MOTION_EASE = "sns-enter";
export const MOTION_DURATION = 0.3;
export const MOTION_STAGGER = 0.1;

type RevealProps = {
  children: ReactNode;
  className?: string;
  start?: string;
  selector?: string;
};

export function Reveal({
  children,
  className,
  start = "top 85%",
  selector = "[data-reveal]",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const nodes = root.querySelectorAll<HTMLElement>(selector);
      const targets = nodes.length > 0 ? nodes : [root];
      const reduced = prefersReducedMotion();

      gsap.from(targets, {
        y: reduced ? 0 : 12,
        opacity: 0,
        filter: reduced ? "none" : "blur(4px)",
        duration: MOTION_DURATION,
        stagger: MOTION_STAGGER,
        ease: MOTION_EASE,
        scrollTrigger: {
          trigger: root,
          start,
          toggleActions: "play none none none",
        },
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
