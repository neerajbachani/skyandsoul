import { z } from "zod";

const slug = z.string().trim().min(1).max(80);

export const variantSchema = z.object({
  id: z.string().min(1).optional(),
  slug,
  name: z.string().trim().min(1).max(120),
  price: z.number().int().min(0),
  badge: z.string().trim().max(40).nullable().optional(),
  images: z.array(z.string().trim().min(1)).default([]),
  trackStock: z.boolean().default(false),
  stockQuantity: z.number().int().min(0).default(0),
  sortOrder: z.number().int().default(0),
});

export const productSchema = z.object({
  name: z.string().trim().min(1).max(160),
  slug,
  tagline: z.string().trim().max(200).nullable().optional(),
  description: z.string().trim().min(1),
  material: z.string().trim().max(120).nullable().optional(),
  size: z.string().trim().max(120).nullable().optional(),
  ageRange: z.string().trim().max(80).nullable().optional(),
  features: z.array(z.string()).default([]),
  careInstructions: z.array(z.string()).default([]),
  images: z.array(z.string().trim().min(1)).min(1),
  imageAlt: z.string().trim().min(1).max(200),
  price: z.number().int().min(0),
  categoryId: z.string().min(1),
  isFeatured: z.boolean().default(false),
  requiresPatternSelection: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  trackStock: z.boolean().default(false),
  stockQuantity: z.number().int().min(0).default(0),
  sortOrder: z.number().int().default(0),
  variants: z.array(variantSchema).default([]),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug,
  description: z.string().trim().min(1),
  image: z.string().trim().min(1),
  imageAlt: z.string().trim().min(1).max(200),
  sortOrder: z.number().int().default(0),
});

export const orderPatchSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
  carrier: z.string().trim().max(80).nullable().optional(),
  trackingNumber: z.string().trim().max(80).nullable().optional(),
  trackingUrl: z.string().trim().max(300).nullable().optional(),
  internalNote: z.string().trim().max(2000).nullable().optional(),
  recordRefund: z.boolean().optional(),
});

const siteLink = z
  .string()
  .trim()
  .min(1, "Add a link")
  .max(300)
  .refine(
    (value) => value.startsWith("/") || value.startsWith("https://"),
    "Use a site path starting with / or an https URL",
  );

const imageUrl = z
  .string()
  .trim()
  .min(1, "Choose an image")
  .max(500)
  .refine(
    (value) => value.startsWith("/") || value.startsWith("https://"),
    "Use an uploaded image",
  );

const imageAlt = z.string().trim().min(1, "Add image description text").max(200);

function hasUniqueIds(items: { id: string }[]) {
  return new Set(items.map((item) => item.id)).size === items.length;
}

const bannerSchema = z.object({
  src: imageUrl,
  alt: imageAlt,
  href: siteLink,
  label: z.string().trim().min(1, "Add a label").max(80),
  objectPosition: z.string().trim().max(80).optional(),
});

const bannerSetSchema = z.object({
  wide: bannerSchema,
  left: bannerSchema,
  right: bannerSchema,
});

const heroSlideSchema = z.object({
  id: z.string().trim().min(1).max(80),
  eyebrow: z.string().trim().min(1, "Add a hero eyebrow").max(80),
  headline: z.string().trim().min(1, "Add a hero headline").max(160),
  subheadline: z.string().trim().min(1, "Add a hero subheadline").max(240),
  cta: z.string().trim().min(1, "Add a hero button label").max(80),
  ctaHref: siteLink,
  image: imageUrl,
  imageMobile: imageUrl.optional(),
  imageAlt,
});

const editorialImageSchema = z.object({
  src: imageUrl,
  alt: imageAlt,
  objectPosition: z.string().trim().max(80).optional(),
});

const instagramPostSchema = z.object({
  id: z.string().trim().min(1).max(80),
  href: siteLink,
  src: imageUrl,
  alt: imageAlt,
  kind: z.enum(["reel", "post"]),
});

export const homeContentSchema = z.object({
  hero: z.object({
    slides: z
      .array(heroSlideSchema)
      .min(1, "Add at least one hero slide")
      .max(6, "Hero can have at most 6 slides")
      .refine(hasUniqueIds, "Hero slides need unique ids"),
  }),
  shopByCollection: z.object({
    eyebrow: z.string().trim().min(1, "Add a Shop by Collection eyebrow").max(80),
    title: z.string().trim().min(1, "Add a Shop by Collection title").max(120),
    banners: bannerSetSchema,
  }),
  featuredBanners: bannerSetSchema,
  editorial: z.object({
    eyebrow: z.string().trim().min(1, "Add a gift collage eyebrow").max(80),
    heading: z.string().trim().min(1, "Add a gift collage heading").max(160),
    body: z.string().trim().min(1, "Add a gift collage description").max(500),
    cta: z.string().trim().min(1, "Add a gift collage button label").max(80),
    ctaHref: siteLink,
    images: z.tuple([
      editorialImageSchema,
      editorialImageSchema,
      editorialImageSchema,
      editorialImageSchema,
    ]),
  }),
  instagram: z.object({
    handle: z
      .string()
      .trim()
      .min(1, "Add an Instagram handle")
      .max(40)
      .transform((value) => value.replace(/^@/, "")),
    href: siteLink,
    posts: z
      .array(instagramPostSchema)
      .min(1, "Add at least one Instagram post")
      .max(24, "Instagram can have at most 24 posts")
      .refine(hasUniqueIds, "Instagram posts need unique ids"),
  }),
  spotlightProductIds: z
    .array(z.string().trim().min(1))
    .max(12, "Spotlight can include at most 12 products")
    .refine((ids) => new Set(ids).size === ids.length, "Spotlight products must be unique"),
});

export type HomeContent = z.infer<typeof homeContentSchema>;
