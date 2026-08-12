export type GuestCartItem = {
  productId: string;
  quantity: number;
  addedAt: string;
};

export type GuestCart = {
  items: GuestCartItem[];
  updatedAt: string;
};

const GUEST_CART_KEY = "skyandsoul_guest_cart";
const CART_EXPIRY_DAYS = 30;

export function getGuestCart(): GuestCart {
  if (typeof window === "undefined") {
    return { items: [], updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) {
      return { items: [], updatedAt: new Date().toISOString() };
    }

    const cart = JSON.parse(stored) as GuestCart;
    const daysDiff =
      (Date.now() - new Date(cart.updatedAt).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysDiff > CART_EXPIRY_DAYS) {
      clearGuestCart();
      return { items: [], updatedAt: new Date().toISOString() };
    }

    return cart;
  } catch {
    return { items: [], updatedAt: new Date().toISOString() };
  }
}

export function setGuestCart(cart: GuestCart): void {
  if (typeof window === "undefined") return;
  cart.updatedAt = new Date().toISOString();
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
}

export function addToGuestCart(productId: string, quantity: number): void {
  const cart = getGuestCart();
  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }

  setGuestCart(cart);
}

export function updateGuestCartItem(productId: string, quantity: number): void {
  const cart = getGuestCart();
  const index = cart.items.findIndex((item) => item.productId === productId);
  if (index < 0) return;

  if (quantity <= 0) {
    cart.items.splice(index, 1);
  } else {
    cart.items[index].quantity = quantity;
  }

  setGuestCart(cart);
}

export function removeFromGuestCart(productId: string): void {
  const cart = getGuestCart();
  cart.items = cart.items.filter((item) => item.productId !== productId);
  setGuestCart(cart);
}

export function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}

export function getGuestCartItemCount(): number {
  return getGuestCart().items.reduce((total, item) => total + item.quantity, 0);
}

export function formatGuestCartForAPI() {
  return getGuestCart().items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}

export function hasGuestCartItems(): boolean {
  return getGuestCart().items.length > 0;
}
