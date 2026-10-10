"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

export type HeroSlideContent = {
  id: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaHref: string;
  image: string;
  imageMobile?: string;
  imageAlt: string;
};

const AUTOPLAY_MS = 4500;
const RESUME_DELAY_MS = 4500;

function HeroSlidePicture({
  slide,
  priority = false,
}: {
  slide: HeroSlideContent;
  priority?: boolean;
}) {
  const alt = slide.imageAlt;

  if (slide.imageMobile) {
    return (
      <>
        <Image
          src={slide.imageMobile}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 1px"
          className="object-cover object-center md:hidden"
          draggable={false}
        />
        <Image
          src={slide.image}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 100vw, 1px"
          className="hidden object-cover object-center md:block"
          draggable={false}
        />
      </>
    );
  }

  return (
    <Image
      src={slide.image}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover object-center"
      draggable={false}
    />
  );
}

function Chevron({
  direction,
  size = 20,
  className = "",
}: {
  direction: "prev" | "next";
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {direction === "prev" ? (
        <path d="M15 19l-7-7 7-7" />
      ) : (
        <path d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

function PauseIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="6" y="4" width="4" height="16" rx="1.5" />
      <rect x="14" y="4" width="4" height="16" rx="1.5" />
    </svg>
  );
}

function PlayIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="translate-x-[1px]"
    >
      <path d="M6 4.75A1.75 1.75 0 0 1 8.7 3.25l11.25 7.25a1.75 1.75 0 0 1 0 3l-11.25 7.25A1.75 1.75 0 0 1 6 19.25V4.75z" />
    </svg>
  );
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.85,
    scale: 1.02,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.8 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0.85,
    scale: 0.98,
    transition: {
      x: { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.8 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  }),
};

const reducedVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export function Hero({ slides }: { slides: readonly HeroSlideContent[] }) {
  const count = slides.length;

  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hidden, setHidden] = useState(false);

  const dragDistanceRef = useRef(0);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeIndex = count > 0 ? ((page % count) + count) % count : 0;
  const currentSlide = slides[activeIndex];

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    },
    [],
  );

  const jumpTo = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex) return;
      let diff = targetIndex - activeIndex;
      // Choose the shortest visual distance
      if (diff > count / 2) diff -= count;
      else if (diff < -count / 2) diff += count;
      const dir = diff >= 0 ? 1 : -1;
      setPage(([prevPage]) => [prevPage + diff, dir]);
    },
    [activeIndex, count],
  );

  // Resume autoplay automatically after user stops manually interacting
  const registerUserInteraction = useCallback(() => {
    setIsInteracting(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, RESUME_DELAY_MS);
  }, []);

  // Motion reduction check
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Tab visibility check
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  // Cleanup resume timer
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Autoplay active state
  const isAutoplayActive =
    !isPaused &&
    !isHovered &&
    !isInteracting &&
    !reduceMotion &&
    !hidden &&
    count > 1;

  useEffect(() => {
    if (!isAutoplayActive) return;

    const timer = setInterval(() => {
      paginate(1);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [isAutoplayActive, paginate, page]);

  // Only pause on hover if device has genuine pointer hover (no sticky touch hovers)
  const handleMouseEnter = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      setIsHovered(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      paginate(1);
      registerUserInteraction();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      paginate(-1);
      registerUserInteraction();
    }
  }

  if (!count || !currentSlide) return null;

  return (
    <section
      className="relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[2.1/1] overflow-hidden bg-[#f4efe8] select-none touch-pan-y"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={onKeyDown}
    >
      {/* Slide Viewport */}
      <div
        className="relative h-full w-full overflow-hidden"
        onClickCapture={(e) => {
          if (dragDistanceRef.current > 12) {
            e.preventDefault();
            e.stopPropagation();
            dragDistanceRef.current = 0;
          }
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={reduceMotion ? reducedVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={() => {
              dragDistanceRef.current = 0;
            }}
            onDrag={(_, info) => {
              dragDistanceRef.current = Math.abs(info.offset.x);
            }}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (offset.x < -45 || swipe < -200) {
                paginate(1);
                registerUserInteraction();
              } else if (offset.x > 45 || swipe > 200) {
                paginate(-1);
                registerUserInteraction();
              }
            }}
            className="absolute inset-0 h-full w-full"
          >
            {currentSlide.ctaHref ? (
              <Link
                href={currentSlide.ctaHref}
                className="relative block h-full w-full cursor-pointer focus-visible:outline-none"
                tabIndex={0}
                aria-label={`${currentSlide.cta || "Shop"} — ${currentSlide.headline || currentSlide.eyebrow}`}
                draggable={false}
              >
                <HeroSlidePicture
                  slide={currentSlide}
                  priority={page === 0}
                />
              </Link>
            ) : (
              <HeroSlidePicture
                slide={currentSlide}
                priority={page === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle bottom vignette to ensure pill contrast on all slides */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-chocolate/20 via-chocolate/5 to-transparent z-10"
        aria-hidden="true"
      />

      {/* Side Navigation Chevrons */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => {
              paginate(-1);
              registerUserInteraction();
            }}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 flex size-10 sm:size-12 items-center justify-center rounded-full backdrop-blur-md bg-white/75 hover:bg-white text-chocolate/80 hover:text-chocolate shadow-[0_4px_24px_rgba(75,50,34,0.12)] border border-white/80 transition-all duration-300 hover:scale-105 active:scale-95 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-earth"
          >
            <Chevron
              direction="prev"
              size={20}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
          </button>

          <button
            type="button"
            onClick={() => {
              paginate(1);
              registerUserInteraction();
            }}
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 flex size-10 sm:size-12 items-center justify-center rounded-full backdrop-blur-md bg-white/75 hover:bg-white text-chocolate/80 hover:text-chocolate shadow-[0_4px_24px_rgba(75,50,34,0.12)] border border-white/80 transition-all duration-300 hover:scale-105 active:scale-95 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-earth"
          >
            <Chevron
              direction="next"
              size={20}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </>
      )}

      {/* Bottom Floating Control Island */}
      {count > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 sm:gap-3.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-xl bg-white/85 hover:bg-white/95 border border-white/80 shadow-[0_8px_32px_rgba(75,50,34,0.14)] transition-all duration-300">
          {/* Active slide index */}
          <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-wider text-chocolate/80 tabular-nums select-none">
            0{activeIndex + 1}
          </span>

          <span className="h-3 w-px bg-chocolate/15" aria-hidden="true" />

          {/* Slide Indicators with Progress Bar */}
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Hero slides"
          >
            {slides.map((item, slideIndex) => {
              const active = slideIndex === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  aria-selected={active}
                  onClick={() => {
                    jumpTo(slideIndex);
                    registerUserInteraction();
                  }}
                  className="relative flex items-center justify-center py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-earth"
                >
                  {active ? (
                    <span className="relative block h-1.5 sm:h-2 w-7 sm:w-9 overflow-hidden rounded-full bg-chocolate/20">
                      <span
                        key={page}
                        className="absolute inset-y-0 left-0 bg-chocolate rounded-full"
                        style={{
                          animation: isAutoplayActive
                            ? `hero-progress ${AUTOPLAY_MS}ms linear forwards`
                            : "none",
                          width: isAutoplayActive ? undefined : "100%",
                        }}
                      />
                    </span>
                  ) : (
                    <span className="block size-1.5 sm:size-2 rounded-full bg-chocolate/30 hover:bg-chocolate/65 transition-all duration-300 hover:scale-125" />
                  )}
                </button>
              );
            })}
          </div>

          <span className="h-3 w-px bg-chocolate/15" aria-hidden="true" />

          {/* Total slide count */}
          <span className="text-[11px] sm:text-xs font-sans text-chocolate/45 tracking-wider tabular-nums select-none">
            0{count}
          </span>

          {/* Autoplay Play/Pause Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsPaused((p) => !p);
              registerUserInteraction();
            }}
            aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            title={isPaused ? "Resume slideshow" : "Pause slideshow"}
            className="ml-0.5 flex size-5 sm:size-6 items-center justify-center rounded-full text-chocolate/60 hover:text-chocolate transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-earth"
          >
            {isPaused ? <PlayIcon size={10} /> : <PauseIcon size={10} />}
          </button>
        </div>
      )}

      {/* Screen Reader Announcement */}
      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {count}: {currentSlide.imageAlt}
      </p>
    </section>
  );
}
