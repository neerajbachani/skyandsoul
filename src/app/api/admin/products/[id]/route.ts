import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/admin-schemas";
import { deleteProduct, saveProduct } from "@/lib/admin-catalog";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    return jsonError(error, "Failed to load product");
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const body = productSchema.parse(await request.json());
    const product = await saveProduct(body, id);
    return NextResponse.json({ product });
  } catch (error) {
    return jsonError(error, "Failed to update product");
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error, "Failed to delete product");
  }
}
