"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { slugify } from "@/lib/slug";

type VariantDraft = {
  id?: string;
  slug: string;
  name: string;
  price: number;
  badge: string;
  images: string;
  trackStock: boolean;
  stockQuantity: number;
  sortOrder: number;
};

type ProductDraft = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  material: string;
  size: string;
  ageRange: string;
  features: string;
  careInstructions: string;
  images: string;
  imageAlt: string;
  price: number;
  categoryId: string;
  isFeatured: boolean;
  requiresPatternSelection: boolean;
  isPublished: boolean;
  trackStock: boolean;
  stockQuantity: number;
  sortOrder: number;
  variants: VariantDraft[];
};

type CategoryOption = { id: string; name: string };

const emptyVariant = (): VariantDraft => ({
  slug: "",
  name: "",
  price: 0,
  badge: "",
  images: "",
  trackStock: false,
  stockQuantity: 0,
  sortOrder: 0,
});

const emptyProduct = (): ProductDraft => ({
  name: "",
  slug: "",
  tagline: "",
  description: "",
  material: "",
  size: "",
  ageRange: "",
  features: "",
  careInstructions: "",
  images: "",
  imageAlt: "",
  price: 0,
  categoryId: "",
  isFeatured: false,
  requiresPatternSelection: false,
  isPublished: false,
  trackStock: false,
  stockQuantity: 0,
  sortOrder: 0,
  variants: [],
});

