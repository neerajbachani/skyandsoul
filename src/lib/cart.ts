import { prisma } from "@/lib/prisma";
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
  }>,
): CartLineItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    lineTotal: item.product.price * item.quantity,
  }));
}

export async function getUserCart(userId: string): Promise<CartResponse> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: { select: cartProductSelect },
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

export async function mergeGuestCart(
  userId: string,
  guestItems: GuestCartPayloadItem[],
) {
  for (const item of guestItems) {
    if (!item.productId || item.quantity < 1) continue;

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { id: true },
    });
    if (!product) continue;

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: item.productId,
        },
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  }
}

export async function addCartItem(
  userId: string,
  productId: string,
  quantity: number,
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
      include: { product: { select: cartProductSelect } },
    });
  }

  return prisma.cartItem.create({
    data: { userId, productId, quantity },
    include: { product: { select: cartProductSelect } },
  });
}

export function generateOrderNumber() {
  const stamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SNS-${stamp}-${random}`;
}
