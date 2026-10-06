"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { slugify } from "@/lib/slug";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  sortOrder: number;
  _count?: { products: number };
};

const empty = {
  name: "",
  slug: "",
  description: "",
  image: "",
  imageAlt: "",
  sortOrder: 0,
};

const inputClass = "min-h-11 w-full border border-chocolate/20 bg-white px-3 font-sans text-sm";

export function CategoriesAdmin() {
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await fetch("/api/admin/categories", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load collections");
      return data.categories as Category[];
    },
  });
  const categories = categoriesQuery.data ?? [];
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setError("");
    const res = await fetch(
      editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not save collection");
      return;
    }
    setForm(empty);
    setEditingId(null);
    await refresh();
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not delete collection");
      return;
    }
    await refresh();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <div>
        <h1 className="font-serif text-4xl font-medium">Collections</h1>
        {error || categoriesQuery.error ? (
          <p className="mt-4 font-sans text-sm text-red-800">
            {error || (categoriesQuery.error instanceof Error ? categoriesQuery.error.message : "Could not load collections")}
          </p>
        ) : null}
        <ul className="mt-6 divide-y divide-chocolate/10 border border-chocolate/10 bg-white">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between gap-4 px-4 py-4">
              <div>
                <p className="font-serif text-xl">{category.name}</p>
                <p className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50">
                  {category.slug} · {category._count?.products ?? 0} products
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="font-sans text-xs uppercase tracking-[0.12em] text-earth underline"
                  onClick={() => {
                    setEditingId(category.id);
                    setForm({
                      name: category.name,
                      slug: category.slug,
                      description: category.description,
                      image: category.image,
                      imageAlt: category.imageAlt,
                      sortOrder: category.sortOrder,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50 underline"
                  onClick={() => remove(category.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={save} className="space-y-3 border border-chocolate/10 bg-white p-5">
        <h2 className="font-serif text-2xl">{editingId ? "Edit collection" : "New collection"}</h2>
        <input required className={inputClass} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })} />
        <input required className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <textarea required className={`${inputClass} min-h-24 py-2`} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input required className={inputClass} placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input required className={inputClass} placeholder="Image alt" value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} />
        <input type="number" className={inputClass} value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        <button type="submit" className="min-h-11 w-full bg-chocolate font-sans text-xs uppercase tracking-[0.14em] text-white">
          Save collection
        </button>
      </form>
    </div>
  );
}
