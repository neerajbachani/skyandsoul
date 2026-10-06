import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

const LOW_STOCK = 3;

function startOfTodayInIndia() {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return new Date(`${date}T00:00:00+05:30`);
}

export async function GET() {
  try {
    await requireAdmin();
    const start = startOfTodayInIndia();
    const [paidToday, awaiting, lowProducts, lowVariants, recent] = await Promise.all([
      prisma.order.findMany({
        where: { paymentStatus: "PAID", createdAt: { gte: start } },
        select: { total: true },
      }),
      prisma.order.count({
        where: { status: { in: ["CONFIRMED", "PROCESSING"] } },
      }),
      prisma.product.count({
        where: {
          trackStock: true,
          stockQuantity: { lte: LOW_STOCK },
          variants: { none: {} },
        },
      }),
      prisma.productVariant.count({
        where: { trackStock: true, stockQuantity: { lte: LOW_STOCK } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
          shippingName: true,
        },
      }),
    ]);

    return NextResponse.json({
      paidOrdersToday: paidToday.length,
      revenueToday: paidToday.reduce((sum, order) => sum + order.total, 0),
      awaitingFulfillment: awaiting,
      lowStock: lowProducts + lowVariants,
      recentOrders: recent,
    });
  } catch (error) {
    return jsonError(error, "Failed to load dashboard");
  }
}
