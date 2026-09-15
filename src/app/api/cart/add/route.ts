import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { addCartItem, getUserCart } from "@/lib/cart";

const addSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable().optional(),
  selectedPatternImage: z.string().min(1).nullable().optional(),
  selectedPatternLabel: z.string().min(1).nullable().optional(),
  quantity: z.number().int().min(1).max(99),
});

const clientErrors = new Set([
  "Product not found",
  "Variant not found",
  "Pack size is required",
  "Variant not allowed for this product",
  "Pattern selection is required",
  "Invalid pattern selection",
  "Pattern selection is not allowed for this product",
]);

export async function POST(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = addSchema.parse(await request.json());
    await addCartItem(
      auth.userId,
      body.productId,
      body.quantity,
      body.variantId ?? null,
      {
        selectedPatternImage: body.selectedPatternImage ?? null,
        selectedPatternLabel: body.selectedPatternLabel ?? null,
      },
    );
    const cart = await getUserCart(auth.userId);
    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    if (error instanceof Error && clientErrors.has(error.message)) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
