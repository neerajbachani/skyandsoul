import Image from "next/image";
import Link from "next/link";
import {
  FOOTER_CARE_LINKS,
  FOOTER_SHOP_LINKS,
  SITE,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-chocolate text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={SITE.name}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p className="font-serif text-2xl text-white/95">
                {SITE.name.toLowerCase()}
              </p>
              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-white/60">
                {SITE.tagline}
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-sm font-serif text-lg leading-relaxed text-white/75">
            Handmade keepsakes for the little moments that become forever.
          </p>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sky">
            Shop
          </h2>
          <ul className="mt-5 space-y-3">
            {FOOTER_SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-white/75 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sky">
            Customer Care
          </h2>
          <ul className="mt-5 space-y-3">
            {FOOTER_CARE_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-sans text-sm text-white/75 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sky">
            Follow Along
          </h2>
          <p className="mt-5 font-serif text-base text-white/75">
            Stories, new arrivals, and quiet moments from the nest.
          </p>
          <div className="mt-5 flex gap-4">
            <SocialLink href="#" label="Instagram">
              IG
            </SocialLink>
            <SocialLink href="#" label="Pinterest">
              PI
            </SocialLink>
            <SocialLink href="#" label="Email">
              EM
            </SocialLink>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="font-sans text-xs text-white/50">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-sans text-xs text-white/50">
            Crafted with love · Built to last
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border border-white/25 font-sans text-[10px] tracking-[0.12em] text-white/80 transition-colors hover:border-sky hover:text-sky"
    >
      {children}
    </Link>
  );
}
