"use client";

import { Caveat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useGSAP, ScrollTrigger } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: "500",
});

export type PolaroidEditorialMeta = {
  eyebrow?: string;
  title?: string;
  description?: string;
  detailTitle?: string;
  detailDescription?: string;
  tag?: string;
};

export type PolaroidImage = {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
  meta?: PolaroidEditorialMeta;
};

export type PolaroidStackSliderProps = {
  images: PolaroidImage[];
  /** How many cards to keep rendered ahead of the active one. */
  visibleCount?: number;
  className?: string;
  /** Kept for backwards compatibility. */
  mode?: "wheel" | "page-scroll";
  /** Replaces the default interaction hint under the controls. */
  clickHint?: string;
  /** Parent section to pin with ScrollTrigger. */
  pinSectionRef?: React.RefObject<HTMLElement | null>;
};

type Pose = {
  /** Percent of card width. Positive fans to the right. */
  x: number;
  /** Drop in px. */
  y: number;
  scale: number;
  /** Tilt in degrees. */
  rotate: number;
  /** Depth-of-field blur in px. */
  blur: number;
  opacity: number;
  zIndex: number;
};

/**
 * Fan shape. Offset -1 is the card leaving to the left.
 * Offset 5 is reused for every slot further back (opacity 0, so it can enter without a pop).
 * Tweak x for spacing, rotate for tilt, blur for how fast the stack falls out of focus.
 */
export const POSES: Record<number, Pose> = {
  [-1]: { x: -45, y: 0, scale: 0.85, rotate: -8, blur: 3, opacity: 0, zIndex: 80 },
  0: { x: 0, y: 0, scale: 1, rotate: 0, blur: 0, opacity: 1, zIndex: 100 },
  1: { x: 28, y: 4, scale: 0.88, rotate: 6, blur: 1, opacity: 1, zIndex: 90 },
  2: { x: 50, y: 8, scale: 0.77, rotate: 11, blur: 2, opacity: 1, zIndex: 80 },
  3: { x: 68, y: 12, scale: 0.67, rotate: 16, blur: 3.5, opacity: 0.9, zIndex: 70 },
  4: { x: 82, y: 16, scale: 0.58, rotate: 21, blur: 5, opacity: 0.7, zIndex: 60 },
  5: { x: 92, y: 20, scale: 0.5, rotate: 26, blur: 6, opacity: 0, zIndex: 50 },
};

/** Incoming card lifts by this many px at the midpoint of a flip. */
const LIFT_PX = 28;
const LIFT_SCALE = 0.03;
/** After this fraction of the flip, the incoming card paints above the active one. */
const COVER_AT = 0.35;

const FRAME_SHADOW = "0 10px 30px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.12)";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function modulo(value: number, count: number) {
  if (count <= 0) return 0;
  return ((value % count) + count) % count;
}

