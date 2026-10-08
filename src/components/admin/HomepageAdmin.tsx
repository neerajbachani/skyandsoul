"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { HomeContent } from "@/lib/admin-schemas";

type Banner = HomeContent["shopByCollection"]["banners"]["wide"];
type HeroSlide = HomeContent["hero"]["slides"][number];
type InstagramPost = HomeContent["instagram"]["posts"][number];
type EditorialImage = HomeContent["editorial"]["images"][number];
type BannerSlot = keyof HomeContent["shopByCollection"]["banners"];

type ProductOption = {
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  images: string[];
};

const inputClass = "min-h-11 w-full border border-chocolate/20 bg-white px-3 font-sans text-sm";
const labelClass = "block font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/60";

const BANNER_SLOTS: { key: BannerSlot; label: string }[] = [
  { key: "wide", label: "Wide banner" },
  { key: "left", label: "Left banner" },
  { key: "right", label: "Right banner" },
];

function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return [...items];
  const copy = items.slice();
  const [item] = copy.splice(index, 1);
  if (!item) return [...items];
  copy.splice(nextIndex, 0, item);
  return copy;
}

async function uploadImage(file: File) {
  const body = new FormData();
  body.set("file", file);
  const res = await fetch("/api/admin/uploads", {
    method: "POST",
    credentials: "include",
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.secure_url as string;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className={labelClass}>
      {label}
      {multiline ? (
        <textarea
          className={`${inputClass} mt-2 min-h-24 py-2`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={`${inputClass} mt-2`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function ImageField({
  label,
  hint,
  src,
  onUploaded,
  onError,
}: {
  label?: string;
  hint?: string;
  src: string;
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
}) {
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-1">
      {label ? (
        <p className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50">{label}</p>
      ) : null}
      <div className="flex items-center gap-3">
      <div className="size-16 shrink-0 overflow-hidden bg-sky/30">
        {src ? <img src={src} alt="" className="size-full object-cover" /> : null}
      </div>
      <label className="cursor-pointer font-sans text-xs uppercase tracking-[0.12em] text-earth underline">
        {pending ? "Uploading…" : src ? "Replace image" : "Upload image"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={pending}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            setPending(true);
            try {
              onUploaded(await uploadImage(file));
            } catch (error) {
              onError(error instanceof Error ? error.message : "Upload failed");
            } finally {
              setPending(false);
            }
          }}
        />
      </label>
      </div>
      {hint ? <p className="font-sans text-xs text-chocolate/45">{hint}</p> : null}
    </div>
  );
}

function OrderButtons({
  index,
  total,
  onMove,
}: {
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        className="font-sans text-xs uppercase tracking-[0.12em] text-earth underline disabled:text-chocolate/30"
        disabled={index === 0}
        onClick={() => onMove(-1)}
      >
        Up
      </button>
      <button
        type="button"
        className="font-sans text-xs uppercase tracking-[0.12em] text-earth underline disabled:text-chocolate/30"
        disabled={index === total - 1}
        onClick={() => onMove(1)}
      >
        Down
      </button>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-5 border border-chocolate/10 bg-white p-5">
      <div>
        <h2 className="font-serif text-2xl">{title}</h2>
        {hint ? <p className="mt-2 font-sans text-sm text-chocolate/70">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function BannerFields({
  banner,
  onChange,
  onError,
}: {
  banner: Banner;
  onChange: (banner: Banner) => void;
  onError: (message: string) => void;
}) {
  return (
    <div className="space-y-3 border border-chocolate/10 p-4">
      <ImageField
        src={banner.src}
        onError={onError}
        onUploaded={(src) => onChange({ ...banner, src, objectPosition: "object-center" })}
      />
      <Field label="Label" value={banner.label} onChange={(label) => onChange({ ...banner, label })} />
      <Field label="Link" value={banner.href} onChange={(href) => onChange({ ...banner, href })} />
      <Field label="Image description" value={banner.alt} onChange={(alt) => onChange({ ...banner, alt })} />
    </div>
  );
}

export function HomepageAdmin() {
  const [draft, setDraft] = useState<HomeContent | null>(null);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productQuery, setProductQuery] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/admin/homepage", { credentials: "include" }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load homepage");
        return data.content as HomeContent;
      }),
      fetch("/api/admin/products", { credentials: "include" }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load products");
        return data.products as ProductOption[];
      }),
    ])
      .then(([content, nextProducts]) => {
        if (cancelled) return;
        setDraft(content);
        setProducts(nextProducts);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const productMatches = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    return products
      .filter((product) => product.isPublished)
      .filter((product) => {
        if (!query) return true;
        return (
          product.name.toLowerCase().includes(query) ||
          product.slug.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [productQuery, products]);

  function update(recipe: (current: HomeContent) => HomeContent) {
    setSaved(false);
    setDraft((current) => (current ? recipe(current) : current));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setPending(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save homepage");
      setDraft(data.content as HomeContent);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save homepage");
    } finally {
      setPending(false);
    }
  }

  if (loading) return <p className="font-serif text-lg text-chocolate/70">Loading homepage…</p>;
  if (!draft) {
    return <p className="font-sans text-sm text-red-800">{error || "Could not load homepage"}</p>;
  }

  const selectedIds = new Set(draft.spotlightProductIds);

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium">Homepage</h1>
          <p className="mt-2 max-w-2xl font-sans text-sm text-chocolate/70">
            Edit the hero, collection banners, gift collage, and Instagram images. Spotlight
            chooses which products appear, in order.
          </p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 bg-chocolate px-5 font-sans text-xs uppercase tracking-[0.14em] text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save homepage"}
        </button>
      </div>
      {error ? <p className="font-sans text-sm text-red-800">{error}</p> : null}
      {saved ? <p className="font-sans text-sm text-earth">Homepage saved.</p> : null}

      <Section title="Hero" hint="One to six slides. The first slide is what visitors see first.">
        {draft.hero.slides.map((slide, index) => (
          <article key={slide.id} className="space-y-3 border border-chocolate/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-sans text-xs uppercase tracking-[0.14em] text-chocolate/50">
                Slide {index + 1}
              </p>
              <div className="flex items-center gap-4">
                <OrderButtons
                  index={index}
                  total={draft.hero.slides.length}
                  onMove={(direction) =>
                    update((current) => ({
                      ...current,
                      hero: { slides: moveItem(current.hero.slides, index, direction) },
                    }))
                  }
                />
                <button
                  type="button"
                  className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50 underline disabled:text-chocolate/30"
                  disabled={draft.hero.slides.length === 1}
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      hero: { slides: current.hero.slides.filter((item) => item.id !== slide.id) },
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
            <ImageField
              label="Desktop image"
              src={slide.image}
              onError={setError}
              onUploaded={(image) =>
                update((current) => ({
                  ...current,
                  hero: {
                    slides: current.hero.slides.map((item) =>
                      item.id === slide.id ? { ...item, image } : item,
                    ),
                  },
                }))
              }
            />
            <ImageField
              label="Mobile image (optional)"
              hint="Used below the md breakpoint when set. Leave empty to use the desktop image on all screens."
              src={slide.imageMobile ?? ""}
              onError={setError}
              onUploaded={(image) =>
                update((current) => ({
                  ...current,
                  hero: {
                    slides: current.hero.slides.map((item) =>
                      item.id === slide.id ? { ...item, imageMobile: image } : item,
                    ),
                  },
                }))
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <SlideField slide={slide} field="eyebrow" label="Eyebrow" onUpdate={update} />
              <SlideField slide={slide} field="cta" label="Button label" onUpdate={update} />
              <SlideField slide={slide} field="headline" label="Headline" onUpdate={update} />
              <SlideField slide={slide} field="ctaHref" label="Button link" onUpdate={update} />
            </div>
            <SlideField slide={slide} field="subheadline" label="Subheadline" onUpdate={update} />
            <SlideField slide={slide} field="imageAlt" label="Image description" onUpdate={update} />
          </article>
        ))}
        <button
          type="button"
          className="font-sans text-xs uppercase tracking-[0.12em] text-earth underline disabled:text-chocolate/30"
          disabled={draft.hero.slides.length >= 6}
          onClick={() =>
            update((current) => ({
              ...current,
              hero: {
                slides: [
                  ...current.hero.slides,
                  {
                    id: crypto.randomUUID(),
                    eyebrow: "New",
                    headline: "A new beginning",
                    subheadline: "Handmade for the moments that stay.",
                    cta: "Shop the collection",
                    ctaHref: "/collections",
                    image: "",
                    imageAlt: "",
                  },
                ],
              },
            }))
          }
        >
          Add slide
        </button>
      </Section>

      <Section title="Shop by Collection">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Eyebrow"
            value={draft.shopByCollection.eyebrow}
            onChange={(eyebrow) =>
              update((current) => ({
                ...current,
                shopByCollection: { ...current.shopByCollection, eyebrow },
              }))
            }
          />
          <Field
            label="Title"
            value={draft.shopByCollection.title}
            onChange={(title) =>
              update((current) => ({
                ...current,
                shopByCollection: { ...current.shopByCollection, title },
              }))
            }
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {BANNER_SLOTS.map((slot) => (
            <div key={slot.key}>
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.14em] text-chocolate/50">
                {slot.label}
              </p>
              <BannerFields
                banner={draft.shopByCollection.banners[slot.key]}
                onError={setError}
                onChange={(banner) =>
                  update((current) => ({
                    ...current,
                    shopByCollection: {
                      ...current.shopByCollection,
                      banners: { ...current.shopByCollection.banners, [slot.key]: banner },
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Featured banners" hint="The second image row under Shop by Collection.">
        <div className="grid gap-4 lg:grid-cols-3">
          {BANNER_SLOTS.map((slot) => (
            <div key={slot.key}>
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.14em] text-chocolate/50">
                {slot.label}
              </p>
              <BannerFields
                banner={draft.featuredBanners[slot.key]}
                onError={setError}
                onChange={(banner) =>
                  update((current) => ({
                    ...current,
                    featuredBanners: { ...current.featuredBanners, [slot.key]: banner },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Gift collage" hint="Four images sit beside the gift message.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Eyebrow"
            value={draft.editorial.eyebrow}
            onChange={(eyebrow) =>
              update((current) => ({
                ...current,
                editorial: { ...current.editorial, eyebrow },
              }))
            }
          />
          <Field
            label="Button label"
            value={draft.editorial.cta}
            onChange={(cta) =>
              update((current) => ({
                ...current,
                editorial: { ...current.editorial, cta },
              }))
            }
          />
        </div>
        <Field
          label="Heading"
          value={draft.editorial.heading}
          onChange={(heading) =>
            update((current) => ({
              ...current,
              editorial: { ...current.editorial, heading },
            }))
          }
        />
        <Field
          label="Description"
          value={draft.editorial.body}
          multiline
          onChange={(body) =>
            update((current) => ({
              ...current,
              editorial: { ...current.editorial, body },
            }))
          }
        />
        <Field
          label="Button link"
          value={draft.editorial.ctaHref}
          onChange={(ctaHref) =>
            update((current) => ({
              ...current,
              editorial: { ...current.editorial, ctaHref },
            }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {draft.editorial.images.map((image, index) => (
            <div key={`${image.src}-${index}`} className="space-y-3 border border-chocolate/10 p-4">
              <p className="font-sans text-xs uppercase tracking-[0.14em] text-chocolate/50">
                Image {index + 1}
              </p>
              <ImageField
                src={image.src}
                onError={setError}
                onUploaded={(src) =>
                  update((current) => ({
                    ...current,
                    editorial: {
                      ...current.editorial,
                      images: replaceEditorialImage(current.editorial.images, index, {
                        ...image,
                        src,
                        objectPosition: "object-center",
                      }),
                    },
                  }))
                }
              />
              <Field
                label="Image description"
                value={image.alt}
                onChange={(alt) =>
                  update((current) => ({
                    ...current,
                    editorial: {
                      ...current.editorial,
                      images: replaceEditorialImage(current.editorial.images, index, {
                        ...current.editorial.images[index],
                        alt,
                      }),
                    },
                  }))
                }
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Instagram" hint="One to 24 posts. Reels and posts use the same image treatment.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Handle"
            value={draft.instagram.handle}
            onChange={(handle) =>
              update((current) => ({
                ...current,
                instagram: { ...current.instagram, handle },
              }))
            }
          />
          <Field
            label="Profile link"
            value={draft.instagram.href}
            onChange={(href) =>
              update((current) => ({
                ...current,
                instagram: { ...current.instagram, href },
              }))
            }
          />
        </div>
        {draft.instagram.posts.map((post, index) => (
          <article key={post.id} className="space-y-3 border border-chocolate/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-sans text-xs uppercase tracking-[0.14em] text-chocolate/50">
                Post {index + 1}
              </p>
              <div className="flex items-center gap-4">
                <OrderButtons
                  index={index}
                  total={draft.instagram.posts.length}
                  onMove={(direction) =>
                    update((current) => ({
                      ...current,
                      instagram: {
                        ...current.instagram,
                        posts: moveItem(current.instagram.posts, index, direction),
                      },
                    }))
                  }
                />
                <button
                  type="button"
                  className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50 underline disabled:text-chocolate/30"
                  disabled={draft.instagram.posts.length === 1}
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      instagram: {
                        ...current.instagram,
                        posts: current.instagram.posts.filter((item) => item.id !== post.id),
                      },
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            </div>
            <ImageField
              src={post.src}
              onError={setError}
              onUploaded={(src) =>
                update((current) => ({
                  ...current,
                  instagram: {
                    ...current.instagram,
                    posts: current.instagram.posts.map((item) =>
                      item.id === post.id ? { ...item, src } : item,
                    ),
                  },
                }))
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Post link"
                value={post.href}
                onChange={(href) => updatePost(update, post.id, { href })}
              />
              <label className={labelClass}>
                Type
                <select
                  className={`${inputClass} mt-2`}
                  value={post.kind}
                  onChange={(event) =>
                    updatePost(update, post.id, { kind: event.target.value as InstagramPost["kind"] })
                  }
                >
                  <option value="reel">Reel</option>
                  <option value="post">Post</option>
                </select>
              </label>
            </div>
            <Field
              label="Image description"
              value={post.alt}
              onChange={(alt) => updatePost(update, post.id, { alt })}
            />
          </article>
        ))}
        <button
          type="button"
          className="font-sans text-xs uppercase tracking-[0.12em] text-earth underline disabled:text-chocolate/30"
          disabled={draft.instagram.posts.length >= 24}
          onClick={() =>
            update((current) => ({
              ...current,
              instagram: {
                ...current.instagram,
                posts: [
                  ...current.instagram.posts,
                  {
                    id: crypto.randomUUID(),
                    href: current.instagram.href || "https://www.instagram.com/skynsoul.co/",
                    src: "",
                    alt: "",
                    kind: "post",
                  },
                ],
              },
            }))
          }
        >
          Add post
        </button>
      </Section>

      <Section
        title="Spotlight"
        hint="Choose up to 12 published products and set their order. Leave this empty to keep showing featured products."
      >
        <ol className="space-y-2">
          {draft.spotlightProductIds.map((id, index) => {
            const product = productById.get(id);
            return (
              <li
                key={id}
                className="flex flex-wrap items-center justify-between gap-3 border border-chocolate/10 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="size-12 shrink-0 overflow-hidden bg-sky/30">
                    {product?.images[0] ? (
                      <img src={product.images[0]} alt="" className="size-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-serif text-lg">{product?.name ?? "Unavailable product"}</p>
                    {product && !product.isPublished ? (
                      <p className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50">
                        Unpublished
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <OrderButtons
                    index={index}
                    total={draft.spotlightProductIds.length}
                    onMove={(direction) =>
                      update((current) => ({
                        ...current,
                        spotlightProductIds: moveItem(current.spotlightProductIds, index, direction),
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="font-sans text-xs uppercase tracking-[0.12em] text-chocolate/50 underline"
                    onClick={() =>
                      update((current) => ({
                        ...current,
                        spotlightProductIds: current.spotlightProductIds.filter((item) => item !== id),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
        <Field label="Search products" value={productQuery} onChange={setProductQuery} />
        <ul className="divide-y divide-chocolate/10 border border-chocolate/10">
          {productMatches.map((product) => {
            const added = selectedIds.has(product.id);
            return (
              <li key={product.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <p className="font-sans text-sm">{product.name}</p>
                <button
                  type="button"
                  className="font-sans text-xs uppercase tracking-[0.12em] text-earth underline disabled:text-chocolate/30"
                  disabled={added || draft.spotlightProductIds.length >= 12}
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      spotlightProductIds: [...current.spotlightProductIds, product.id],
                    }))
                  }
                >
                  {added ? "Added" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      </Section>
    </form>
  );
}

function SlideField({
  slide,
  field,
  label,
  onUpdate,
}: {
  slide: HeroSlide;
  field: "eyebrow" | "headline" | "subheadline" | "cta" | "ctaHref" | "imageAlt";
  label: string;
  onUpdate: (recipe: (current: HomeContent) => HomeContent) => void;
}) {
  return (
    <Field
      label={label}
      value={slide[field]}
      onChange={(value) =>
        onUpdate((current) => ({
          ...current,
          hero: {
            slides: current.hero.slides.map((item) =>
              item.id === slide.id ? { ...item, [field]: value } : item,
            ),
          },
        }))
      }
    />
  );
}

function updatePost(
  onUpdate: (recipe: (current: HomeContent) => HomeContent) => void,
  id: string,
  patch: Partial<InstagramPost>,
) {
  onUpdate((current) => ({
    ...current,
    instagram: {
      ...current.instagram,
      posts: current.instagram.posts.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    },
  }));
}

function replaceEditorialImage(
  images: HomeContent["editorial"]["images"],
  index: number,
  image: EditorialImage,
): HomeContent["editorial"]["images"] {
  const next = images.map((item, itemIndex) => (itemIndex === index ? image : item));
  const [first, second, third, fourth] = next;
  if (!first || !second || !third || !fourth) return images;
  return [first, second, third, fourth];
}
