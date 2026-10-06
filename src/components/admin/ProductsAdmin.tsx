"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatInr } from "@/lib/money";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  isPublished: boolean;
  trackStock: boolean;
  stockQuantity: number;
  category: { name: string };
  variants: Array<{ trackStock: boolean; stockQuantity: number }>;
};

export function ProductsAdmin() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  function load(query = q) {
    const params = query ? `?q=${encodeURIComponent(query)}` : "";
    fetch(`/api/admin/products${params}`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load products");
        setProducts(data.products);
      })
      .catch((err: Error) => setError(err.message));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(product: ProductRow) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not delete product");
      return;
    }
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl font-medium">Products</h1>
        <Link href="/admin/products/new" className="bg-chocolate px-4 py-3 font-sans text-xs uppercase tracking-[0.14em] text-white">
          New product
        </Link>
      </div>
      <form
        className="mt-6 flex gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          load(q);
        }}
      >
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search name or slug"
          className="min-h-11 flex-1 border border-chocolate/20 bg-white px-3 font-sans text-sm"
        />
        <button type="submit" className="px-4 font-sans text-xs uppercase tracking-[0.14em] text-earth">
          Search
        </button>
      </form>
      {error ? <p className="mt-4 font-sans text-sm text-red-800">{error}</p> : null}
      <ul className="mt-6 divide-y divide-chocolate/10 border border-chocolate/10 bg-white">
        {products.map((product) => {
          const trackedVariants = product.variants.filter((variant) => variant.trackStock);
          const stockLabel = trackedVariants.length
            ? trackedVariants.map((variant) => variant.stockQuantity).join(", ")
            : product.trackStock
              ? String(product.stockQuantity)
              : "Made to order";
          return (
            <li key={product.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <div>
                <Link href={`/admin/products/${product.id}`} className="font-serif text-xl hover:text-earth">
                  {product.name}
                </Link>
                <p className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50">
                  {product.category.name} · {product.isPublished ? "Published" : "Draft"} · Stock {stockLabel}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-sans text-sm">{formatInr(product.price)}</span>
                <button type="button" className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50 underline" onClick={() => remove(product)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
