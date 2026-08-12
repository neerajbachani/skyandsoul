import type { Metadata } from "next";
import { CheckoutPageClient } from "@/app/checkout/CheckoutPageClient";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Sky n Soul order with secure Razorpay payment.",
};

export default function CheckoutPage() {
  return (
    <SiteShell>
      <CheckoutPageClient />
    </SiteShell>
  );
}
