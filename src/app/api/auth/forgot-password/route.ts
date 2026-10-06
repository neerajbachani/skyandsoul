import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/password-reset";

const schema = z.object({
  email: z.string().email(),
});

const MESSAGE =
  "If an account exists for that email, we sent a link to reset the password.";

export async function POST(request: NextRequest) {
  try {
    const { email } = schema.parse(await request.json());
    await requestPasswordReset(email);
    return NextResponse.json({ message: MESSAGE });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: MESSAGE });
    }
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: MESSAGE });
  }
}
