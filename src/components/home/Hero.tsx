"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

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

const photoFade =
  "transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none";

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
  const indexRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hidden, setHidden] = useState(false);

  const goTo = useCallback(
    (target: number) => {
      const next = ((target % count) + count) % count;
      if (next === indexRef.current) return;
      indexRef.current = next;
      setIndex(next);
    },
    [count],
  );

  const go = useCallback(
    (delta: number) => {
      goTo(indexRef.current + delta);
    },
    [goTo],
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
      go(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, go, hidden, index, paused, reduceMotion]);

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

  const navButtonClass =
    "flex size-11 items-center justify-center text-chocolate transition-colors duration-300 hover:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth";
  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      tabIndex={0}
      className="relative w-full touch-pan-y bg-canvas select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-earth md:min-h-[70vh] md:overflow-hidden md:bg-sky/40 lg:min-h-[78vh]"
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
              className="absolute inset-0"
              aria-hidden={!active}
            >
              <Image
                src={item.image}
                alt={active ? item.imageAlt : ""}
                fill
                priority={slideIndex === 0}
                sizes="100vw"
                className={`object-cover object-center ${photoFade} ${
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
                  aria-label={`Go to slide ${slideIndex + 1}`}
                  aria-selected={active}
                  className="flex size-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth max-md:focus-visible:outline-white"
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() => goTo(slideIndex)}
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

      <p className="sr-only" aria-live="polite">
        {slide.imageAlt}
      </p>
    </section>
  );
}
