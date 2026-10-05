"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

export type CollectionHeroSlide = {
  src: string;
  alt: string;
};

type CollectionHeroSliderProps = {
  slides: readonly CollectionHeroSlide[];
  label?: string;
};

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

export function CollectionHeroSlider({
  slides,
  label = "Collection highlights",
}: CollectionHeroSliderProps) {
  const count = slides.length;
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const deltaXRef = useRef(0);
  const draggingRef = useRef(false);

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
    event.currentTarget.setPointerCapture(event.pointerId);
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

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  const slideMotion = reduceMotion
    ? ""
    : "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";
  const navButtonClass =
    "flex size-11 items-center justify-center text-white transition-opacity duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  const active = slides[index];

  return (
    <div
      tabIndex={0}
      className="relative aspect-[4/3] touch-pan-y overflow-hidden bg-sky/20 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-earth"
      aria-roledescription="carousel"
      aria-label={label}
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
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`flex h-full ${slideMotion}`}
          style={{
            width: `${count * 100}%`,
            transform: `translateX(-${(index * 100) / count}%)`,
          }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.src}
              className="relative h-full"
              style={{ width: `${100 / count}%` }}
              aria-hidden={slideIndex !== index}
            >
              <Image
                src={slide.src}
                alt={slideIndex === index ? slide.alt : ""}
                fill
                priority={slideIndex === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-1 bg-gradient-to-t from-chocolate/40 to-transparent pb-1 pt-10">
        <button
          type="button"
          className={navButtonClass}
          aria-label="Previous slide"
          onClick={() => go(-1)}
        >
          <Chevron direction="prev" />
        </button>
        <div className="flex items-center justify-center gap-1" role="tablist" aria-label={label}>
          {slides.map((slide, slideIndex) => {
            const selected = slideIndex === index;
            return (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-label={`Go to ${slide.alt}`}
                aria-selected={selected}
                className="flex size-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => setIndex(slideIndex)}
              >
                <span
                  className={`block size-2 rounded-full bg-white transition-opacity duration-300 ${
                    selected ? "opacity-100" : "opacity-45 hover:opacity-70"
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
        {active?.alt}
      </p>
    </div>
  );
}
