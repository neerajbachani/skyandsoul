import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const ids = new URL(request.url).searchParams.get("ids");
    if (!ids) {
      return NextResponse.json({ products: [] });
    }

    const productIds = ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        images: true,
        imageAlt: true,
        category: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Resolve products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
