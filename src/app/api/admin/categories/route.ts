import { NextRequest, NextResponse } from "next/server";
import { categorySchema } from "@/lib/admin-schemas";
import { saveCategory } from "@/lib/admin-catalog";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return jsonError(error, "Failed to load collections");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = categorySchema.parse(await request.json());
    const category = await saveCategory(body);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Failed to create collection");
  }
}
