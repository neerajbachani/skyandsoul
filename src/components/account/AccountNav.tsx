"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/account", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/orders", label: "Orders" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Account">
      {LINKS.map((link) => {
        const active =
          link.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.14em] ${
              active
                ? "border-earth bg-white text-earth"
                : "border-chocolate/15 text-chocolate/70 hover:border-earth/40"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
