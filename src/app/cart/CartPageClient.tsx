"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { useAuthStatus } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { formatInr } from "@/lib/money";
import { getGuestCart } from "@/lib/guestCart";

type GuestProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  imageAlt: string;
  category: { name: string; slug: string };
  quantity: number;
};

async function fetchGuestProducts(): Promise<GuestProduct[]> {
  const items = getGuestCart().items;
  if (items.length === 0) return [];

  const ids = items.map((item) => item.productId).join(",");
  const res = await fetch(`/api/products/resolve?ids=${encodeURIComponent(ids)}`);
  if (!res.ok) throw new Error("Failed to load guest cart");
  const data: { products: GuestProduct[] } = await res.json();
  const qtyMap = new Map(items.map((item) => [item.productId, item.quantity]));

  return (data.products || []).map((product) => ({
    ...product,
    quantity: qtyMap.get(product.id) ?? 1,
  }));
}

export function CartPageClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const { data: cart, isLoading, isGuest, totalItems } = useCart();
  const {
    data: guestProducts = [],
    isLoading: guestLoading,
  } = useQuery({
    queryKey: ["guest-cart-products", totalItems],
    queryFn: fetchGuestProducts,
    enabled: isGuest,
  });

  if (authLoading || (isAuthenticated && isLoading) || (isGuest && guestLoading)) {
    return (
      <p className="py-20 text-center font-serif text-lg text-chocolate/70">
        Loading your cart…
      </p>
    );
  }

  if (isGuest) {
    const subtotal = guestProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return (
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <h1 className="font-serif text-4xl font-medium text-chocolate">Your Cart</h1>
        {guestProducts.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
            <div>
              <p className="mb-6 border border-sky bg-sky/40 px-4 py-3 font-serif text-base text-chocolate">
                Sign in to save your cart and checkout. Your items will merge into
                your account.
              </p>
              {guestProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-chocolate/10 py-5"
                >
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-serif text-xl text-chocolate hover:text-earth"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 font-sans text-sm text-chocolate/60">
                      Qty {item.quantity} · {formatInr(item.price)}
                    </p>
                  </div>
                  <p className="font-sans text-sm font-medium">
                    {formatInr(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <aside className="border border-chocolate/10 bg-white p-6">
              <p className="font-serif text-2xl text-chocolate">
                Subtotal {formatInr(subtotal)}
              </p>
              <div className="mt-6 space-y-3">
                <Button
                  href={`/auth/login?redirect=${encodeURIComponent("/checkout")}`}
                  variant="filled"
                  className="w-full min-h-12"
                >
                  Sign in to Checkout
                </Button>
                <Button
                  href={`/auth/signup?redirect=${encodeURIComponent("/checkout")}`}
                  variant="ghost"
                  className="w-full min-h-12"
                >
                  Create Account
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <h1 className="font-serif text-4xl font-medium text-chocolate">Your Cart</h1>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <h1 className="font-serif text-4xl font-medium text-chocolate">Your Cart</h1>
      <p className="mt-2 font-sans text-sm text-chocolate/60">
        {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
      </p>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          {cart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
        <CartSummary totals={cart} />
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="mt-12 text-center">
      <p className="font-serif text-xl text-chocolate/70">Your nest is empty for now.</p>
      <div className="mt-8">
        <Button href="/collections" showArrow>
          Browse Collections
        </Button>
      </div>
    </div>
  );
}
