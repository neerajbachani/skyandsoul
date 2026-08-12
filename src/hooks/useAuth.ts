"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatGuestCartForAPI, clearGuestCart } from "@/lib/guestCart";
import { queryKeys } from "@/lib/queryClient";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
};

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to load session");
  const data = (await res.json()) as { user: AuthUser };
  return data.user;
}

export function useAuthStatus() {
  const query = useQuery({
    queryKey: queryKeys.auth,
    queryFn: fetchMe,
    retry: false,
  });

  return {
    user: query.data ?? null,
    isAuthenticated: Boolean(query.data),
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...payload,
          guestCart: formatGuestCartForAPI(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data.user as AuthUser;
    },
    onSuccess: () => {
      clearGuestCart();
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      name?: string;
      phone?: string;
    }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...payload,
          guestCart: formatGuestCartForAPI(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      return data.user as AuthUser;
    },
    onSuccess: () => {
      clearGuestCart();
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth, null);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}
