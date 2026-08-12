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

export function useSearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 300);

  return useQuery({
    queryKey: queryKeys.search(debounced),
    queryFn: () =>
      fetchProducts({
        search: debounced,
        limit: 24,
      }),
    enabled: debounced.length >= 2,
  });
}
