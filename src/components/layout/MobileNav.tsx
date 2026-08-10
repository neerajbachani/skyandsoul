"use client";

import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-chocolate/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(100%,20rem)] flex-col bg-canvas shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-chocolate/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={SITE.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-serif text-lg text-earth">{SITE.name}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-chocolate"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-5 py-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={onClose}
              className="border-b border-chocolate/10 py-4 font-sans text-xs font-medium uppercase tracking-[0.16em] text-chocolate transition-colors hover:text-earth"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
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
