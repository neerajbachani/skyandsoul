export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;
export const FIRST_ORDER_DISCOUNT_PERCENT = 10;

export type CartProduct = {
  id: string;
  slug: string;
  name: string;
  images: string[];
  imageAlt: string;
  price: number;
  category: {
    name: string;
    slug: string;
  };
};

export type CartLineItem = {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
  lineTotal: number;
};

export type CartTotals = {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  freeShipping: boolean;
  firstOrderDiscount: boolean;
};

export type CartResponse = {
  items: CartLineItem[];
  totalItems: number;
} & CartTotals;

export type GuestCartPayloadItem = {
  productId: string;
  quantity: number;
};

export type ShippingDetails = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export type CreateOrderRequest = {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingDetails: ShippingDetails;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type OrderSummary = {
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
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }>;
};