function easeInOut(t: number) {
  const x = clamp(t, 0, 1);
  return x < 0.5 ? 2 * x * x : 1 - ((-2 * x + 2) ** 2) / 2;
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function poseForSlot(offset: number): Pose {
  if (offset <= -1) return POSES[-1];
  if (offset >= 5) return POSES[5];
  return POSES[offset] ?? POSES[5];
}

/** Slot of a card relative to the active index, or null when it sits outside the finite deck. */
function slotOffset(
  cardIndex: number,
  activeIndex: number,
  count: number,
  depth: number,
) {
  if (cardIndex < 0 || cardIndex >= count) return null;
  const raw = cardIndex - activeIndex;
  if (raw === -1) return -1;
  if (raw >= 0 && raw <= depth) return raw;
  return null;
}

function visibleCardIndices(activeIndex: number, count: number, depth: number) {
  if (count < 2) return [];
  const indices: number[] = [];
  const start = Math.max(0, activeIndex - 1);
  const end = Math.min(count - 1, activeIndex + depth);
  for (let index = start; index <= end; index += 1) indices.push(index);
  return indices;
}

function resolvePose(
  progress: number,
  cardIndex: number,
  count: number,
  depth: number,
  reduced: boolean,
): Pose {
  const active = Math.floor(progress);
  const rawT = progress - active;
  const eased = easeInOut(rawT);
  const offset = slotOffset(cardIndex, active, count, depth);
  if (offset === null) {
    return { ...POSES[5], opacity: 0 };
  }

  const from = poseForSlot(offset);
  // A card that has left stays off to the left. The deck does not loop it back in.
  const to = offset <= -1 ? from : poseForSlot(offset - 1);

  let y = lerp(from.y, to.y, eased);
  let scale = lerp(from.scale, to.scale, eased);
  const x = lerp(from.x, to.x, eased);
  const rotate = lerp(from.rotate, to.rotate, eased);
  // Reduced motion keeps the slide but drops the blur and the lift.
  const blur = reduced ? 0 : lerp(from.blur, to.blur, eased);
  let opacity = lerp(from.opacity, to.opacity, eased);

  if (!reduced && offset === 1) {
    const arc = Math.sin(Math.PI * rawT);
    y -= arc * LIFT_PX;
    scale += arc * LIFT_SCALE;
  }

  if (reduced && offset === 0) opacity = 1 - eased;

  let zIndex = rawT > 0.5 ? to.zIndex : from.zIndex;
  if (offset === 0 && rawT > COVER_AT) zIndex = 70;
  if (offset === 1 && rawT > COVER_AT) zIndex = 120;

  return { x, y, scale, rotate, blur, opacity, zIndex };
}

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "prev" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

function PolaroidCard({
  image,
  imageIndex,
  count,
  depth,
  progress,
  reduced,
  quiet,
  slot,
  onCardClick,
}: {
  image: PolaroidImage;
  imageIndex: number;
  count: number;
  depth: number;
  progress: MotionValue<number>;
  reduced: MotionValue<boolean>;
  quiet: boolean;
  slot: number | null;
  onCardClick?: (imageIndex: number, slot: number) => void;
}) {
  const poseOf = () =>
    resolvePose(progress.get(), imageIndex, count, depth, reduced.get());

  const x = useTransform(() => `${-50 + poseOf().x}%`);
  const y = useTransform(() => `calc(-50% + ${poseOf().y}px)`);
  const rotate = useTransform(() => poseOf().rotate);
  const scale = useTransform(() => poseOf().scale);
  const opacity = useTransform(() => poseOf().opacity);
  const filter = useTransform(() => {
    const blur = poseOf().blur;
    return blur < 0.05 ? "none" : `blur(${blur}px)`;
  });
  const zIndex = useTransform(() => poseOf().zIndex);

  const isFront = slot === 0;
  const isNext = slot === 1;
  const isPrev = slot === -1;
  const isInteractive = (isFront && Boolean(image.href)) || isNext || isPrev;

  return (
    <motion.article
      aria-hidden={quiet}
      onClick={isInteractive ? () => onCardClick?.(imageIndex, slot!) : undefined}
      className={cn(
        "absolute top-1/2 left-1/2 w-[210px] select-none xs:w-[230px] sm:w-[300px] lg:w-[320px]",
        isInteractive ? "pointer-events-auto cursor-pointer" : "pointer-events-none",
      )}
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter,
        zIndex,
        originX: 0.5,
        originY: 1,
        willChange: "transform, filter, opacity",
      }}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-white transition-[box-shadow,transform] duration-200",
          isFront && Boolean(image.href) && "hover:shadow-2xl hover:scale-[1.015]",
          isNext && "hover:opacity-100",
        )}
        style={{
          padding: "12px 12px 44px",
          borderRadius: 4,
          boxShadow: FRAME_SHADOW,
        }}
      >
        <div className="relative aspect-[4/5] bg-sky/40">
          <Image
            src={image.src}
            alt={quiet ? "" : image.alt}
            fill
            sizes="(max-width: 639px) 230px, (max-width: 1023px) 300px, 320px"
            className="object-cover"
            draggable={false}
            {...(imageIndex < 3
              ? { priority: true as const }
              : { loading: imageIndex < 6 ? ("eager" as const) : ("lazy" as const) })}
          />
        </div>
        {image.caption ? (
          <p
            className={cn(
              handwritten.className,
              "absolute inset-x-0 bottom-0 flex h-11 items-center justify-center px-3 text-[1.3rem] leading-none text-chocolate/85 sm:text-[1.45rem]",
            )}
          >
            <span className="truncate">{image.caption}</span>
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}

export function PolaroidStackSlider({
  images,
  visibleCount = 6,
  className,
  clickHint,
  pinSectionRef,
}: PolaroidStackSliderProps) {
  const router = useRouter();
  const count = images.length;
  const depth = Math.min(visibleCount, Math.max(1, count - 2));
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const progress = useMotionValue(0);
  const reduced = useMotionValue(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    const next = clamp(Math.round(value), 0, count - 1);
    setActiveIndex((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => reduced.set(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [reduced]);

  useGSAP(
    () => {
      const pinTarget =
        pinSectionRef?.current ||
        stageRef.current?.closest("section") ||
        scrollRootRef.current;
      if (!pinTarget || count < 2) return;

      const dwellStart = 0.04;
      const dwellEnd = 0.10;
      const activeRange = 1 - dwellStart - dwellEnd;

      const getScrollDistance = () => {
        const isDesktop = window.innerWidth >= 768;
        const cardStepPx = isDesktop ? 400 : 360;
        const dwellPx = isDesktop ? 350 : 300;
        return Math.round(Math.max((count - 1) * cardStepPx + dwellPx, 1600));
      };

      const st = ScrollTrigger.create({
        trigger: pinTarget,
        pin: true,
        pinSpacing: true,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const t = self.progress;
          let p: number;
          if (t <= dwellStart) {
            p = 0;
          } else if (t >= 1 - dwellEnd) {
            p = count - 1;
          } else {
            p = ((t - dwellStart) / activeRange) * (count - 1);
          }
          progress.set(clamp(p, 0, count - 1));
        },
      });

      scrollTriggerRef.current = st;

      return () => {
        st.kill();
        scrollTriggerRef.current = null;
      };
    },
    { scope: scrollRootRef, dependencies: [count] },
  );

  const indices = useMemo(
    () => visibleCardIndices(activeIndex, count, depth),
    [activeIndex, count, depth],
  );

  const current = images[modulo(activeIndex, count)];
  const meta = current?.meta;

  function stepBy(direction: number) {
    if (count < 2) return;
    const st = scrollTriggerRef.current;
    if (st) {
      const nextIndex = clamp(activeIndex + direction, 0, count - 1);
      const dwellStart = 0.04;
      const dwellEnd = 0.10;
      const activeRange = 1 - dwellStart - dwellEnd;
      const targetP = count > 1 ? dwellStart + (nextIndex / (count - 1)) * activeRange : 0;
      const targetScrollY = st.start + targetP * (st.end - st.start);
      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });
    } else {
      progress.set(clamp(activeIndex + direction, 0, count - 1));
    }
  }

  function handleCardClick(imageIndex: number, slot: number) {
    if (slot === 0) {
      const href = images[imageIndex]?.href;
      if (href) router.push(href);
    } else if (slot === 1) {
      stepBy(1);
    } else if (slot === -1) {
      stepBy(-1);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepBy(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepBy(-1);
    }
  }

  if (count < 2) return null;

  const label = current?.caption || current?.alt || "Photograph";
  const stage = (
    <div onKeyDown={onKeyDown} className="relative w-full">
      {/* Mobile Top Text: Animates with active card */}
      <div className="w-full px-4 text-center min-h-[54px] flex flex-col justify-center mb-1 md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          >
            {meta?.eyebrow && (
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
                {meta.eyebrow}
              </p>
            )}
            <h3 className="font-serif text-lg xs:text-xl font-medium text-chocolate truncate px-2">
              {meta?.title ?? current?.caption ?? "Artisanal Piece"}
            </h3>
            {meta?.description && (
              <p className="font-serif text-[11px] leading-tight text-chocolate/75 line-clamp-1 max-w-xs mx-auto">
                {meta.description}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Center Area: Desktop Left Text + Center Stage */}
      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-center md:gap-6 lg:gap-12">
        {/* Desktop Left Text: Animates with active card */}
        <div className="hidden md:flex flex-1 justify-end pr-4 lg:pr-8 text-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="max-w-[280px] lg:max-w-[320px] flex flex-col items-end"
            >
              {meta?.tag && (
                <span className="mb-1.5 inline-flex items-center rounded-full bg-earth/10 px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wider text-earth uppercase">
                  {meta.tag}
                </span>
              )}
              {meta?.eyebrow && (
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-sage">
                  {meta.eyebrow}
                </span>
              )}
              <h3 className="mt-1.5 font-serif text-2xl lg:text-3xl font-medium text-chocolate leading-tight">
                {meta?.title ?? current?.caption ?? "Artisanal Piece"}
              </h3>
              {meta?.description && (
                <p className="mt-2.5 font-serif text-xs lg:text-sm leading-relaxed text-chocolate/75">
                  {meta.description}
                </p>
              )}
              {current?.href && (
                <Link
                  href={current.href}
                  className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold tracking-wider text-earth transition-colors hover:text-chocolate uppercase group"
                >
                  <span>Explore Piece</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              )}
              <div className="mt-4 h-[2px] w-10 rounded-full bg-sage/40" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center Stage with Polaroid Cards */}
        <div
          ref={stageRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${label}, photograph ${modulo(activeIndex, count) + 1} of ${count}`}
          tabIndex={0}
          className="relative h-[21rem] xs:h-[23rem] sm:h-[30rem] lg:h-[32rem] w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[440px] lg:max-w-[500px] shrink-0 outline-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth"
          style={{ perspective: "1200px" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-[62%] left-1/2 h-8 w-56 -translate-x-1/2 rounded-full bg-chocolate/15 blur-xl sm:w-80"
          />
          {indices.map((imageIndex) => {
            const image = images[imageIndex];
            if (!image) return null;
            const slot = slotOffset(imageIndex, activeIndex, count, depth);
            return (
              <PolaroidCard
                key={imageIndex}
                image={image}
                imageIndex={imageIndex}
                count={count}
                depth={depth}
                progress={progress}
                reduced={reduced}
                quiet={slot !== 0}
                slot={slot}
                onCardClick={handleCardClick}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Text: Animates with active card */}
      <div className="w-full px-4 text-center min-h-[44px] flex flex-col justify-center mt-1 md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex items-center justify-center gap-2">
              {meta?.tag && (
                <span className="rounded-full bg-earth/10 px-2 py-0.5 font-sans text-[10px] font-semibold tracking-wider text-earth uppercase">
                  {meta.tag}
                </span>
              )}
              {meta?.detailTitle && (
                <span className="font-sans text-[11px] font-medium text-chocolate/85">
                  {meta.detailTitle}
                </span>
              )}
            </div>
            {meta?.detailDescription && (
              <p className="mt-0.5 font-sans text-[11px] leading-tight text-chocolate/65 line-clamp-1 max-w-xs mx-auto">
                {meta.detailDescription}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls & Arrows */}
      <div className="mt-1 flex items-center justify-center gap-2 text-chocolate sm:mt-2">
        <button
          type="button"
          className="flex size-10 items-center justify-center transition-colors hover:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth disabled:pointer-events-none disabled:opacity-30 sm:size-11"
          aria-label="Previous photograph"
          disabled={activeIndex <= 0}
          onClick={() => stepBy(-1)}
        >
          <Chevron direction="prev" />
        </button>
        <p className="min-w-16 text-center font-sans text-[11px] font-medium tracking-[0.16em] text-sage">
          {String(modulo(activeIndex, count) + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
        <button
          type="button"
          className="flex size-10 items-center justify-center transition-colors hover:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth disabled:pointer-events-none disabled:opacity-30 sm:size-11"
          aria-label="Next photograph"
          disabled={activeIndex >= count - 1}
          onClick={() => stepBy(1)}
        >
          <Chevron direction="next" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {label}
      </p>
      <p className="mt-1 text-center font-sans text-[11px] tracking-wide text-chocolate/55">
        {clickHint ?? "Scroll down to flip cards · Click card to view"}
      </p>
    </div>
  );

  return (
    <div ref={scrollRootRef} className={className}>
      {stage}
    </div>
  );
}
