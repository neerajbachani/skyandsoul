"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuthStatus } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useCart";
import { formatInr } from "@/lib/money";

export function OrdersListClient() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const { data: orders, isLoading } = useOrders();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent("/account/orders")}`,
      );
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isLoading) {
    return (
      <p className="py-20 text-center font-serif text-lg text-chocolate/70">
        Loading orders…
      </p>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-sage">
        Account
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate">
        Your Orders
      </h1>

      {!orders || orders.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="font-serif text-xl text-chocolate/70">
            No orders yet — your nest is waiting.
          </p>
          <div className="mt-8">
            <Button href="/collections" showArrow>
              Shop Collections
            </Button>
          </div>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="block border border-chocolate/10 bg-white px-5 py-5 transition-colors hover:border-earth"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-serif text-xl text-chocolate">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 font-sans text-xs uppercase tracking-[0.12em] text-chocolate/55">
                      {order.paymentStatus} · {order.status} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <p className="font-sans text-sm font-medium text-earth">
                    {formatInr(order.total)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
