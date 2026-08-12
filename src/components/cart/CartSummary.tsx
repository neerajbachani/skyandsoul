import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatInr } from "@/lib/money";
import type { CartTotals } from "@/types/cart";

type CartSummaryProps = {
  totals: CartTotals;
  checkoutHref?: string;
  showCheckout?: boolean;
};

export function CartSummary({
  totals,
  checkoutHref = "/checkout",
  showCheckout = true,
}: CartSummaryProps) {
  return (
    <aside className="border border-chocolate/10 bg-white p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-medium text-chocolate">
        Order Summary
      </h2>
      <dl className="mt-6 space-y-3 font-sans text-sm">
        <div className="flex justify-between text-chocolate/80">
          <dt>Subtotal</dt>
          <dd>{formatInr(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 ? (
          <div className="flex justify-between text-sage">
            <dt>First order (10% off)</dt>
            <dd>−{formatInr(totals.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between text-chocolate/80">
          <dt>Shipping</dt>
          <dd>
            {totals.freeShipping || totals.shippingFee === 0
              ? "Free"
              : formatInr(totals.shippingFee)}
          </dd>
        </div>
        {!totals.freeShipping && totals.subtotal > 0 ? (
          <p className="font-serif text-sm text-chocolate/60">
            Free shipping on orders above ₹999.
          </p>
        ) : null}
        <div className="flex justify-between border-t border-chocolate/10 pt-4 font-medium text-chocolate">
          <dt>Total</dt>
          <dd className="text-base">{formatInr(totals.total)}</dd>
        </div>
      </dl>

      {showCheckout ? (
        <div className="mt-8 space-y-3">
          <Button href={checkoutHref} variant="filled" className="w-full min-h-12">
            Proceed to Checkout
          </Button>
          <Link
            href="/collections"
            className="block text-center font-sans text-xs uppercase tracking-[0.14em] text-earth underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
