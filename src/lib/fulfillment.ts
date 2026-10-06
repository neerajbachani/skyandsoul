import type { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { sendOrderStatusEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { assertTransition, statusNotifiesCustomer } from "@/lib/order-status";
import { restoreTakenStock } from "@/lib/stock";

const orderInclude = {
  items: true,
  user: { select: { id: true, email: true, name: true, phone: true } },
  events: {
    orderBy: { createdAt: "asc" as const },
    include: { actor: { select: { id: true, email: true, name: true } } },
  },
} satisfies Prisma.OrderInclude;

export type AdminOrderPatch = {
  status?: OrderStatus;
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  internalNote?: string | null;
  recordRefund?: boolean;
};

export async function getAdminOrder(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });
}

export async function updateAdminOrder(
  actorId: string,
  orderId: string,
  input: AdminOrderPatch,
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: { select: { email: true, name: true } } },
  });
  if (!order) return null;

  const nextStatus = input.status ?? order.status;
  const nextTracking =
    input.trackingNumber !== undefined ? input.trackingNumber : order.trackingNumber;

  assertTransition(order.status, nextStatus, nextTracking);
  if (nextStatus === "SHIPPED" && !nextTracking?.trim()) {
    throw new Error("A tracking number is required to mark an order shipped");
  }

  if (input.recordRefund && nextStatus !== "REFUNDED") {
    throw new Error("Record a refund only when the order status is Refunded");
  }

  const trackingChanged =
    (input.carrier !== undefined && (input.carrier || null) !== order.carrier) ||
    (input.trackingNumber !== undefined &&
      (input.trackingNumber || null) !== order.trackingNumber) ||
    (input.trackingUrl !== undefined && (input.trackingUrl || null) !== order.trackingUrl);
  const noteChanged =
    input.internalNote !== undefined &&
    (input.internalNote || null) !== order.internalNote;
  const statusChanged = nextStatus !== order.status;
  const shouldRestore =
    statusChanged &&
    order.stockAdjusted &&
    (nextStatus === "CANCELLED" || nextStatus === "REFUNDED");

  let paymentStatus: PaymentStatus = order.paymentStatus;
  if (input.recordRefund && nextStatus === "REFUNDED") {
    paymentStatus = "REFUNDED";
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (shouldRestore) {
      await restoreTakenStock(tx, order.items);
      await tx.orderItem.updateMany({
        where: { orderId },
        data: { stockTaken: 0 },
      });
    }

    const saved = await tx.order.update({
      where: { id: orderId },
      data: {
        status: nextStatus,
        paymentStatus,
        carrier: input.carrier === undefined ? undefined : input.carrier || null,
        trackingNumber:
          input.trackingNumber === undefined ? undefined : input.trackingNumber || null,
        trackingUrl:
          input.trackingUrl === undefined ? undefined : input.trackingUrl || null,
        internalNote:
          input.internalNote === undefined ? undefined : input.internalNote || null,
        stockAdjusted: shouldRestore ? false : undefined,
      },
      include: orderInclude,
    });

    if (statusChanged) {
      await tx.orderEvent.create({
        data: {
          orderId,
          actorId,
          type: "STATUS",
          fromStatus: order.status,
          toStatus: nextStatus,
        },
      });
    }
    if (trackingChanged) {
      await tx.orderEvent.create({
        data: {
          orderId,
          actorId,
          type: "TRACKING",
          note: [saved.carrier, saved.trackingNumber].filter(Boolean).join(" · ") || "Tracking cleared",
        },
      });
    }
    if (noteChanged) {
      await tx.orderEvent.create({
        data: {
          orderId,
          actorId,
          type: "NOTE",
          note: saved.internalNote,
        },
      });
    }

    return saved;
  });

  if (statusChanged && statusNotifiesCustomer(nextStatus)) {
    void sendOrderStatusEmail(
      {
        id: updated.id,
        orderNumber: updated.orderNumber,
        status: updated.status,
        carrier: updated.carrier,
        trackingNumber: updated.trackingNumber,
        trackingUrl: updated.trackingUrl,
      },
      order.user.email,
      order.user.name || "there",
    ).catch((error) => {
      console.error("Order status email failed:", error);
    });
  }

  return updated;
}
