import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { getUserCart, updateCartItemQuantity } from "@/lib/cart";
import { isClientStockError } from "@/lib/inventory";

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

    try {
      await updateCartItemQuantity(auth.userId, cartItemId, quantity);
    } catch (error) {
      if (error instanceof Error && error.message === "Cart item not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (
        error instanceof Error &&
        (isClientStockError(error.message) || error.message === "Product not found")
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
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
