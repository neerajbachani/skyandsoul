"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchCategory } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
}

export function useCategory(slug: string, page = 1) {
  return useQuery({
    queryKey: [...queryKeys.category(slug), page],
    queryFn: () => fetchCategory(slug, page),
    enabled: Boolean(slug),
  });
}
