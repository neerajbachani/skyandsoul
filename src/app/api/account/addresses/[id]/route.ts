import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addressPatchSchema } from "@/lib/account-schemas";
import { deleteAddress, updateAddress } from "@/lib/addresses";
import { requireUser } from "@/lib/auth";
import { ApiError } from "@/middleware/errorHandler";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireUser(request);
    const { id } = await context.params;
    const body = addressPatchSchema.parse(await request.json());
    const address = await updateAddress(user.id, id, body);
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    return NextResponse.json({ address });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    console.error("Update address error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireUser(request);
    const { id } = await context.params;
    const removed = await deleteAddress(user.id, id);
    if (!removed) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Delete address error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
