import type { Metadata } from "next";
import { OrderEditor } from "@/components/admin/OrderEditor";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Order" };

export default async function AdminOrderPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderEditor orderId={id} />;
}
