import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ApiError } from "@/middleware/errorHandler";
import { hashPassword, isValidPassword, requireUser, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = schema.parse(await request.json());
    if (!isValidPassword(body.newPassword)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }
    if (!(await verifyPassword(body.currentPassword, user.password))) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(body.newPassword) },
    });
    return NextResponse.json({ message: "Password updated" });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
