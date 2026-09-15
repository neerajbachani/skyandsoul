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
    const variantIds =
      new URL(request.url).searchParams.get("variantIds")?.split(",") ?? [];
    const patternImages =
      new URL(request.url).searchParams.get("patternImages")?.split(",") ?? [];
    const patternLabels =
      new URL(request.url).searchParams.get("patternLabels")?.split(",") ?? [];

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
        variants: {
          select: { id: true, name: true, price: true },
        },
      },
    });

    const byId = new Map(products.map((product) => [product.id, product]));

    const resolved = productIds
      .map((productId, index) => {
        const product = byId.get(productId);
        if (!product) return null;

        const variantId = variantIds[index]?.trim() || null;
        const variant = product.variants.find((entry) => entry.id === variantId);
        const unitPrice = variant?.price ?? product.price;
        const variantName = variant?.name ?? null;
        const rawPatternImage = patternImages[index]?.trim() || "";
        const rawPatternLabel = patternLabels[index]?.trim() || "";
        const selectedPatternImage = rawPatternImage
          ? decodeURIComponent(rawPatternImage)
          : null;
        const selectedPatternLabel = rawPatternLabel
          ? decodeURIComponent(rawPatternLabel)
          : null;
        const lineImage =
          selectedPatternImage ?? product.images[0] ?? "/logo.png";

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          displayName: variantName
            ? `${product.name} — ${variantName}`
            : product.name,
          variantId,
          variantName,
          selectedPatternImage,
          selectedPatternLabel,
          lineImage,
          price: unitPrice,
          images: product.images,
          imageAlt: product.imageAlt,
          category: product.category,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ products: resolved });
  } catch (error) {
    console.error("Resolve products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
