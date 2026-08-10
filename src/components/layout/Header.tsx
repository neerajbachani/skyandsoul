"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-30 bg-canvas/95 backdrop-blur-sm transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_rgba(75,50,34,0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/logo.png"
              alt={`${SITE.name} logo`}
              width={52}
              height={52}
              className="h-12 w-12 rounded-full object-cover sm:h-[52px] sm:w-[52px]"
              priority
            />
            <div className="hidden min-[400px]:block">
              <p className="font-serif text-xl leading-none text-earth sm:text-2xl">
                {SITE.name.toLowerCase()}
              </p>
              <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.18em] text-chocolate/70">
                {SITE.tagline}
              </p>
            </div>
          </Link>

          <nav
            className="hidden items-center lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link, index) => (
              <span key={link.label} className="flex items-center">
                {index > 0 ? (
                  <span
                    className="mx-3 h-3 w-px bg-chocolate/25"
                    aria-hidden="true"
                  />
                ) : null}
                <Link
                  href={link.href}
                  className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-chocolate transition-colors hover:text-earth"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-chocolate transition-colors hover:text-earth"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-chocolate transition-colors hover:text-earth"
              aria-label="Cart"
            >
              <BagIcon />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-chocolate lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V7a3 3 0 016 0v1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
