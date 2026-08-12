import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { generateOrderNumber, getUserCart } from "@/lib/cart";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
        price: z.number().int().min(0),
      }),
    )
    .min(1),
  total: z.number().int().min(1),
  shippingDetails: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(5),
    phone: z.string().min(8),
  }),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: auth.userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("List orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = createOrderSchema.parse(await request.json());

    const validSignature = verifyRazorpaySignature(
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature,
    );

    if (!validSignature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 },
      );
    }

    const existingPayment = await prisma.order.findUnique({
      where: { razorpayPaymentId: body.razorpayPaymentId },
    });
    if (existingPayment) {
      return NextResponse.json(existingPayment);
    }

    const cart = await getUserCart(auth.userId);
    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (cart.total !== body.total) {
      return NextResponse.json(
        { error: "Cart total mismatch. Please refresh and try again." },
        { status: 400 },
      );
    }

    for (const item of body.items) {
      const cartItem = cart.items.find((c) => c.productId === item.productId);
      if (
        !cartItem ||
        cartItem.quantity !== item.quantity ||
        cartItem.product.price !== item.price
      ) {
        return NextResponse.json(
          { error: "Cart items changed. Please refresh and try again." },
          { status: 400 },
        );
      }
    }

    const shippingName = `${body.shippingDetails.firstName} ${body.shippingDetails.lastName}`.trim();

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: auth.userId,
          subtotal: cart.subtotal,
          shippingFee: cart.shippingFee,
          discount: cart.discount,
          total: cart.total,
          status: "CONFIRMED",
          paymentStatus: "PAID",
          paymentMethod: "ONLINE",
          razorpayOrderId: body.razorpayOrderId,
          razorpayPaymentId: body.razorpayPaymentId,
          razorpaySignature: body.razorpaySignature,
          shippingName,
          shippingPhone: body.shippingDetails.phone,
          shippingAddress: body.shippingDetails.address,
          shippingCity: body.shippingDetails.city,
          shippingState: body.shippingDetails.state,
          shippingPincode: body.shippingDetails.pincode,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productImage: item.product.images[0] ?? "/logo.png",
              quantity: item.quantity,
              price: item.product.price,
              total: item.lineTotal,
            })),
          },
        },
        include: { items: true },
      });

      await tx.cartItem.deleteMany({ where: { userId: auth.userId } });
      return created;
    });

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { email: true, name: true },
    });

    if (user) {
      void sendOrderConfirmationEmail(
        {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          shippingFee: order.shippingFee,
          discount: order.discount,
          total: order.total,
          shippingName: order.shippingName,
          shippingPhone: order.shippingPhone,
          shippingAddress: order.shippingAddress,
          shippingCity: order.shippingCity,
          shippingState: order.shippingState,
          shippingPincode: order.shippingPincode,
          items: order.items,
        },
        user.email,
        user.name || "there",
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
