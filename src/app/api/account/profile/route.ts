import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ApiError } from "@/middleware/errorHandler";
import { publicUser, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(1).max(80).optional().nullable(),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .nullable()
    .refine((value) => !value || value.length >= 8, "Enter a valid phone number"),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = schema.parse(await request.json());
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name === undefined ? undefined : body.name || null,
        phone: body.phone === undefined ? undefined : body.phone || null,
      },
    });
    return NextResponse.json({ user: publicUser(updated) });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
