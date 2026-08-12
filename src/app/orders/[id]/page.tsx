import type { Metadata } from "next";
import { OrderDetailClient } from "@/app/orders/[id]/OrderDetailClient";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your Sky n Soul order confirmation.",
};

export default function OrderPage() {
  return (
    <SiteShell>
      <OrderDetailClient />
    </SiteShell>
  );
}