const inputClass =
  "min-h-11 w-full border border-chocolate/20 bg-white px-3 font-sans text-sm";

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProductDraft>(emptyProduct);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [slugTouched, setSlugTouched] = useState(Boolean(productId));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const options = (data.categories ?? []).map((category: CategoryOption) => ({
          id: category.id,
          name: category.name,
        }));
        setCategories(options);
        if (!productId && options[0]) {
          setDraft((current) => ({ ...current, categoryId: current.categoryId || options[0].id }));
        }
      })
      .catch(() => setError("Could not load collections"));
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/admin/products/${productId}`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Product not found");
        const product = data.product;
        setDraft({
          name: product.name,
          slug: product.slug,
          tagline: product.tagline ?? "",
          description: product.description,
          material: product.material ?? "",
          size: product.size ?? "",
          ageRange: product.ageRange ?? "",
          features: product.features.join("\n"),
          careInstructions: product.careInstructions.join("\n"),
          images: product.images.join("\n"),
          imageAlt: product.imageAlt,
          price: product.price,
          categoryId: product.categoryId,
          isFeatured: product.isFeatured,
          requiresPatternSelection: product.requiresPatternSelection,
          isPublished: product.isPublished,
          trackStock: product.trackStock,
          stockQuantity: product.stockQuantity,
          sortOrder: product.sortOrder,
          variants: product.variants.map((variant: VariantDraft & { images: string[]; badge: string | null }) => ({
            id: variant.id,
            slug: variant.slug,
            name: variant.name,
            price: variant.price,
            badge: variant.badge ?? "",
            images: Array.isArray(variant.images) ? variant.images.join("\n") : "",
            trackStock: variant.trackStock,
            stockQuantity: variant.stockQuantity,
            sortOrder: variant.sortOrder,
          })),
        });
      })
      .catch((err: Error) => setError(err.message));
  }, [productId]);

  function update<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
  }

  async function upload(file: File, onUrl: (url: string) => void) {
    const body = new FormData();
    body.set("file", file);
    const res = await fetch("/api/admin/uploads", {
      method: "POST",
      credentials: "include",
      body,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    onUrl(data.secure_url as string);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const payload = {
      ...draft,
      tagline: draft.tagline || null,
      material: draft.material || null,
      size: draft.size || null,
      ageRange: draft.ageRange || null,
      features: lines(draft.features),
      careInstructions: lines(draft.careInstructions),
      images: lines(draft.images),
      variants: draft.variants.map((variant, index) => ({
        ...variant,
        badge: variant.badge || null,
        images: lines(variant.images),
        sortOrder: variant.sortOrder || index,
        slug: variant.slug || slugify(variant.name),
      })),
    };
    try {
      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save product");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setPending(false);
    }
  }

  async function unpublish() {
    update("isPublished", false);
  }

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl font-medium">
          {productId ? "Edit product" : "New product"}
        </h1>
        <Link href="/admin/products" className="font-sans text-xs uppercase tracking-[0.14em] text-earth underline">
          Back
        </Link>
      </div>
      {error ? <p className="font-sans text-sm text-red-800">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Name
          <input required className={`${inputClass} mt-2`} value={draft.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Slug
          <input
            required
            className={`${inputClass} mt-2`}
            value={draft.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", e.target.value);
            }}
          />
        </label>
      </div>
      <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
        Collection
        <select
          required
          className={`${inputClass} mt-2`}
          value={draft.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
        >
          <option value="">Choose</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
        Tagline
        <input className={`${inputClass} mt-2`} value={draft.tagline} onChange={(e) => update("tagline", e.target.value)} />
      </label>
      <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
        Description
        <textarea required className={`${inputClass} mt-2 min-h-32 py-2`} value={draft.description} onChange={(e) => update("description", e.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Price (₹)
          <input type="number" min={0} required className={`${inputClass} mt-2`} value={draft.price} onChange={(e) => update("price", Number(e.target.value))} />
        </label>
        <label className="font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Sort
          <input type="number" className={`${inputClass} mt-2`} value={draft.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} />
        </label>
        <label className="font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
          Image alt
          <input required className={`${inputClass} mt-2`} value={draft.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {(["material", "size", "ageRange"] as const).map((key) => (
          <label key={key} className="font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
            {key}
            <input className={`${inputClass} mt-2`} value={draft[key]} onChange={(e) => update(key, e.target.value)} />
          </label>
        ))}
      </div>
      <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
        Images, one URL per line
        <textarea className={`${inputClass} mt-2 min-h-24 py-2`} value={draft.images} onChange={(e) => update("images", e.target.value)} />
      </label>
      <label className="inline-flex cursor-pointer bg-white px-4 py-3 font-sans text-xs uppercase tracking-[0.12em] border border-chocolate/20">
        Upload image
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              await upload(file, (url) => update("images", draft.images ? `${draft.images}\n${url}` : url));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
      </label>
      <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
        Features, one per line
        <textarea className={`${inputClass} mt-2 min-h-20 py-2`} value={draft.features} onChange={(e) => update("features", e.target.value)} />
      </label>
      <label className="block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60">
        Care, one per line
        <textarea className={`${inputClass} mt-2 min-h-20 py-2`} value={draft.careInstructions} onChange={(e) => update("careInstructions", e.target.value)} />
      </label>
      <div className="flex flex-wrap gap-4 font-sans text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={draft.isPublished} onChange={(e) => update("isPublished", e.target.checked)} />
          Published
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={draft.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={draft.requiresPatternSelection} onChange={(e) => update("requiresPatternSelection", e.target.checked)} />
          Pattern picker
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={draft.trackStock} onChange={(e) => update("trackStock", e.target.checked)} />
          Track stock
        </label>
        {draft.trackStock ? (
          <input
            type="number"
            min={0}
            className="h-11 w-24 border border-chocolate/20 px-2"
            value={draft.stockQuantity}
            onChange={(e) => update("stockQuantity", Number(e.target.value))}
          />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Options</h2>
          <button
            type="button"
            className="font-sans text-xs uppercase tracking-[0.14em] text-earth underline"
            onClick={() => update("variants", [...draft.variants, emptyVariant()])}
          >
            Add option
          </button>
        </div>
        {draft.variants.map((variant, index) => (
          <div key={variant.id ?? index} className="grid gap-3 border border-chocolate/10 bg-white p-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Name" value={variant.name} onChange={(e) => {
              const variants = [...draft.variants];
              variants[index] = { ...variant, name: e.target.value, slug: variant.slug || slugify(e.target.value) };
              update("variants", variants);
            }} />
            <input className={inputClass} placeholder="Slug" value={variant.slug} onChange={(e) => {
              const variants = [...draft.variants];
              variants[index] = { ...variant, slug: e.target.value };
              update("variants", variants);
            }} />
            <input type="number" className={inputClass} placeholder="Price" value={variant.price} onChange={(e) => {
              const variants = [...draft.variants];
              variants[index] = { ...variant, price: Number(e.target.value) };
              update("variants", variants);
            }} />
            <input className={inputClass} placeholder="Badge" value={variant.badge} onChange={(e) => {
              const variants = [...draft.variants];
              variants[index] = { ...variant, badge: e.target.value };
              update("variants", variants);
            }} />
            <textarea className={`${inputClass} min-h-20 py-2 sm:col-span-2`} placeholder="Image URLs" value={variant.images} onChange={(e) => {
              const variants = [...draft.variants];
              variants[index] = { ...variant, images: e.target.value };
              update("variants", variants);
            }} />
            <label className="flex items-center gap-2 font-sans text-sm">
              <input type="checkbox" checked={variant.trackStock} onChange={(e) => {
                const variants = [...draft.variants];
                variants[index] = { ...variant, trackStock: e.target.checked };
                update("variants", variants);
              }} />
              Track stock
            </label>
            <input type="number" min={0} className={inputClass} value={variant.stockQuantity} onChange={(e) => {
              const variants = [...draft.variants];
              variants[index] = { ...variant, stockQuantity: Number(e.target.value) };
              update("variants", variants);
            }} />
            <button type="button" className="text-left font-sans text-xs uppercase tracking-[0.12em] text-chocolate/60 underline" onClick={() => update("variants", draft.variants.filter((_, i) => i !== index))}>
              Remove option
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="min-h-11 bg-chocolate px-6 font-sans text-xs uppercase tracking-[0.14em] text-white">
          {pending ? "Saving…" : "Save product"}
        </button>
        {draft.isPublished ? (
          <button type="button" className="min-h-11 border border-chocolate/20 px-6 font-sans text-xs uppercase tracking-[0.14em]" onClick={unpublish}>
            Mark unpublished
          </button>
        ) : null}
      </div>
    </form>
  );
}
