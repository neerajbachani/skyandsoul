"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStatus } from "@/hooks/useAuth";
import Link from "next/link";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
};

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuthStatus();

  async function handleAdd() {
    setMessage("");
    try {
      await addToCart.mutateAsync({ productId, quantity });
      setMessage(
        isAuthenticated
          ? "Added to your cart."
          : "Saved to your cart. Sign in before checkout.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add to cart");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/55">
            Qty
          </span>
          <input
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value) || 1))
            }
            className="h-11 w-16 border border-chocolate/20 bg-white px-2 text-center font-sans text-sm focus:border-earth focus:outline-none"
          />
        </label>
        <Button
          type="button"
          variant="filled"
          onClick={handleAdd}
          disabled={addToCart.isPending}
          className="min-h-11"
        >
          {addToCart.isPending ? "Adding…" : "Add to Cart"}
        </Button>
        <Link
          href="/contact"
          className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px]"
        >
          Contact us
        </Link>
      </div>
      {message ? (
        <p className="font-serif text-base text-earth">
          {message}{" "}
          <Link href="/cart" className="underline underline-offset-4">
            View cart
          </Link>
        </p>
      ) : null}
    </div>
  );
}
