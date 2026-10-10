import type { Prisma } from "@prisma/client";
import type { SpotlightProduct } from "@/lib/types";
import { homeContentSchema, type HomeContent } from "@/lib/admin-schemas";
import { listProducts } from "@/lib/catalog";
import { rawHomeDefaults } from "@/lib/home-defaults";
import { prisma } from "@/lib/prisma";

export type { HomeContent };

export const DEFAULT_HOME_CONTENT: HomeContent = homeContentSchema.parse(rawHomeDefaults);

const HOME_PAGE_ID = "home";

const spotlightInclude = {
  category: { select: { name: true, slug: true } },
} as const;

type SpotlightRecord = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  imageAlt: string;
  category: { name: string; slug: string };
};

function toSpotlightProduct(product: SpotlightRecord): SpotlightProduct {
  return {
    slug: product.slug,
    name: product.name,
    price: product.price,
    images: product.images,
    imageAlt: product.imageAlt,
    category: product.category,
  };
}

/** Keep saved hero copy in the DB while syncing image URLs from code defaults. */
export function mergeHeroSlidesFromDefaults(content: HomeContent): HomeContent {
  const defaultsById = new Map(
    DEFAULT_HOME_CONTENT.hero.slides.map((slide) => [slide.id, slide]),
  );

  return {
    ...content,
    hero: {
      slides: content.hero.slides.map((slide) => {
        const defaults = defaultsById.get(slide.id);
        if (!defaults) return slide;

        const { imageMobile: _removed, ...rest } = slide;
        return {
          ...rest,
          image: defaults.image,
          imageAlt: defaults.imageAlt,
          ...(defaults.imageMobile ? { imageMobile: defaults.imageMobile } : {}),
        };
      }),
    },
  };
}

/** If DB has legacy gifting copy, migrate to new curated e-commerce copy */
export function mergeEditorialFromDefaults(content: HomeContent): HomeContent {
  if (
    content.editorial.eyebrow === "Gifting" ||
    content.editorial.heading === "The Perfect Gift for New Beginnings"
  ) {
    return {
      ...content,
      editorial: {
        ...DEFAULT_HOME_CONTENT.editorial,
        images: content.editorial.images,
      },
    };
  }
  return content;
}

export async function readHomeContent(): Promise<{ content: HomeContent; saved: boolean }> {
  const row = await prisma.homePage.findUnique({ where: { id: HOME_PAGE_ID } });
  if (!row) return { content: DEFAULT_HOME_CONTENT, saved: false };
  const parsed = homeContentSchema.safeParse(row.content);
  if (!parsed.success) return { content: DEFAULT_HOME_CONTENT, saved: false };
  return {
    content: mergeEditorialFromDefaults(mergeHeroSlidesFromDefaults(parsed.data)),
    saved: true,
  };
}

async function resolveSpotlight(ids: string[]): Promise<SpotlightProduct[]> {
  if (ids.length > 0) {
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, isPublished: true },
      include: spotlightInclude,
    });
    const byId = new Map(products.map((product) => [product.id, product]));
    const ordered = ids.flatMap((id) => {
      const product = byId.get(id);
      return product ? [toSpotlightProduct(product)] : [];
    });
    if (ordered.length > 0) return ordered;
  }

  const featured = await listProducts({ featured: true, limit: 8 });
  return featured.products.map(toSpotlightProduct);
}

export async function getHomeContent(): Promise<{
  content: HomeContent;
  spotlightProducts: SpotlightProduct[];
}> {
  const { content } = await readHomeContent();
  const spotlightProducts = await resolveSpotlight(content.spotlightProductIds);
  return { content, spotlightProducts };
}

export async function saveHomeContent(content: HomeContent) {
  const json = content as Prisma.InputJsonValue;
  await prisma.homePage.upsert({
    where: { id: HOME_PAGE_ID },
    create: { id: HOME_PAGE_ID, content: json },
    update: { content: json },
  });
  return content;
}
