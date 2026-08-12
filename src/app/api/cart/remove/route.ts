import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { getUserCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

const removeSchema = z.object({
  cartItemId: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId } = removeSchema.parse(await request.json());

    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: auth.userId },
    });

    if (!item) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return NextResponse.json(await getUserCart(auth.userId));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Remove cart item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
