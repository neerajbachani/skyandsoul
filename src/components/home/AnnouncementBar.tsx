import Link from "next/link";
import { RetroCta } from "@/components/ui/retro-cta";
import { SITE } from "@/lib/constants";

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      className="relative z-40 border-b border-[#1E3A4F]/15 bg-sky select-none"
    >
      <Link
        href="/collections"
        className="group mx-auto flex h-8 w-full max-w-7xl items-center justify-center gap-1.5 px-2 text-center transition-colors hover:bg-black/[0.03] sm:h-9 sm:gap-2.5 sm:px-4"
      >
        {/* Retro 3D Badge */}
        <RetroCta
          label="10% OFF"
          theme="mustard-navy"
          size="xs"
          className="shrink-0"
        />

        {/* Vintage Divider */}
        <span
          aria-hidden="true"
          className="shrink-0 text-[9px] text-[#1E3A4F]/50 sm:text-[10px]"
        >
          ✦
        </span>

        {/* Announcement Text (Single line on mobile & desktop) */}
        <p className="min-w-0 shrink font-sans text-[10px] font-medium tracking-[0.02em] text-chocolate truncate sm:text-xs">
          <span className="hidden sm:inline">{SITE.announcement}</span>
          <span className="inline sm:hidden">Free shipping ₹999+ · Flat 10% off</span>
        </p>

        {/* Vintage Divider */}
        <span
          aria-hidden="true"
          className="shrink-0 text-[9px] text-[#1E3A4F]/50 sm:text-[10px]"
        >
          ✦
        </span>

        {/* Retro 3D Action Label */}
        <RetroCta
          label="SHOP NOW"
          theme="mustard-navy"
          size="xs"
          className="shrink-0"
        />
      </Link>
    </aside>
  );
}
