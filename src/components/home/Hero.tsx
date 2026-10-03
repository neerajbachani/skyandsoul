"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { HERO_SLIDES } from "@/lib/constants";

const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 48;

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
      {direction === "prev" ? (
        <path d="M15 5l-7 7 7 7" />
      ) : (
        <path d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

export function Hero() {
  const count = HERO_SLIDES.length;
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
  const slide = HERO_SLIDES[index];

  return (
    <section
      tabIndex={0}
      className="relative min-h-[70vh] w-full touch-pan-y overflow-hidden bg-sky/40 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-earth lg:min-h-[78vh]"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
      {HERO_SLIDES.map((item, slideIndex) => {
        const active = slideIndex === index;
        return (
          <div
            key={item.image}
            className="absolute inset-0"
            aria-hidden={!active}
          >
            <Image
              src={item.image}
              alt={active ? item.imageAlt : ""}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className={`object-cover ${item.objectPosition} ${fade} ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-canvas via-canvas/80 to-transparent lg:from-canvas/90 lg:via-canvas/55" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 pt-20 pb-24 sm:px-8 lg:min-h-[78vh]">
        <div className="grid max-w-xl">
          {HERO_SLIDES.map((item, slideIndex) => {
            const active = slideIndex === index;
            const Heading = active ? "h1" : "p";
            return (
              <div
                key={item.eyebrow}
                className={`col-start-1 row-start-1 ${fade} ${
                  active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden={!active}
                {...(active ? {} : { inert: true })}
              >
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                  {item.eyebrow}
                </p>
                <Heading className="mt-4 font-serif text-5xl font-medium leading-[1.1] text-balance text-chocolate sm:text-6xl lg:text-7xl">
                  {item.headline}
                </Heading>
                <p className="mt-6 font-serif text-xl italic leading-relaxed text-earth sm:text-2xl">
                  {item.subheadline}
                </p>
                <div className="mt-10">
                  <Button href={item.ctaHref} showArrow>
                    {item.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2 sm:bottom-6">
        <button
          type="button"
          className={navButtonClass}
          aria-label="Previous slide"
          onClick={() => go(-1)}
        >
          <Chevron direction="prev" />
        </button>
        <div className="flex items-center justify-center gap-1" role="tablist" aria-label="Hero slides">
          {HERO_SLIDES.map((item, slideIndex) => {
            const active = slideIndex === index;
            return (
              <button
                key={item.eyebrow}
                type="button"
                role="tab"
                aria-label={`Go to ${item.eyebrow}`}
                aria-selected={active}
                className="flex size-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth"
                onClick={() => setIndex(slideIndex)}
              >
                <span
                  className={`block size-2 rounded-full bg-chocolate transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-30 hover:opacity-55"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={navButtonClass}
          aria-label="Next slide"
          onClick={() => go(1)}
        >
          <Chevron direction="next" />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {slide.headline}
      </p>
    </section>
  );
}
