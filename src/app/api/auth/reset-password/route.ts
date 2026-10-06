import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, isValidPassword } from "@/lib/auth";
import { resetPassword } from "@/lib/password-reset";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const { token, password } = schema.parse(await request.json());
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    await resetPassword(token, await hashPassword(password));
    return NextResponse.json({ message: "Password updated. You can sign in now." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }
    if (
      error instanceof Error &&
      error.message === "This reset link is invalid or has expired"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
