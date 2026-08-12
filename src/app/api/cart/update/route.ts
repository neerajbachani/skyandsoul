import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { getUserCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().int().min(0).max(99),
});

export async function PUT(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId, quantity } = updateSchema.parse(await request.json());

    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: auth.userId },
    });

    if (!item) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    return NextResponse.json(await getUserCart(auth.userId));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
