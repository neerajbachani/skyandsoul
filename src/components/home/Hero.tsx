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
const COPY_EXIT_MS = 150;

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
  const pendingRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hidden, setHidden] = useState(false);

  const clearExit = useCallback(() => {
    if (exitTimerRef.current === null) return;
    window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = null;
  }, []);

  const goTo = useCallback(
    (target: number, travel: boolean) => {
      const base = pendingRef.current ?? indexRef.current;
      const next = ((target % count) + count) % count;
      if (next === base && pendingRef.current === null) return;

      clearExit();

      if (!travel || reduceMotion) {
        pendingRef.current = null;
        indexRef.current = next;
        setIndex(next);
        setPhase("idle");
        return;
      }

      pendingRef.current = next;
      setPhase("out");
      exitTimerRef.current = window.setTimeout(() => {
        exitTimerRef.current = null;
        pendingRef.current = null;
        indexRef.current = next;
        setIndex(next);
        setPhase("in");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhase("idle"));
        });
      }, COPY_EXIT_MS);
    },
    [clearExit, count, reduceMotion],
  );

  const go = useCallback(
    (delta: number, travel: boolean) => {
      const base = pendingRef.current ?? indexRef.current;
      goTo(base + delta, travel);
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

  useEffect(() => clearExit, [clearExit]);

  useEffect(() => {
    if (paused || reduceMotion || hidden || count < 2) return;
    const timer = window.setInterval(() => {
      go(1, true);
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
    if (delta <= -SWIPE_THRESHOLD) go(1, true);
    else if (delta >= SWIPE_THRESHOLD) go(-1, true);
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
      go(1, false);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1, false);
    }
  }

  const copyMotion =
    phase === "out"
      ? "pointer-events-none translate-y-0 opacity-0 blur-[4px] transition-[opacity,filter] duration-150 ease-[cubic-bezier(0.2,0,0,1)]"
      : phase === "in"
        ? "pointer-events-none translate-y-3 opacity-0 blur-0 transition-none"
        : "translate-y-0 opacity-100 blur-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none";
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
                className={`object-cover object-[88%_center] md:object-center ${photoFade} ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[min(40rem,54%)] bg-gradient-to-r from-canvas/90 via-canvas/45 to-transparent md:block"
        />

        <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 bg-gradient-to-t from-chocolate/35 via-chocolate/10 to-transparent pb-2 pt-10 md:bottom-6 md:from-transparent md:via-transparent md:pb-0 md:pt-0">
          <button
            type="button"
            className={`${navButtonClass} max-md:text-white max-md:hover:text-white/85`}
            aria-label="Previous slide"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => go(-1, true)}
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
                  onClick={() => goTo(slideIndex, true)}
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
            onClick={() => go(1, true)}
          >
            <Chevron direction="next" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-5 pt-8 pb-10 sm:px-8 md:flex md:min-h-[70vh] md:items-center md:pt-20 md:pb-24 lg:min-h-[78vh]">
        <div className={`pointer-events-auto max-w-md lg:max-w-xl ${copyMotion}`}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            {slide.eyebrow}
          </p>
          <div className="mt-3 flex items-center justify-between gap-4 md:mt-4 md:block">
            <h1 className="min-w-0 flex-1 font-serif text-[1.65rem] font-medium leading-[1.12] text-balance text-chocolate sm:text-4xl md:mt-0 md:flex-none md:text-5xl lg:text-6xl">
              {slide.headline}
            </h1>
            <Link
              href={slide.ctaHref}
              className="inline-flex shrink-0 items-center gap-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-chocolate no-underline transition-colors duration-150 ease-out hover:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth md:hidden"
            >
              <span>{slide.cta}</span>
              <Chevron direction="next" size={16} />
            </Link>
          </div>
          <p className="mt-4 max-w-[28ch] font-serif text-lg italic leading-relaxed text-earth sm:text-2xl md:mt-6 md:text-xl">
            {slide.subheadline}
          </p>
          <div className="mt-8 hidden md:block md:mt-10">
            <Button href={slide.ctaHref} showArrow>
              {slide.cta}
            </Button>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {slide.headline}
      </p>
    </section>
  );
}
