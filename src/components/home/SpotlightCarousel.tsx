"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { SITE } from "@/lib/constants";
import type { ProductWithCategory } from "@/lib/types";

export type SpotlightProduct = Pick<
  ProductWithCategory,
  "slug" | "name" | "price" | "images" | "imageAlt"
> & {
  category: string | Pick<ProductWithCategory["category"], "name" | "slug">;
};

type SpotlightCarouselProps = {
  products: SpotlightProduct[];
};

const AUTOPLAY_MS = 3000;
const SWIPE_THRESHOLD = 0.18;

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

export function SpotlightCarousel({ products }: SpotlightCarouselProps) {
  const count = products.length;
  const loop = count > 1;
  const slides = loop ? [...products, ...products, ...products] : products;
  const startIndex = loop ? count : 0;

  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragDeltaRef = useRef(0);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const [index, setIndex] = useState(startIndex);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const selected = loop ? ((index % count) + count) % count : index;

  const snapClones = useCallback(
    (current: number) => {
      if (!loop) return;
      if (current < count) {
        setNoTransition(true);
        setIndex(current + count);
      } else if (current >= count * 2) {
        setNoTransition(true);
        setIndex(current - count);
      }
    },
    [count, loop],
  );

  const goTo = useCallback(
    (next: number) => {
      if (!loop) {
        setIndex(Math.max(0, Math.min(count - 1, next)));
        return;
      }
      setIndex(next);
    },
    [count, loop],
  );

  const go = useCallback(
    (delta: number) => {
      goTo(index + delta);
    },
    [goTo, index],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!noTransition) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setNoTransition(false));
    });
    return () => cancelAnimationFrame(frame);
  }, [noTransition, index]);

  useEffect(() => {
    if (!loop || paused || reduceMotion || dragging) return;
    const timer = window.setInterval(() => {
      goTo(index + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [dragging, goTo, index, loop, paused, reduceMotion]);

  function slideWidth() {
    const width = viewportRef.current?.clientWidth ?? 0;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    return width * (isDesktop ? 0.25 : 0.5);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || count < 2) return;
    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    dragDeltaRef.current = 0;
    draggingRef.current = false;
    suppressClickRef.current = false;
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    const delta = event.clientX - dragStartXRef.current;
    if (!draggingRef.current && Math.abs(delta) < 8) return;
    if (!draggingRef.current) {
      draggingRef.current = true;
      suppressClickRef.current = true;
      setDragging(true);
      viewportRef.current?.setPointerCapture(event.pointerId);
    }
    dragDeltaRef.current = delta;
    setDragX(delta);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    const delta = dragDeltaRef.current;
    const wasDragging = draggingRef.current;
    draggingRef.current = false;
    pointerIdRef.current = null;
    dragDeltaRef.current = 0;
    setDragging(false);
    setDragX(0);

    if (!wasDragging) return;
    const width = slideWidth();
    const threshold = Math.max(40, width * SWIPE_THRESHOLD);
    if (delta <= -threshold) goTo(index + 1);
    else if (delta >= threshold) goTo(index - 1);
  }

  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  if (count === 0) return null;

  const instant = noTransition || dragging || reduceMotion;
  const navButtonClass =
    "flex size-11 items-center justify-center text-chocolate transition-colors duration-300 hover:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth";

  return (
    <section
      className="overflow-hidden bg-sky py-20 sm:py-28"
      aria-roledescription="carousel"
      aria-label={`${SITE.name} spotlight`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mb-10 px-5 text-center sm:mb-14 sm:px-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          Spotlight
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
          {SITE.name} Spotlight
        </h2>
      </div>

      <div className="relative">
        <div
          ref={viewportRef}
          className="relative cursor-grab touch-pan-y select-none overflow-visible focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-earth active:cursor-grabbing"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          onKeyDown={onKeyDown}
        >
          <div
            className="pointer-events-none invisible w-1/2 px-2 pb-3 md:w-1/4 md:px-3 md:pb-4"
            aria-hidden="true"
            inert
          >
            <ProductCard product={products[0]} />
          </div>

          <div
            className={`absolute inset-0 [--center:25%] [--slide:50%] md:[--center:37.5%] md:[--slide:25%] ${
              instant
                ? ""
                : "transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            }`}
            style={{
              transform: `translate3d(calc(var(--center) - ${index} * var(--slide) + ${dragX}px), 0, 0)`,
            }}
            onTransitionEnd={(event) => {
              if (event.target !== event.currentTarget) return;
              if (dragging || noTransition) return;
              snapClones(index);
            }}
          >
            {slides.map((product, slideIndex) => {
              const isSelected = slideIndex === index;
              return (
                <div
                  key={`${product.slug}-${slideIndex}`}
                  className={`absolute top-0 left-0 w-1/2 md:w-1/4 ${
                    isSelected ? "z-10" : "z-0"
                  }`}
                  style={{ transform: `translateX(${slideIndex * 100}%)` }}
                  aria-hidden={!isSelected}
                >
                  <div
                    className={`origin-center px-2 pb-3 transition-transform duration-[250ms] ease-in-out md:px-3 md:pb-4 ${
                      isSelected
                        ? "scale-100 md:scale-90"
                        : "scale-[0.8] md:scale-[0.7]"
                    }`}
                  >
                    <ProductCard product={product} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {loop ? (
          <div className="mt-8 hidden items-center justify-center gap-6 md:flex">
            <button
              type="button"
              className={navButtonClass}
              aria-label="Previous"
              onClick={() => go(-1)}
            >
              <Chevron direction="prev" />
            </button>
            <div
              className="flex items-center justify-center gap-1"
              role="tablist"
              aria-label="Spotlight slides"
            >
              {products.map((product, dotIndex) => {
                const active = dotIndex === selected;
                return (
                  <button
                    key={product.slug}
                    type="button"
                    role="tab"
                    aria-label={`Go to ${product.name}`}
                    aria-selected={active}
                    className="flex size-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth"
                    onClick={() => {
                      if (!loop) {
                        goTo(dotIndex);
                        return;
                      }
                      const current = ((index % count) + count) % count;
                      let delta = dotIndex - current;
                      if (delta > count / 2) delta -= count;
                      if (delta < -count / 2) delta += count;
                      goTo(index + delta);
                    }}
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
              aria-label="Next"
              onClick={() => go(1)}
            >
              <Chevron direction="next" />
            </button>
          </div>
        ) : null}

        <div className="mt-10 flex justify-center px-5 sm:mt-12">
          <Button href="/collections" showArrow>
            View All
          </Button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {products[selected]?.name}
      </p>
    </section>
  );
}
