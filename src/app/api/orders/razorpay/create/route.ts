import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { getUserCart } from "@/lib/cart";
import { getRazorpayInstance } from "@/lib/razorpay";

const createSchema = z.object({
  total: z.number().int().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { total } = createSchema.parse(await request.json());
    const cart = await getUserCart(auth.userId);

    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (cart.total !== total) {
      return NextResponse.json(
        {
          error: "Cart total changed. Please refresh and try again.",
          expectedTotal: cart.total,
        },
        { status: 400 },
      );
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: cart.total * 100,
      currency: "INR",
      receipt: `sns_${Date.now()}`,
      notes: {
        userId: auth.userId,
        email: auth.email,
      },
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Razorpay create error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create payment order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
