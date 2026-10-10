"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";

export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useSearch(
  queryOrParams: string | { query: string; category?: string },
) {
  const query =
    typeof queryOrParams === "string" ? queryOrParams : queryOrParams.query;
  const category =
    typeof queryOrParams === "string" ? undefined : queryOrParams.category;
  const debounced = useDebouncedValue(query.trim(), 300);

  return useQuery({
    queryKey: ["search", debounced, category ?? "all"] as const,
    queryFn: () =>
      fetchProducts({
        search: debounced,
        category: category || undefined,
        limit: 24,
      }),
    enabled: debounced.length >= 2,
  });
}
