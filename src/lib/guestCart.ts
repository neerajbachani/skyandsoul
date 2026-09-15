export type GuestCartItem = {
  productId: string;
  variantId?: string | null;
  selectedPatternImage?: string | null;
  selectedPatternLabel?: string | null;
  quantity: number;
  addedAt: string;
};

export type GuestCart = {
  items: GuestCartItem[];
  updatedAt: string;
};

const GUEST_CART_KEY = "skyandsoul_guest_cart";
const CART_EXPIRY_DAYS = 30;

type CartLineMatch = {
  productId: string;
  variantId?: string | null;
  selectedPatternImage?: string | null;
};

function sameCartLine(item: GuestCartItem, match: CartLineMatch) {
  return (
    item.productId === match.productId &&
    (item.variantId ?? null) === (match.variantId ?? null) &&
    (item.selectedPatternImage ?? null) === (match.selectedPatternImage ?? null)
  );
}

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

export function addToGuestCart(
  productId: string,
  quantity: number,
  variantId?: string | null,
  pattern?: {
    selectedPatternImage?: string | null;
    selectedPatternLabel?: string | null;
  },
): void {
  const cart = getGuestCart();
  const match: CartLineMatch = {
    productId,
    variantId,
    selectedPatternImage: pattern?.selectedPatternImage ?? null,
  };
  const existing = cart.items.find((item) => sameCartLine(item, match));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      variantId: variantId ?? null,
      selectedPatternImage: pattern?.selectedPatternImage ?? null,
      selectedPatternLabel: pattern?.selectedPatternLabel ?? null,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }

  setGuestCart(cart);
}

export function updateGuestCartItem(
  productId: string,
  quantity: number,
  variantId?: string | null,
  selectedPatternImage?: string | null,
): void {
  const cart = getGuestCart();
  const index = cart.items.findIndex((item) =>
    sameCartLine(item, { productId, variantId, selectedPatternImage }),
  );
  if (index < 0) return;

  if (quantity <= 0) {
    cart.items.splice(index, 1);
  } else {
    cart.items[index].quantity = quantity;
  }

  setGuestCart(cart);
}

export function removeFromGuestCart(
  productId: string,
  variantId?: string | null,
  selectedPatternImage?: string | null,
): void {
  const cart = getGuestCart();
  cart.items = cart.items.filter(
    (item) => !sameCartLine(item, { productId, variantId, selectedPatternImage }),
  );
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
    variantId: item.variantId ?? null,
    selectedPatternImage: item.selectedPatternImage ?? null,
    selectedPatternLabel: item.selectedPatternLabel ?? null,
    quantity: item.quantity,
  }));
}

export function hasGuestCartItems(): boolean {
  return getGuestCart().items.length > 0;
}
