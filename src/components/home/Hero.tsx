"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export type HeroSlideContent = {
  id: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  cta: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
};

const AUTOPLAY_MS = 3000;
const SWIPE_THRESHOLD = 48;

function Chevron({
  direction,
  size = 22,
}: {
  direction: "prev" | "next";
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "prev" ? (
        <path d="M15 5l-7 7 7 7" />
      ) : (
        <path d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

export function Hero({ slides }: { slides: readonly HeroSlideContent[] }) {
  const count = slides.length;
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const deltaXRef = useRef(0);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hidden, setHidden] = useState(false);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || hidden || count < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, hidden, index, paused, reduceMotion]);

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0 || count < 2) return;
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    deltaXRef.current = 0;
    draggingRef.current = false;
    suppressClickRef.current = false;
  }

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    const deltaX = event.clientX - startXRef.current;
    const deltaY = event.clientY - startYRef.current;
    if (!draggingRef.current) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        pointerIdRef.current = null;
        return;
      }
      if (Math.abs(deltaX) < 8) return;
      draggingRef.current = true;
      suppressClickRef.current = true;
    }
    deltaXRef.current = deltaX;
  }

  function endDrag(event: React.PointerEvent<HTMLElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    const delta = deltaXRef.current;
    const wasDragging = draggingRef.current;
    pointerIdRef.current = null;
    deltaXRef.current = 0;
    draggingRef.current = false;
    if (!wasDragging) return;
    if (delta <= -SWIPE_THRESHOLD) go(1);
    else if (delta >= SWIPE_THRESHOLD) go(-1);
  }

  function onClickCapture(event: React.MouseEvent<HTMLElement>) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  const fade = reduceMotion
    ? ""
    : "transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";
  const navButtonClass =
    "flex size-11 items-center justify-center text-chocolate transition-colors duration-300 hover:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth";
  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      tabIndex={0}
      className="relative flex w-full flex-col touch-pan-y bg-canvas select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-earth md:block md:min-h-[70vh] md:overflow-hidden md:bg-sky/40 lg:min-h-[78vh]"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
    >
      <div
        className="relative h-[64vh] max-h-[30rem] min-h-[18.5rem] w-full shrink-0 overflow-hidden bg-sky/40 md:absolute md:inset-0 md:h-auto md:max-h-none md:min-h-[70vh] lg:min-h-[78vh]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((item, slideIndex) => {
          const active = slideIndex === index;
          return (
            <div
              key={item.id}
              className="absolute inset-y-0 right-0 w-[138%] max-md:left-auto max-md:max-w-none md:inset-0 md:w-full"
              aria-hidden={!active}
            >
              <Image
                src={item.image}
                alt={active ? item.imageAlt : ""}
                fill
                priority={slideIndex === 0}
                sizes="100vw"
                className={`object-cover object-[88%_center] md:object-center ${fade} ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}

        <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 bg-gradient-to-t from-chocolate/35 via-chocolate/10 to-transparent pb-2 pt-10 md:bottom-6 md:from-transparent md:via-transparent md:pb-0 md:pt-0">
          <button
            type="button"
            className={`${navButtonClass} max-md:text-white max-md:hover:text-white/85`}
            aria-label="Previous slide"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => go(-1)}
          >
            <Chevron direction="prev" />
          </button>
          <div
            className="flex items-center justify-center gap-1"
            role="tablist"
            aria-label="Hero slides"
          >
            {slides.map((item, slideIndex) => {
              const active = slideIndex === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-label={`Go to ${item.eyebrow}`}
                  aria-selected={active}
                  className="flex size-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth max-md:focus-visible:outline-white"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => setIndex(slideIndex)}
                >
                  <span
                    className={`block size-2 rounded-full transition-opacity duration-300 max-md:bg-white md:bg-chocolate ${
                      active ? "opacity-100" : "opacity-30 hover:opacity-55"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className={`${navButtonClass} max-md:text-white max-md:hover:text-white/85`}
            aria-label="Next slide"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => go(1)}
          >
            <Chevron direction="next" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-5 pt-8 pb-10 sm:px-8 md:flex md:min-h-[70vh] md:items-center md:pt-20 md:pb-24 lg:min-h-[78vh]">
        <div className="pointer-events-auto grid max-w-xl">
          {slides.map((item, slideIndex) => {
            const active = slideIndex === index;
            const Heading = active ? "h1" : "p";
            return (
              <div
                key={item.id}
                className={`col-start-1 row-start-1 ${fade} ${
                  active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!active}
                {...(active ? {} : { inert: true })}
              >
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  {item.eyebrow}
                </p>
                <div className="mt-3 flex items-center justify-between gap-4 md:mt-4 md:block">
                  <Heading className="min-w-0 flex-1 font-serif text-[1.65rem] font-medium leading-[1.12] text-balance text-chocolate sm:text-4xl md:mt-0 md:flex-none md:text-5xl lg:text-7xl">
                    {item.headline}
                  </Heading>
                  <Link
                    href={item.ctaHref}
                    className="inline-flex shrink-0 items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-chocolate no-underline transition-colors duration-300 hover:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth md:hidden"
                  >
                    <span>{item.cta}</span>
                    <Chevron direction="next" size={16} />
                  </Link>
                </div>
                <p className="mt-4 font-serif text-lg italic leading-relaxed text-earth md:mt-6 md:text-xl sm:text-2xl">
                  {item.subheadline}
                </p>
                <div className="mt-8 hidden md:block md:mt-10">
                  <Button href={item.ctaHref} showArrow>
                    {item.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {slide.headline}
      </p>
    </section>
  );
}
