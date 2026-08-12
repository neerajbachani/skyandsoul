import type { Metadata } from "next";
import { OrdersListClient } from "@/app/account/orders/OrdersListClient";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "View your Sky n Soul order history.",
};

export default function AccountOrdersPage() {
  return (
    <SiteShell>
      <OrdersListClient />
    </SiteShell>
  );
}
