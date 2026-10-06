import type { Prisma } from "@prisma/client";
import { assertCanPurchase, isClientStockError } from "@/lib/inventory";

type StockLine = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

export async function takeStockForLines(
  tx: Prisma.TransactionClient,
  lines: StockLine[],
) {
  const taken: Array<StockLine & { taken: number }> = [];

  for (const line of lines) {
    const product = await tx.product.findUnique({
      where: { id: line.productId },
      include: { variants: true },
    });

    if (!product || !product.isPublished) {
      throw new Error("Product not found");
    }

    const variant = line.variantId
      ? product.variants.find((entry) => entry.id === line.variantId) ?? null
      : null;

    if (line.variantId && !variant) {
      throw new Error("Variant not found");
    }

    if (product.variants.length > 0 && !variant) {
      throw new Error("Pack size is required");
    }

    assertCanPurchase(product, variant, line.quantity);

    const tracked = product.variants.length > 0 ? variant : product;
    if (!tracked?.trackStock) {
      taken.push({ ...line, taken: 0 });
      continue;
    }

    if (variant) {
      const result = await tx.productVariant.updateMany({
        where: {
          id: variant.id,
          trackStock: true,
          stockQuantity: { gte: line.quantity },
        },
        data: { stockQuantity: { decrement: line.quantity } },
      });
      if (result.count !== 1) throw new Error("Sold out");
    } else {
      const result = await tx.product.updateMany({
        where: {
          id: product.id,
          trackStock: true,
          stockQuantity: { gte: line.quantity },
        },
        data: { stockQuantity: { decrement: line.quantity } },
      });
      if (result.count !== 1) throw new Error("Sold out");
    }

    taken.push({ ...line, taken: line.quantity });
  }

  return taken;
}

export async function restoreTakenStock(
  tx: Prisma.TransactionClient,
  items: Array<{
    productId: string;
    variantId: string | null;
    stockTaken: number;
  }>,
) {
  for (const item of items) {
    if (item.stockTaken <= 0) continue;
    if (item.variantId) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stockQuantity: { increment: item.stockTaken } },
      });
    } else {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.stockTaken } },
      });
    }
  }
}

export function stockErrorStatus(error: unknown) {
  if (error instanceof Error && (isClientStockError(error.message) || error.message === "Product not found" || error.message === "Variant not found" || error.message === "Pack size is required")) {
    return error.message;
  }
  return null;
}
