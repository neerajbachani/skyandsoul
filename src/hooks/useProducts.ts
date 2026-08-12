"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";

type ProductFilters = {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
};

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => fetchProduct(slug),
    enabled: Boolean(slug),
  });
}
