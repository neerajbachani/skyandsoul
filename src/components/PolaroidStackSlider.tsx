"use client";

import { Caveat } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { gsap, useGSAP, ScrollTrigger } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const handwritten = Caveat({
  subsets: ["latin"],
  weight: "500",
});

export type PolaroidImage = {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
};

export type PolaroidStackSliderProps = {
  images: PolaroidImage[];
  /** How many cards to keep rendered ahead of the active one. */
  visibleCount?: number;
  className?: string;
  /** "wheel" hijacks the wheel over the stage. "page-scroll" ties progress to a sticky section. */
  mode?: "wheel" | "page-scroll";
  /** Replaces the default interaction hint under the controls. */
  clickHint?: string;
  /** Parent section to pin on mobile with ScrollTrigger. */
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

/** Inertia. Higher stiffness snaps faster; higher damping softens the settle; mass is the weight. */
const SPRING = { stiffness: 120, damping: 22, mass: 0.8 };

/** Progress added per pixel of wheel deltaY. */
const WHEEL_GAIN = 0.0025;
/** One wheel event cannot skip more than this many cards. */
const MAX_WHEEL_STEP = 1.5;
/** How far a drag flick can carry the stack, in cards. */
const MAX_GESTURE_CARDS = 2;
/** Idle time before the active card eases back to center. */
const SNAP_DELAY_MS = 120;
/**
 * Height of the hidden wheel sink. It stays parked at the midpoint so a
 * continuous gesture never hits an edge. Calling preventDefault on a box that
 * does not scroll makes the browser drop the rest of the gesture until the
 * pointer moves.
 */
const WHEEL_SINK_SPAN = 200_000;
const WHEEL_SINK_CENTER = WHEEL_SINK_SPAN / 2;
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
  // Reduced motion keeps the slide but drops the blur and the lift, so the
  // leaving card simply fades out under the one coming forward.
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
}: {
  image: PolaroidImage;
  imageIndex: number;
  count: number;
  depth: number;
  progress: MotionValue<number>;
  reduced: MotionValue<boolean>;
  quiet: boolean;
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

  return (
    <motion.article
      aria-hidden={quiet}
      className="pointer-events-none absolute top-1/2 left-1/2 w-[220px] select-none xs:w-[240px] sm:w-[320px]"
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
        className="relative overflow-hidden bg-white"
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
            sizes="(max-width: 639px) 240px, 320px"
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
  mode = "wheel",
  clickHint,
  pinSectionRef,
}: PolaroidStackSliderProps) {
  const router = useRouter();
  const count = images.length;
  const depth = Math.min(visibleCount, Math.max(1, count - 2));
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelSinkRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(false);
  const snapTimer = useRef<number | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    originX: number;
    originY: number;
    lastX: number;
    lastY: number;
    lastTime: number;
    velocity: number;
    moved: boolean;
  } | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const mobileProgress = useMotionValue(0);

  const target = useMotionValue(0);
  const wheelProgress = useSpring(target, SPRING);
  const { scrollYProgress } = useScroll({
    target: scrollRootRef,
    offset: ["start start", "end end"],
  });
  const pageProgress = useTransform(scrollYProgress, [0, 1], [0, Math.max(count, 1)]);
  const progress = isMobile
    ? mobileProgress
    : (mode === "page-scroll" ? pageProgress : wheelProgress);
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

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        setIsMobile(true);

        const dwellStart = 0.04;
        const dwellEnd = 0.10;
        const activeRange = 1 - dwellStart - dwellEnd;
        const scrollDistance = Math.round(Math.max((count - 1) * 360 + 300, 1600));

        const st = ScrollTrigger.create({
          trigger: pinTarget,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${scrollDistance}`,
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
            mobileProgress.set(clamp(p, 0, count - 1));
          },
        });

        scrollTriggerRef.current = st;

        return () => {
          setIsMobile(false);
          scrollTriggerRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: scrollRootRef },
  );

  useEffect(() => {
    if (mode !== "wheel" || isMobile) return;
    const stage = stageRef.current;
    const sink = wheelSinkRef.current;
    if (!stage || !sink) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let locking = false;

    const armSink = () => {
      const armed = inViewRef.current && finePointer.matches;
      sink.style.pointerEvents = armed ? "auto" : "none";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.35);
        armSink();
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    observer.observe(stage);
    finePointer.addEventListener("change", armSink);
    sink.scrollTop = WHEEL_SINK_CENTER;
    armSink();

    const clearSnap = () => {
      if (snapTimer.current !== null) window.clearTimeout(snapTimer.current);
      snapTimer.current = null;
    };

    const maxIndex = Math.max(count - 1, 0);

    const scheduleSnap = () => {
      clearSnap();
      snapTimer.current = window.setTimeout(() => {
        target.set(clamp(Math.round(target.get()), 0, maxIndex));
      }, SNAP_DELAY_MS);
    };

    const releasePageScroll = (delta: number) => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollBy(0, delta);
      root.style.scrollBehavior = previous;
    };

    const onScroll = () => {
      if (locking) return;
      const delta = sink.scrollTop - WHEEL_SINK_CENTER;
      locking = true;
      sink.scrollTop = WHEEL_SINK_CENTER;
      locking = false;
      if (!inViewRef.current || Math.abs(delta) < 0.5) return;

      const step = clamp(delta * WHEEL_GAIN, -MAX_WHEEL_STEP, MAX_WHEEL_STEP);
      if (step === 0) return;

      const current = target.get();
      const shown = wheelProgress.get();
      const parkedAtStart = current <= 0.001;
      const parkedAtEnd = current >= maxIndex - 0.001;
      // Keep the page still until the 8th card has actually settled, then let
      // further scrolling move the page instead of looping the deck.
      const arrivedStart = parkedAtStart && shown <= 0.04;
      const arrivedEnd = parkedAtEnd && shown >= maxIndex - 0.04;
      if ((step < 0 && arrivedStart) || (step > 0 && arrivedEnd)) {
        releasePageScroll(delta);
        return;
      }
      if ((step < 0 && parkedAtStart) || (step > 0 && parkedAtEnd)) return;

      target.set(clamp(current + step, 0, maxIndex));
      scheduleSnap();
    };

    sink.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      finePointer.removeEventListener("change", armSink);
      sink.removeEventListener("scroll", onScroll);
      sink.style.pointerEvents = "none";
      clearSnap();
    };
  }, [count, isMobile, mode, target, wheelProgress]);

  const indices = useMemo(
    () => visibleCardIndices(activeIndex, count, depth),
    [activeIndex, count, depth],
  );

  const current = images[modulo(activeIndex, count)];

  function cardWidth() {
    const card = stageRef.current?.querySelector("article");
    return card instanceof HTMLElement ? card.offsetWidth || 320 : 320;
  }

  function stepBy(direction: number) {
    if (count < 2) return;
    if (isMobile && scrollTriggerRef.current) {
      const st = scrollTriggerRef.current;
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
      return;
    }
    if (mode === "page-scroll") {
      const root = scrollRootRef.current;
      if (!root) return;
      const top = root.getBoundingClientRect().top + window.scrollY;
      const stepPx = root.offsetHeight / (count + 1);
      const traveled = window.scrollY - top;
      const index = Math.round(traveled / stepPx);
      window.scrollTo({
        top: top + (index + direction) * stepPx,
        behavior: "smooth",
      });
      return;
    }
    if (snapTimer.current !== null) window.clearTimeout(snapTimer.current);
    target.set(clamp(Math.round(target.get()) + direction, 0, count - 1));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || count < 2) return;
    if (event.pointerType !== "touch") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.currentTarget.focus({ preventScroll: true });
    if (snapTimer.current !== null) window.clearTimeout(snapTimer.current);
    dragRef.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const now = performance.now();
    const dt = Math.max(now - drag.lastTime, 1);
    const dx = event.clientX - drag.lastX;
    const dy = event.clientY - drag.lastY;
    if (Math.hypot(event.clientX - drag.originX, event.clientY - drag.originY) > 8) {
      drag.moved = true;
    }

    if (event.pointerType === "touch") {
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      drag.lastTime = now;
      return;
    }

    const width = Math.max(cardWidth(), 1);
    const delta = -dx / width;
    drag.velocity = delta / dt;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = now;
    if (!drag.moved) return;

    if (mode === "page-scroll") {
      const root = scrollRootRef.current;
      if (!root) return;
      const stepPx = root.offsetHeight / (count + 1);
      window.scrollBy({ top: delta * stepPx });
      return;
    }
    target.set(clamp(target.get() + delta, 0, count - 1));
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!drag.moved) {
      const href = images[modulo(activeIndex, count)]?.href;
      if (href) router.push(href);
      return;
    }

    if (event.pointerType === "touch") {
      const totalDx = event.clientX - drag.originX;
      const totalDy = event.clientY - drag.originY;
      if (Math.abs(totalDx) > 50 && Math.abs(totalDy) < 40) {
        if (totalDx < 0) stepBy(1);
        else stepBy(-1);
      }
      return;
    }

    if (mode === "page-scroll") {
      const root = scrollRootRef.current;
      if (!root) return;
      const top = root.getBoundingClientRect().top + window.scrollY;
      const stepPx = root.offsetHeight / (count + 1);
      const projected = window.scrollY - top + clamp(drag.velocity * 220, -2, 2) * stepPx;
      window.scrollTo({ top: top + Math.round(projected / stepPx) * stepPx, behavior: "smooth" });
      return;
    }

    const projected = target.get() + clamp(drag.velocity * 220, -MAX_GESTURE_CARDS, MAX_GESTURE_CARDS);
    target.set(clamp(Math.round(projected), 0, count - 1));
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
    <div onKeyDown={onKeyDown}>
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${label}, photograph ${modulo(activeIndex, count) + 1} of ${count}`}
        tabIndex={0}
        className="relative h-[22rem] w-full cursor-grab touch-pan-y outline-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth active:cursor-grabbing sm:h-[36rem]"
        style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {mode === "wheel" ? (
          <div
            ref={wheelSinkRef}
            aria-hidden
            className="absolute inset-0 z-[200] cursor-inherit overflow-y-scroll overscroll-y-contain select-none pointer-events-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollBehavior: "auto" }}
          >
            <div style={{ height: WHEEL_SINK_SPAN }} />
          </div>
        ) : null}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[62%] left-1/2 h-8 w-56 -translate-x-1/2 rounded-full bg-chocolate/15 blur-xl sm:w-80"
        />
        {indices.map((imageIndex) => {
          const image = images[imageIndex];
          if (!image) return null;
          return (
            <PolaroidCard
              key={imageIndex}
              image={image}
              imageIndex={imageIndex}
              count={count}
              depth={depth}
              progress={progress}
              reduced={reduced}
              quiet={slotOffset(imageIndex, activeIndex, count, depth) !== 0}
            />
          );
        })}
      </div>

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
        {clickHint ??
          (isMobile
            ? "Scroll down to flip cards · Tap card to view"
            : mode === "page-scroll"
              ? "Scroll the page to flip. Arrow keys work too."
              : "Scroll, drag, or use the arrow keys.")}
      </p>
    </div>
  );

  if (mode === "page-scroll") {
    return (
      <div
        ref={scrollRootRef}
        className={cn("relative", className)}
        style={{ height: `${(count + 1) * 85}vh` }}
      >
        <div className="sticky top-0 flex h-dvh flex-col justify-center">{stage}</div>
      </div>
    );
  }

  return (
    <div ref={scrollRootRef} className={className}>
      {stage}
    </div>
  );
}
