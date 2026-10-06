import { NextRequest, NextResponse } from "next/server";
import { productSchema } from "@/lib/admin-schemas";
import { saveProduct } from "@/lib/admin-catalog";
import { requireAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const q = request.nextUrl.searchParams.get("q")?.trim();
    const products = await prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ products });
  } catch (error) {
    return jsonError(error, "Failed to load products");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = productSchema.parse(await request.json());
    const product = await saveProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return jsonError(error, "Failed to create product");
  }
}
