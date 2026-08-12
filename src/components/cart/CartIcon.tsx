"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex h-11 w-11 items-center justify-center text-chocolate transition-colors hover:text-earth"
      aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : "Cart"}
    >
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
      {totalItems > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-earth px-1 font-sans text-[9px] font-medium text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
    </Link>
  );
}
