"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CategoryNavItem = {
  id: string;
  label: string;
  count?: number;
  isSpecial?: boolean;
};

const NAV_ITEMS: CategoryNavItem[] = [
  { id: "collections-grid", label: "Overview" },
  { id: "blankets", label: "Blankets", count: 7 },
  { id: "toys", label: "Toys", count: 6 },
  { id: "frames", label: "Frames", count: 9 },
  { id: "frame-it-your-way", label: "Frame It Your Way", isSpecial: true },
  { id: "little-extras", label: "Little Extras", count: 10 },
];

export function CollectionsCategoryNav() {
  const [activeId, setActiveId] = useState<string>("collections-grid");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Collections Sub Navigation"
      className="sticky top-0 z-20 border-b border-chocolate/10 bg-canvas/95 backdrop-blur-md transition-all"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-5 py-3 no-scrollbar sm:px-8">
        <ul className="flex items-center gap-1.5 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.14em] transition-all duration-200 ${
                    isActive
                      ? "bg-chocolate text-white shadow-sm"
                      : item.isSpecial
                        ? "border border-sage/40 bg-white text-earth hover:border-earth hover:text-chocolate"
                        : "bg-white/70 text-chocolate/75 hover:bg-white hover:text-chocolate"
                  }`}
                >
                  {item.isSpecial && (
                    <span className="text-[10px]" aria-hidden="true">
                      ✦
                    </span>
                  )}
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] tabular-nums ${
                        isActive ? "text-white/75" : "text-chocolate/45"
                      }`}
                    >
                      ({item.count})
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <Link
            href="/search"
            className="flex items-center gap-1.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-chocolate/70 transition-colors hover:text-earth"
          >
            <span>Search</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
