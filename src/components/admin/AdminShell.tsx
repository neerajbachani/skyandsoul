"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Collections" },
  { href: "/admin/customers", label: "Customers" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas text-chocolate">
      <header className="border-b border-chocolate/10 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-sage">
              Sky n Soul
            </p>
            <p className="font-serif text-2xl text-chocolate">Studio</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden font-sans text-xs text-chocolate/60 sm:block">{email}</p>
            <Link
              href="/"
              className="font-sans text-[11px] uppercase tracking-[0.14em] text-earth underline underline-offset-4"
            >
              View shop
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3" aria-label="Admin">
          {LINKS.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap px-3 py-2 font-sans text-[11px] uppercase tracking-[0.14em] ${
                  active ? "bg-chocolate text-white" : "text-chocolate/70 hover:text-earth"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
