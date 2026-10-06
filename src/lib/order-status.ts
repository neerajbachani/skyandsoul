import type { OrderStatus } from "@prisma/client";

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED", "REFUNDED"],
  PROCESSING: ["SHIPPED", "CANCELLED", "REFUNDED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export function allowedTransitions(from: OrderStatus): OrderStatus[] {
  return TRANSITIONS[from];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return from === to || TRANSITIONS[from].includes(to);
}

export function assertTransition(
  from: OrderStatus,
  to: OrderStatus,
  trackingNumber?: string | null,
) {
  if (from === to) return;
  if (!TRANSITIONS[from].includes(to)) {
    throw new Error(`Cannot move an order from ${from} to ${to}`);
  }
  if (to === "SHIPPED" && !trackingNumber?.trim()) {
    throw new Error("A tracking number is required to mark an order shipped");
  }
}

export function statusNotifiesCustomer(status: OrderStatus) {
  return (
    status === "PROCESSING" ||
    status === "SHIPPED" ||
    status === "DELIVERED" ||
    status === "CANCELLED" ||
    status === "REFUNDED"
  );
}
