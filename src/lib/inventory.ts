export type StockRecord = {
  trackStock: boolean;
  stockQuantity: number;
};

export type StockProduct = StockRecord & {
  variants?: StockRecord[];
};

export function availableQuantity(
  product: StockProduct,
  variant: StockRecord | null,
): number | null {
  const target = stockTarget(product, variant);
  if (!target.trackStock) return null;
  return target.stockQuantity;
}

export function assertCanPurchase(
  product: StockProduct,
  variant: StockRecord | null,
  quantity: number,
) {
  const available = availableQuantity(product, variant);
  if (available === null) return;
  if (available <= 0) {
    throw new Error("Sold out");
  }
  if (quantity > available) {
    throw new Error(available === 1 ? "Only 1 left" : `Only ${available} left`);
  }
}

export function stockTarget(product: StockProduct, variant: StockRecord | null): StockRecord {
  if (product.variants && product.variants.length > 0) {
    return variant ?? { trackStock: false, stockQuantity: 0 };
  }
  return product;
}

export function isClientStockError(message: string) {
  return message === "Sold out" || message.startsWith("Only ");
}
