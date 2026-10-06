import { NextRequest, NextResponse } from "next/server";
import { orderPatchSchema } from "@/lib/admin-schemas";
import { requireAdmin } from "@/lib/auth";
import { getAdminOrder, updateAdminOrder } from "@/lib/fulfillment";
import { jsonError } from "@/lib/http";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const order = await getAdminOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    return jsonError(error, "Failed to load order");
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const admin = await requireAdmin(request);
    const { id } = await context.params;
    const body = orderPatchSchema.parse(await request.json());
    const order = await updateAdminOrder(admin.id, id, body);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    return jsonError(error, "Failed to update order");
  }
}
