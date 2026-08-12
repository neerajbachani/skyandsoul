import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { addCartItem, getUserCart } from "@/lib/cart";

const addSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = addSchema.parse(await request.json());
    await addCartItem(auth.userId, body.productId, body.quantity);
    const cart = await getUserCart(auth.userId);
    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message === "Product not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
