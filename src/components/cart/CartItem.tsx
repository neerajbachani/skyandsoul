"use client";

import Image from "next/image";
import Link from "next/link";
import { formatInr } from "@/lib/money";
import { useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import type { CartLineItem } from "@/types/cart";

type CartItemProps = {
  item: CartLineItem;
};

export function CartItemRow({ item }: CartItemProps) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const image = item.product.images[0] ?? "/logo.png";

  return (
    <div className="grid grid-cols-[5rem_1fr] gap-4 border-b border-chocolate/10 py-6 sm:grid-cols-[7rem_1fr_auto]">
      <Link
        href={`/products/${item.product.slug}`}
        className="relative aspect-square overflow-hidden bg-sky/20"
      >
        <Image
          src={image}
          alt={item.product.imageAlt}
          fill
          sizes="112px"
          className="object-cover"
        />
      </Link>

      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-sage">
          {item.product.category.name}
        </p>
        <Link
          href={`/products/${item.product.slug}`}
          className="mt-1 block font-serif text-xl text-chocolate hover:text-earth"
        >
          {item.product.name}
        </Link>
        <p className="mt-1 font-sans text-sm text-earth">
          {formatInr(item.product.price)}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-chocolate/20 text-chocolate hover:border-earth"
            onClick={() =>
              updateItem.mutate({
                cartItemId: item.id,
                quantity: item.quantity - 1,
              })
            }
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-6 text-center font-sans text-sm">
            {item.quantity}
          </span>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-chocolate/20 text-chocolate hover:border-earth"
            onClick={() =>
              updateItem.mutate({
                cartItemId: item.id,
                quantity: item.quantity + 1,
              })
            }
            aria-label="Increase quantity"
          >
            +
          </button>
          <button
            type="button"
            className="ml-2 font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/50 hover:text-earth"
            onClick={() => removeItem.mutate({ cartItemId: item.id })}
          >
            Remove
          </button>
        </div>
      </div>

      <p className="hidden font-sans text-sm font-medium text-chocolate sm:block">
        {formatInr(item.lineTotal)}
      </p>
    </div>
  );
}
