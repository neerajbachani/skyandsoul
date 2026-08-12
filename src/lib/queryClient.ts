import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export const queryKeys = {
  categories: ["categories"] as const,
  category: (slug: string) => ["categories", slug] as const,
  products: (filters: Record<string, string | number | boolean | undefined>) =>
    ["products", filters] as const,
  product: (slug: string) => ["products", slug] as const,
  search: (q: string) => ["search", q] as const,
  auth: ["auth"] as const,
  cart: ["cart"] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
} as const;
