import { NextRequest, NextResponse } from "next/server";
import type { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const params = request.nextUrl.searchParams;
    const status = params.get("status");
    const paymentStatus = params.get("paymentStatus");
    const q = params.get("q")?.trim();

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status as OrderStatus;
    if (paymentStatus) where.paymentStatus = paymentStatus as PaymentStatus;
    if (q) {
      where.OR = [
        { orderNumber: { contains: q, mode: "insensitive" } },
        { shippingPhone: { contains: q } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { email: true, name: true } },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return jsonError(error, "Failed to load orders");
  }
}
