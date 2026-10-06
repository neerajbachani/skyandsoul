import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addressSchema } from "@/lib/account-schemas";
import { createAddress, listAddresses } from "@/lib/addresses";
import { requireUser } from "@/lib/auth";
import { ApiError } from "@/middleware/errorHandler";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const addresses = await listAddresses(user.id);
    return NextResponse.json({ addresses });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("List addresses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    const body = addressSchema.parse(await request.json());
    const address = await createAddress(user.id, body);
    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    console.error("Create address error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
