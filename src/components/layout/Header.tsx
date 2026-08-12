"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartIcon } from "@/components/cart/CartIcon";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuthStatus, useLogout } from "@/hooks/useAuth";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { isAuthenticated, user, isLoading } = useAuthStatus();
  const logout = useLogout();

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
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 lg:grid-cols-[auto_1fr_auto] lg:px-8">
          <Link href="/" className="flex shrink-0 items-center justify-self-start">
            <Image
              src="/logo-horizontal.png"
              alt={`${SITE.name} — ${SITE.tagline}`}
              width={450}
              height={106}
              className="h-12 w-auto object-contain sm:h-14"
              style={{ width: "auto", height: "auto", maxHeight: "3.5rem" }}
              priority
            />
          </Link>

          <nav
            className="hidden items-center justify-center lg:flex"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link, index) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/collections" &&
                  pathname.startsWith(link.href));

              return (
                <span key={link.label} className="flex items-center">
                  {index > 0 ? (
                    <span
                      className="mx-2 select-none font-sans text-[10px] text-chocolate/30 xl:mx-3"
                      aria-hidden="true"
                    >
                      |
                    </span>
                  ) : null}
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`whitespace-nowrap font-sans text-[10px] font-medium uppercase tracking-[0.14em] transition-colors hover:text-earth xl:text-[11px] xl:tracking-[0.16em] ${
                      isActive ? "text-earth" : "text-chocolate"
                    }`}
                  >
                    {link.label}
                  </Link>
                </span>
              );
            })}
          </nav>

          <div className="relative flex items-center justify-self-end gap-1">
            <Link
              href="/search"
              className="flex h-11 w-11 items-center justify-center text-chocolate transition-colors hover:text-earth"
              aria-label="Search"
            >
              <SearchIcon />
            </Link>

            {isLoading ? (
              <span className="flex h-11 w-11 items-center justify-center text-chocolate/30">
                <AccountIcon />
              </span>
            ) : isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center text-chocolate transition-colors hover:text-earth"
                  aria-label="Account menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <AccountIcon />
                </button>
                {accountOpen ? (
                  <div className="absolute right-0 top-full z-40 mt-2 w-48 border border-chocolate/10 bg-white py-2 shadow-md">
                    <p className="truncate px-4 py-2 font-sans text-xs text-chocolate/60">
                      {user?.email}
                    </p>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 font-sans text-xs uppercase tracking-[0.12em] text-chocolate hover:bg-canvas"
                      onClick={() => setAccountOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      type="button"
                      className="block w-full px-4 py-2 text-left font-sans text-xs uppercase tracking-[0.12em] text-chocolate hover:bg-canvas"
                      onClick={async () => {
                        await logout.mutateAsync();
                        setAccountOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex h-11 w-11 items-center justify-center text-chocolate transition-colors hover:text-earth"
                aria-label="Sign in"
              >
                <AccountIcon />
              </Link>
            )}

            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-chocolate transition-colors hover:text-earth disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-chocolate"
              aria-label="Wishlist (coming soon)"
              title="Wishlist coming soon"
              disabled
            >
              <HeartIcon />
            </button>

            <CartIcon />

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

function AccountIcon() {
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
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.8-3.2 4.2-4.5 7-4.5s5.2 1.3 7 4.5" />
    </svg>
  );
}

function HeartIcon() {
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
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />
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
