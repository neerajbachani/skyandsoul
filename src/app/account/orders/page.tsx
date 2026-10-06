import type { Metadata } from "next";
import { OrdersListClient } from "@/app/account/orders/OrdersListClient";

export const metadata: Metadata = {
  title: "Your Orders",
  description: "View your Sky n Soul order history.",
};

export default function AccountOrdersPage() {
  return <OrdersListClient />;
}
