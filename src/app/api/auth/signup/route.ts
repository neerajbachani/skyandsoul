import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  generateToken,
  hashPassword,
  isValidPassword,
  setAuthCookie,
} from "@/lib/auth";
import { mergeGuestCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  guestCart: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = signupSchema.parse(body);

    if (!isValidPassword(data.password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: await hashPassword(data.password),
        name: data.name,
        phone: data.phone,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    await setAuthCookie(token);

    if (data.guestCart?.length) {
      try {
        await mergeGuestCart(user.id, data.guestCart);
      } catch (error) {
        console.error("Guest cart merge failed:", error);
      }
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
