"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import {
  addToGuestCart,
  getGuestCart,
  getGuestCartItemCount,
  removeFromGuestCart,
  updateGuestCartItem,
} from "@/lib/guestCart";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStatus } from "@/hooks/useAuth";
import type { CartResponse, CreateOrderRequest, OrderSummary } from "@/types/cart";

async function fetchCart(): Promise<CartResponse> {
  const res = await fetch("/api/cart", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load cart");
  return res.json();
}

function subscribeGuestCart(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("skyandsoul:guest-cart", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("skyandsoul:guest-cart", onStoreChange);
  };
}

export function useCart() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const guestCount = useSyncExternalStore(
    subscribeGuestCart,
    getGuestCartItemCount,
    () => 0,
  );

  const query = useQuery({
    queryKey: queryKeys.cart,
    queryFn: fetchCart,
    enabled: isAuthenticated,
    retry: false,
  });

  return {
    ...query,
    data: isAuthenticated ? query.data : undefined,
    totalItems: isAuthenticated
      ? (query.data?.totalItems ?? 0)
      : guestCount,
    isGuest: !isAuthenticated && !authLoading,
    guestItems: !isAuthenticated ? getGuestCart().items : [],
  };
}

function notifyGuestCart() {
  window.dispatchEvent(new Event("skyandsoul:guest-cart"));
}

export function useAddToCart() {
  const { isAuthenticated } = useAuthStatus();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      if (!isAuthenticated) {
        addToGuestCart(productId, quantity);
        notifyGuestCart();
        return { guest: true };
      }

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");
      return data as CartResponse;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStatus();

  return useMutation({
    mutationFn: async ({
      cartItemId,
      productId,
      quantity,
    }: {
      cartItemId?: string;
      productId?: string;
      quantity: number;
    }) => {
      if (!isAuthenticated && productId) {
        updateGuestCartItem(productId, quantity);
        notifyGuestCart();
        return { guest: true };
      }

      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update cart");
      return data as CartResponse;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStatus();

  return useMutation({
    mutationFn: async ({
      cartItemId,
      productId,
    }: {
      cartItemId?: string;
      productId?: string;
    }) => {
      if (!isAuthenticated && productId) {
        removeFromGuestCart(productId);
        notifyGuestCart();
        return { guest: true };
      }

      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItemId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove item");
      return data as CartResponse;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }
    },
  });
}

export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: async (total: number) => {
      const res = await fetch("/api/orders/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start payment");
      return data as { id: string; amount: number; currency: string };
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateOrderRequest) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      return data as OrderSummary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: async () => {
      const res = await fetch("/api/orders", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      return data.orders as OrderSummary[];
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: async () => {
      const res = await fetch(`/api/orders/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load order");
      return (await res.json()) as OrderSummary;
    },
    enabled: Boolean(id),
  });
}
