type PublicOrderItem = {
  id: string;
  productId: string;
  productName: string;
  variantId?: string | null;
  variantName: string | null;
  productImage: string;
  selectedPatternImage: string | null;
  selectedPatternLabel: string | null;
  quantity: number;
  price: number;
  total: number;
};

type PublicOrderInput = {
  id: string;
  orderNumber: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: string;
  paymentStatus: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  createdAt: Date | string;
  items?: PublicOrderItem[];
};

export function toPublicOrder<T extends PublicOrderInput>(order: T) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    discount: order.discount,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    shippingName: order.shippingName,
    shippingPhone: order.shippingPhone,
    shippingAddress: order.shippingAddress,
    shippingCity: order.shippingCity,
    shippingState: order.shippingState,
    shippingPincode: order.shippingPincode,
    carrier: order.carrier ?? null,
    trackingNumber: order.trackingNumber ?? null,
    trackingUrl: order.trackingUrl ?? null,
    createdAt: order.createdAt,
    items: order.items ?? [],
  };
}
