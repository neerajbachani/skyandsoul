"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { useAuthStatus } from "@/hooks/useAuth";
import {
  useCart,
  useCreateOrder,
  useCreateRazorpayOrder,
} from "@/hooks/useCart";
import { formatInr } from "@/lib/money";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

export function CheckoutPageClient() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStatus();
  const { data: cart, isLoading } = useCart();
  const createRazorpayOrder = useCreateRazorpayOrder();
  const createOrder = useCreateOrder();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const phone = form.phone || user?.phone || "";

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/auth/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [authLoading, isAuthenticated, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!cart || cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setError("");
    setPaying(true);

    try {
      const rzpOrder = await createRazorpayOrder.mutateAsync(cart.total);

      if (!window.Razorpay) {
        throw new Error("Razorpay failed to load. Please refresh and try again.");
      }

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key) {
        throw new Error("Razorpay key is not configured");
      }

      const rzp = new window.Razorpay({
        key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Sky n Soul",
        description: "Order payment",
        order_id: rzpOrder.id,
        prefill: {
          email: user?.email,
          name: `${form.firstName} ${form.lastName}`.trim(),
          contact: phone,
        },
        theme: { color: "#80592C" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const order = await createOrder.mutateAsync({
              items: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
              total: cart.total,
              shippingDetails: { ...form, phone },
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            router.push(`/orders/${order.id}`);
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Payment succeeded but order creation failed. Contact support.",
            );
            setPaying(false);
          }
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
      setPaying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setPaying(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <p className="py-20 text-center font-serif text-lg text-chocolate/70">
        Preparing checkout…
      </p>
    );
  }

  if (!isAuthenticated) return null;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-serif text-4xl text-chocolate">Nothing to checkout</h1>
        <div className="mt-8">
          <Button href="/collections" showArrow>
            Browse Collections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <Link
          href="/cart"
          className="font-sans text-xs uppercase tracking-[0.14em] text-earth underline underline-offset-4"
        >
          ← Back to cart
        </Link>
        <h1 className="mt-4 font-serif text-4xl font-medium text-chocolate">
          Checkout
        </h1>
        <p className="mt-2 font-serif text-lg text-chocolate/70">
          Pay securely with Razorpay. Total {formatInr(cart.total)}.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]"
        >
          <div className="space-y-5 border border-chocolate/10 bg-white p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-chocolate">Shipping details</h2>
            {error ? (
              <p className="border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800">
                {error}
              </p>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                value={form.firstName}
                onChange={(value) => setForm((f) => ({ ...f, firstName: value }))}
                required
              />
              <Field
                label="Last name"
                value={form.lastName}
                onChange={(value) => setForm((f) => ({ ...f, lastName: value }))}
                required
              />
            </div>
            <Field
              label="Address"
              value={form.address}
              onChange={(value) => setForm((f) => ({ ...f, address: value }))}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="City"
                value={form.city}
                onChange={(value) => setForm((f) => ({ ...f, city: value }))}
                required
              />
              <Field
                label="State"
                value={form.state}
                onChange={(value) => setForm((f) => ({ ...f, state: value }))}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Pincode"
                value={form.pincode}
                onChange={(value) => setForm((f) => ({ ...f, pincode: value }))}
                required
              />
              <Field
                label="Phone"
                value={phone}
                onChange={(value) => setForm((f) => ({ ...f, phone: value }))}
                required
              />
            </div>
            <Button
              type="submit"
              variant="filled"
              className="min-h-12 w-full sm:w-auto"
              disabled={paying || createRazorpayOrder.isPending || createOrder.isPending}
            >
              {paying || createRazorpayOrder.isPending
                ? "Opening Razorpay…"
                : `Pay ${formatInr(cart.total)}`}
            </Button>
          </div>

          <div className="space-y-6">
            <CartSummary totals={cart} showCheckout={false} />
            <div className="border border-chocolate/10 bg-canvas p-5">
              <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] text-sage">
                In your nest
              </h3>
              <ul className="mt-4 space-y-3">
                {cart.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-3 font-serif text-base text-chocolate"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatInr(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60"
      >
        {label}
      </label>
      <input
        id={id}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full border border-chocolate/20 bg-white px-4 font-sans text-sm text-chocolate focus:border-earth focus:outline-none"
      />
    </div>
  );
}
