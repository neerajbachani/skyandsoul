import { assertCanPurchase, availableQuantity } from "@/lib/inventory";
import { prisma } from "@/lib/prisma";
import { patternLabelForImage } from "@/lib/patterns";
import {
  FIRST_ORDER_DISCOUNT_PERCENT,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  type CartLineItem,
  type CartResponse,
  type CartTotals,
  type GuestCartPayloadItem,
} from "@/types/cart";

const cartProductSelect = {
  id: true,
  slug: true,
  name: true,
  images: true,
  imageAlt: true,
  price: true,
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
} as const;

const cartVariantSelect = {
  id: true,
  name: true,
  price: true,
} as const;

export async function computeCartTotals(
  subtotal: number,
  userId?: string,
): Promise<CartTotals> {
  let firstOrderDiscount = false;

  if (userId) {
    const priorOrders = await prisma.order.count({
      where: {
        userId,
        paymentStatus: "PAID",
      },
    });
    firstOrderDiscount = priorOrders === 0;
  }

  const discount = firstOrderDiscount
    ? Math.round((subtotal * FIRST_ORDER_DISCOUNT_PERCENT) / 100)
    : 0;

  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = freeShipping || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    subtotal,
    shippingFee,
    discount,
    total,
    freeShipping,
    firstOrderDiscount,
  };
}

function mapCartItems(
  items: Array<{
    id: string;
    productId: string;
    variantId: string | null;
    selectedPatternImage: string | null;
    selectedPatternLabel: string | null;
    quantity: number;
    product: {
      id: string;
      slug: string;
      name: string;
      images: string[];
      imageAlt: string;
      price: number;
      category: { name: string; slug: string };
    };
    variant: {
      id: string;
      name: string;
      price: number;
    } | null;
  }>,
): CartLineItem[] {
  return items.map((item) => {
    const unitPrice = item.variant?.price ?? item.product.price;
    const variantName = item.variant?.name ?? null;
    const lineImage =
      item.selectedPatternImage ?? item.product.images[0] ?? "/logo.png";

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      variantName,
      selectedPatternImage: item.selectedPatternImage,
      selectedPatternLabel: item.selectedPatternLabel,
      displayName: variantName
        ? `${item.product.name} — ${variantName}`
        : item.product.name,
      quantity: item.quantity,
      product: item.product,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
      lineImage,
    };
  });
}

export async function getUserCart(userId: string): Promise<CartResponse> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: { select: cartProductSelect },
      variant: { select: cartVariantSelect },
    },
    orderBy: { createdAt: "asc" },
  });

  const mapped = mapCartItems(items);
  const subtotal = mapped.reduce((sum, item) => sum + item.lineTotal, 0);
  const totals = await computeCartTotals(subtotal, userId);

  return {
    items: mapped,
    totalItems: mapped.reduce((sum, item) => sum + item.quantity, 0),
    ...totals,
  };
}

async function findExistingCartItem(
  userId: string,
  productId: string,
  variantId?: string | null,
  selectedPatternImage?: string | null,
) {
  return prisma.cartItem.findFirst({
    where: {
      userId,
      productId,
      variantId: variantId ?? null,
      selectedPatternImage: selectedPatternImage ?? null,
    },
  });
}

type PatternInput = {
  selectedPatternImage?: string | null;
  selectedPatternLabel?: string | null;
};

async function validateProductVariant(
  productId: string,
  variantId?: string | null,
  pattern?: PatternInput,
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product || !product.isPublished) {
    throw new Error("Product not found");
  }

  const hasVariants = product.variants.length > 0;

  if (hasVariants) {
    if (!variantId) {
      throw new Error("Pack size is required");
    }

    const variant = product.variants.find((entry) => entry.id === variantId);
    if (!variant) {
      throw new Error("Variant not found");
    }
  } else if (variantId) {
    throw new Error("Variant not allowed for this product");
  }

  if (product.requiresPatternSelection) {
    if (!pattern?.selectedPatternImage) {
      throw new Error("Pattern selection is required");
    }

    if (!product.images.includes(pattern.selectedPatternImage)) {
      throw new Error("Invalid pattern selection");
    }
  } else if (pattern?.selectedPatternImage) {
    throw new Error("Pattern selection is not allowed for this product");
  }

  const selectedPatternLabel =
    product.requiresPatternSelection && pattern?.selectedPatternImage
      ? pattern.selectedPatternLabel ??
        patternLabelForImage(pattern.selectedPatternImage, product.images)
      : null;

  const selectedVariant = hasVariants
    ? product.variants.find((entry) => entry.id === variantId) ?? null
    : null;

  return {
    product,
    variant: selectedVariant,
    selectedPatternImage: pattern?.selectedPatternImage ?? null,
    selectedPatternLabel,
  };
}

function assertLineQuantity(
  product: Awaited<ReturnType<typeof validateProductVariant>>["product"],
  variant: Awaited<ReturnType<typeof validateProductVariant>>["variant"],
  quantity: number,
) {
  assertCanPurchase(product, variant, quantity);
}

export async function mergeGuestCart(
  userId: string,
  guestItems: GuestCartPayloadItem[],
) {
  for (const item of guestItems) {
    if (!item.productId || item.quantity < 1) continue;

    let validated;
    try {
      validated = await validateProductVariant(
        item.productId,
        item.variantId ?? null,
        {
          selectedPatternImage: item.selectedPatternImage ?? null,
          selectedPatternLabel: item.selectedPatternLabel ?? null,
        },
      );
    } catch {
      continue;
    }

    const existing = await findExistingCartItem(
      userId,
      item.productId,
      item.variantId ?? null,
      validated.selectedPatternImage,
    );

    const available = availableQuantity(validated.product, validated.variant);
    const requested = (existing?.quantity ?? 0) + item.quantity;
    let nextQuantity = requested;
    if (available !== null) {
      nextQuantity = Math.min(requested, available);
      if (nextQuantity < 1) continue;
      if (existing && nextQuantity === existing.quantity) continue;
    }

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: nextQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: item.productId,
          variantId: item.variantId ?? null,
          selectedPatternImage: validated.selectedPatternImage,
          selectedPatternLabel: validated.selectedPatternLabel,
          quantity: nextQuantity,
        },
      });
    }
  }
}

export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number,
  variantId?: string | null,
  pattern?: PatternInput,
) {
  const validated = await validateProductVariant(
    productId,
    variantId ?? null,
    pattern,
  );

  const existing = await findExistingCartItem(
    userId,
    productId,
    variantId ?? null,
    validated.selectedPatternImage,
  );

  const nextQuantity = (existing?.quantity ?? 0) + quantity;
  assertLineQuantity(validated.product, validated.variant, nextQuantity);

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: nextQuantity },
      include: {
        product: { select: cartProductSelect },
        variant: { select: cartVariantSelect },
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      userId,
      productId,
      variantId: variantId ?? null,
      selectedPatternImage: validated.selectedPatternImage,
      selectedPatternLabel: validated.selectedPatternLabel,
      quantity,
    },
    include: {
      product: { select: cartProductSelect },
      variant: { select: cartVariantSelect },
    },
  });
}

export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number,
) {
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });

  if (!item) {
    throw new Error("Cart item not found");
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return;
  }

  const validated = await validateProductVariant(
    item.productId,
    item.variantId,
    {
      selectedPatternImage: item.selectedPatternImage,
      selectedPatternLabel: item.selectedPatternLabel,
    },
  );
  assertLineQuantity(validated.product, validated.variant, quantity);

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
}

export function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SNS-${stamp}-${random}`;
}
