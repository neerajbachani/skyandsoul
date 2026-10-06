import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  generateToken,
  isAllowlistedAdmin,
  publicUser,
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";
import { mergeGuestCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  guestCart: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1).nullable().optional(),
        selectedPatternImage: z.string().min(1).nullable().optional(),
        selectedPatternLabel: z.string().min(1).nullable().optional(),
        quantity: z.number().int().min(1),
      }),
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, guestCart } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    let role = user.role;
    if (isAllowlistedAdmin(user.email) && role !== "ADMIN") {
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { role: "ADMIN" },
      });
      role = updated.role;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role,
    });
    await setAuthCookie(token);

    if (guestCart?.length) {
      try {
        await mergeGuestCart(user.id, guestCart);
      } catch (error) {
        console.error("Guest cart merge failed:", error);
      }
    }

    return NextResponse.json({
      user: publicUser({ ...user, role }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
