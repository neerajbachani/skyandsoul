import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "@/lib/admin-schemas";
import { deleteCategory, saveCategory } from "@/lib/admin-catalog";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    const body = categorySchema.parse(await request.json());
    const category = await saveCategory(body, id);
    return NextResponse.json({ category });
  } catch (error) {
    return jsonError(error, "Failed to update collection");
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error, "Failed to delete collection");
  }
}
