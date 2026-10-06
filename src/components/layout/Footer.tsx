import Image from "next/image";
import Link from "next/link";
import { CloudShader } from "@/components/ui/cloud-shader";
import {
  FOOTER_CARE_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SHOP_LINKS,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/constants";
import type { SocialLink as SocialLinkType } from "@/lib/types";

export function Footer() {
  return (
    <footer className="bg-chocolate text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex bg-canvas p-1.5">
            <CloudShader
              className="!h-auto !min-h-0 !w-auto px-4 py-3 sm:px-5"
              speed={0.45}
              count={4}
              cloudColor="#ffffff"
              skyTopColor="#c3d4e4"
              skyBottomColor="#fafaf8"
            >
              <Image
                src="/logo-horizontal.png"
                alt={`${SITE.name} — ${SITE.tagline}`}
                width={450}
                height={106}
                className="h-16 w-auto object-contain sm:h-20"
                style={{ width: "auto", height: "auto", maxHeight: "5rem" }}
              />
            </CloudShader>
          </Link>
          <p className="mt-6 max-w-sm font-serif text-lg leading-relaxed text-white/80">
            Handmade keepsakes for the little moments that become forever.
          </p>
          <address className="mt-5 not-italic font-serif text-sm leading-relaxed text-white/70">
            {SITE.address.line1}
            <br />
            {SITE.address.city}, {SITE.address.pincode}
            <br />
            <span className="mt-2 block">{SITE.hours}</span>
          </address>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white">
            Shop
          </h2>
          <ul className="mt-5 space-y-3">
            {FOOTER_SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white">
            Customer Care
          </h2>
          <ul className="mt-5 space-y-3">
            {FOOTER_CARE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white">
            Follow Along
          </h2>
          <p className="mt-5 font-serif text-base text-white/80">
            Stories, new arrivals, and quiet moments from the nest.
          </p>
          <div className="mt-5 flex gap-4">
            {SOCIAL_LINKS.map((link) => (
              <SocialLink key={link.network} link={link} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="font-sans text-xs text-white/60">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-xs text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ link }: { link: SocialLinkType }) {
  const isExternal = link.href.startsWith("http");

  return (
    <Link
      href={link.href}
      aria-label={link.label}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-chocolate"
    >
      <SocialIcon network={link.network} />
    </Link>
  );
}

function SocialIcon({ network }: { network: SocialLinkType["network"] }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true as const,
  };

  if (network === "instagram") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (network === "pinterest") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5c-2.2 0-3.8 1.4-3.8 3.4 0 1.3.5 2.1 1.6 2.4.1 0 .2 0 .2-.1l.4-1.5s0-.2-.1-.2c-.4-.4-.6-.9-.6-1.5 0-1.4 1.1-2.6 2.9-2.6 1.6 0 2.5 1 2.5 2.3 0 1.8-.8 3-2 3-.6 0-1.1-.5-1-.1l.4 1.6c.1.5.2 1 .3 1.5.6-.1 1.1-.4 1.6-.7C15.9 14.9 17 13 17 10.6 17 8.3 15 6.5 12 6.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}
