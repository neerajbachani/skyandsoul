"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useOrder } from "@/hooks/useCart";
import { formatInr } from "@/lib/money";

export function OrderDetailClient() {
  const params = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(params.id);

  if (isLoading) {
    return (
      <p className="py-20 text-center font-serif text-lg text-chocolate/70">
        Loading order…
      </p>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-serif text-4xl text-chocolate">Order not found</h1>
        <div className="mt-8">
          <Button href="/account/orders" showArrow>
            View your orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-sage">
        Order confirmed
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate">
        Thank you
      </h1>
      <p className="mt-3 font-serif text-lg text-chocolate/75">
        Order <strong>{order.orderNumber}</strong> is paid and on its way into
        our nest for packing.
      </p>

      <div className="mt-10 border border-chocolate/10 bg-white p-6 sm:p-8">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
              Status
            </dt>
            <dd className="mt-1 font-serif text-lg text-chocolate">
              {order.paymentStatus} · {order.status}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
              Total
            </dt>
            <dd className="mt-1 font-serif text-lg text-chocolate">
              {formatInr(order.total)}
            </dd>
          </div>
        </dl>

        <h2 className="mt-8 font-serif text-2xl text-chocolate">Items</h2>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between border-b border-chocolate/10 py-3 font-serif text-base"
            >
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>{formatInr(item.total)}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-8 font-serif text-2xl text-chocolate">Shipping</h2>
        <p className="mt-3 font-serif text-base leading-relaxed text-chocolate/80">
          {order.shippingName}
          <br />
          {order.shippingAddress}
          <br />
          {order.shippingCity}, {order.shippingState} {order.shippingPincode}
          <br />
          {order.shippingPhone}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/collections" showArrow>
          Continue shopping
        </Button>
        <Link
          href="/account/orders"
          className="font-sans text-xs uppercase tracking-[0.14em] text-earth underline underline-offset-4"
        >
          All orders
        </Link>
      </div>
    </div>
  );
}
