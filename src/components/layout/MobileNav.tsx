"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useAuthStatus, useLogout } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { NAV_LINKS, SITE } from "@/lib/constants";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { isAuthenticated, user, isLoading } = useAuthStatus();
  const logout = useLogout();

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = getFocusable(panel);
    focusable[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const items = getFocusable(panel);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    onClose();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  }

  function handleClearSearch() {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }

  const digits = SITE.phones[0].replace(/\D/g, "");
  const whatsAppHref = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hi! I'm interested in Sky n Soul. Could you help me with my order or a product question?",
  )}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-chocolate/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Drawer Panel */}
      <aside
        ref={panelRef}
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(100%,22.5rem)] flex-col bg-canvas shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal={open}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-chocolate/10 bg-canvas/95 px-5 py-3.5 backdrop-blur-sm">
          <Link
            href="/"
            onClick={onClose}
            className="flex shrink-0 items-center"
          >
            <Image
              src="/logo-horizontal.png"
              alt={`${SITE.name} — ${SITE.tagline}`}
              width={220}
              height={66}
              className="h-11 w-auto object-contain sm:h-12"
              style={{ width: "auto", height: "auto", maxHeight: "3rem" }}
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-chocolate transition-colors hover:bg-chocolate/5 hover:text-earth"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-6">
          {/* Search Form */}
          <div>
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              className="relative flex items-center"
            >
              <label htmlFor="mobile-nav-search" className="sr-only">
                Search blankets, toys, frames
              </label>
              <span
                className="pointer-events-none absolute left-3.5 flex items-center text-chocolate/50"
                aria-hidden="true"
              >
                <SearchIcon />
              </span>
              <input
                ref={searchInputRef}
                id="mobile-nav-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search blankets, toys, frames…"
                className="w-full rounded-xl border border-chocolate/15 bg-white py-2.5 pl-10 pr-9 font-sans text-xs text-chocolate placeholder:text-chocolate/40 transition-colors focus:border-earth focus:outline-none focus:ring-1 focus:ring-earth"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-full text-chocolate/40 transition-colors hover:bg-chocolate/5 hover:text-chocolate"
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </button>
              ) : null}
            </form>
          </div>

          {/* Quick Actions: Cart & Wishlist */}
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/cart"
              onClick={onClose}
              className="group flex items-center justify-between rounded-xl border border-chocolate/10 bg-white p-3 shadow-xs transition-all hover:border-earth/40 hover:shadow-sm active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <span className="text-chocolate transition-colors group-hover:text-earth">
                  <BagIcon />
                </span>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-chocolate group-hover:text-earth">
                  Cart
                </span>
              </div>
              {totalItems > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-earth px-1.5 font-sans text-[10px] font-semibold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-chocolate/5 px-1.5 font-sans text-[10px] font-medium text-chocolate/40">
                  0
                </span>
              )}
            </Link>

            <div
              className="flex cursor-default items-center justify-between rounded-xl border border-chocolate/10 bg-white/70 p-3 shadow-xs"
              aria-disabled="true"
              title="Wishlist coming soon"
            >
              <div className="flex items-center gap-2">
                <span className="text-chocolate/40">
                  <HeartIcon />
                </span>
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-chocolate/60">
                  Wishlist
                </span>
              </div>
              <span className="rounded-full bg-chocolate/8 px-1.5 py-0.5 font-sans text-[9px] font-medium uppercase tracking-wider text-chocolate/60">
                Soon
              </span>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <div className="space-y-1.5">
            <p className="px-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-chocolate/40">
              Collections
            </p>
            <nav
              className="flex flex-col gap-1"
              aria-label="Mobile Navigation Links"
            >
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/collections" &&
                    pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-3 font-sans text-xs uppercase tracking-[0.16em] transition-all active:scale-[0.99] ${
                      isActive
                        ? "border border-chocolate/10 bg-white font-semibold text-earth shadow-xs"
                        : "text-chocolate hover:bg-white hover:text-earth"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-earth" />
                    ) : (
                      <ChevronRightIcon className="text-chocolate/30 transition-transform group-hover:translate-x-0.5 group-hover:text-earth" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Account & Authentication Section */}
          <div className="space-y-1.5">
            <p className="px-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-chocolate/40">
              Account
            </p>
            <div className="rounded-xl border border-chocolate/10 bg-white p-3.5 shadow-xs">
              {isLoading ? (
                <div className="flex items-center gap-3 py-1.5 text-chocolate/40">
                  <AccountIcon />
                  <span className="font-sans text-xs">Loading account…</span>
                </div>
              ) : isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b border-chocolate/10 pb-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-earth">
                      <AccountIcon />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[10px] uppercase tracking-wider text-chocolate/50">
                        Signed in as
                      </p>
                      <p className="truncate font-sans text-xs font-semibold text-chocolate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 font-sans text-xs uppercase tracking-[0.12em] text-chocolate transition-colors hover:bg-canvas hover:text-earth"
                    >
                      <span>My Account</span>
                      <ChevronRightIcon className="text-chocolate/30" />
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={onClose}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 font-sans text-xs uppercase tracking-[0.12em] text-chocolate transition-colors hover:bg-canvas hover:text-earth"
                    >
                      <span>Orders & Tracking</span>
                      <ChevronRightIcon className="text-chocolate/30" />
                    </Link>
                    {user?.role === "ADMIN" ? (
                      <Link
                        href="/admin"
                        onClick={onClose}
                        className="flex items-center justify-between rounded-lg px-2.5 py-2 font-sans text-xs uppercase tracking-[0.12em] text-chocolate transition-colors hover:bg-canvas hover:text-earth"
                      >
                        <span>Admin Dashboard</span>
                        <ChevronRightIcon className="text-chocolate/30" />
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={async () => {
                        await logout.mutateAsync();
                        onClose();
                      }}
                      className="mt-1 flex w-full items-center justify-between rounded-lg border-t border-chocolate/10 px-2.5 pt-2.5 text-left font-sans text-xs uppercase tracking-[0.12em] text-chocolate/70 transition-colors hover:text-earth"
                    >
                      <span>Sign out</span>
                      <SignOutIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="group flex items-center justify-between py-1 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-chocolate transition-colors group-hover:text-earth">
                      <AccountIcon />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-chocolate group-hover:text-earth">
                        Sign In / Register
                      </p>
                      <p className="font-sans text-[11px] text-chocolate/50">
                        Orders, wishlist & profile
                      </p>
                    </div>
                  </div>
                  <ChevronRightIcon className="text-chocolate/30 transition-transform group-hover:translate-x-0.5 group-hover:text-earth" />
                </Link>
              )}
            </div>
          </div>

          {/* Footer Branding & Support */}
          <div className="space-y-4 border-t border-chocolate/10 pt-5">
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/15 py-3 font-sans text-xs font-semibold text-[#0d734d] transition-colors hover:bg-[#25D366]/25 active:scale-[0.99]"
            >
              <WhatsAppIcon />
              <span>Chat on WhatsApp</span>
            </a>

            <div className="rounded-xl bg-chocolate/5 p-4 text-center">
              <p className="font-serif text-sm font-medium italic text-chocolate">
                “{SITE.tagline}”
              </p>
              <div className="mt-2.5 flex flex-col items-center gap-1 font-sans text-[11px] text-chocolate/70">
                <a
                  href={`tel:${SITE.phones[0]}`}
                  className="transition-colors hover:text-earth"
                >
                  Customer Care: {SITE.phones[0]}
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="transition-colors hover:text-earth"
                >
                  {SITE.email}
                </a>
                <span className="mt-0.5 text-[10px] text-chocolate/50">
                  {SITE.hours}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function getFocusable(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

function CloseIcon() {
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
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function ClearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function HeartIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function AccountIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={className}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}
