import type { Metadata } from "next";
import { CartPageClient } from "@/app/cart/CartPageClient";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Sky n Soul cart before checkout.",
};

export default function CartPage() {
  return (
    <SiteShell>
      <CartPageClient />
    </SiteShell>
  );
}
