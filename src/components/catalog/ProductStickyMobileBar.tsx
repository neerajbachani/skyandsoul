"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatInr } from "@/lib/money";

type ProductStickyMobileBarProps = {
  productName: string;
  price: number;
  image: string;
  onAddToCart: () => void;
  isPending?: boolean;
  soldOut?: boolean;
};

export function ProductStickyMobileBar({
  productName,
  price,
  image,
  onAddToCart,
  isPending = false,
  soldOut = false,
}: ProductStickyMobileBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 450px
      setVisible(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-chocolate/10 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-4px_rgba(75,50,34,0.1)] backdrop-blur-md lg:hidden transition-transform duration-300 ease-out">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* Left: Thumbnail & Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-canvas ring-1 ring-chocolate/10">
            <Image
              src={image}
              alt={productName}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif text-sm font-medium text-chocolate">
              {productName}
            </p>
            <p className="font-sans text-xs font-semibold text-earth tabular-nums">
              {formatInr(price)}
            </p>
          </div>
        </div>

        {/* Right: Quick Purchase Button */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={isPending || soldOut}
          className="shrink-0 rounded-lg bg-earth px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition-colors hover:bg-earth/90 disabled:opacity-50"
        >
          {soldOut ? "Sold Out" : isPending ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
