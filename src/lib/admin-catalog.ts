import type { Prisma } from "@prisma/client";
import { ApiError } from "@/middleware/errorHandler";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(value: string, fallback: string) {
  const slug = slugify(value || fallback);
  if (!slug || !slugPattern.test(slug)) {
    throw new ApiError("Use a lowercase slug with letters, numbers, and hyphens", 400);
  }
  return slug;
}

export type VariantInput = {
  id?: string;
  slug: string;
  name: string;
  price: number;
  badge?: string | null;
  images: string[];
  trackStock: boolean;
  stockQuantity: number;
  sortOrder: number;
};

export type ProductInput = {
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  material?: string | null;
  size?: string | null;
  ageRange?: string | null;
  features: string[];
  careInstructions: string[];
  images: string[];
  imageAlt: string;
  price: number;
  categoryId: string;
  isFeatured: boolean;
  requiresPatternSelection: boolean;
  isPublished: boolean;
  trackStock: boolean;
  stockQuantity: number;
  sortOrder: number;
  variants: VariantInput[];
};

const productInclude = {
  category: { select: { id: true, slug: true, name: true } },
  variants: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ProductInclude;

function emptyToNull(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function saveProduct(input: ProductInput, productId?: string) {
  const slug = normalizeSlug(input.slug, input.name);
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) throw new ApiError("Category not found", 400);
  if (input.images.length === 0) throw new ApiError("Add at least one image", 400);

  const slugOwner = await prisma.product.findUnique({ where: { slug } });
  if (slugOwner && slugOwner.id !== productId) {
    throw new ApiError("A product with this slug already exists", 409);
  }

  const variantSlugs = input.variants.map((variant, index) =>
    normalizeSlug(variant.slug, variant.name || `option-${index + 1}`),
  );
  if (new Set(variantSlugs).size !== variantSlugs.length) {
    throw new ApiError("Variant slugs must be unique", 400);
  }

  const data = {
    name: input.name.trim(),
    slug,
    tagline: emptyToNull(input.tagline),
    description: input.description.trim(),
    material: emptyToNull(input.material),
    size: emptyToNull(input.size),
    ageRange: emptyToNull(input.ageRange),
    features: input.features.map((item) => item.trim()).filter(Boolean),
    careInstructions: input.careInstructions.map((item) => item.trim()).filter(Boolean),
    images: input.images,
    imageAlt: input.imageAlt.trim(),
    price: input.price,
    categoryId: input.categoryId,
    isFeatured: input.isFeatured,
    requiresPatternSelection: input.requiresPatternSelection,
    isPublished: input.isPublished,
    trackStock: input.trackStock,
    stockQuantity: input.stockQuantity,
    sortOrder: input.sortOrder,
  };

  return prisma.$transaction(async (tx) => {
    const product = productId
      ? await tx.product.update({ where: { id: productId }, data })
      : await tx.product.create({ data });

    if (productId) {
      const existing = await tx.productVariant.findMany({ where: { productId } });
      const keepIds = new Set(input.variants.map((variant) => variant.id).filter(Boolean));
      const removed = existing.filter((variant) => !keepIds.has(variant.id));

      for (const variant of removed) {
        const [carts, orders] = await Promise.all([
          tx.cartItem.count({ where: { variantId: variant.id } }),
          tx.orderItem.count({ where: { variantId: variant.id } }),
        ]);
        if (carts > 0 || orders > 0) {
          throw new ApiError(
            `“${variant.name}” is in a cart or order. Unpublish the product or set its stock to zero instead of deleting that option.`,
            409,
          );
        }
        await tx.productVariant.delete({ where: { id: variant.id } });
      }
    }

    for (const [index, variant] of input.variants.entries()) {
      const variantData = {
        slug: variantSlugs[index],
        name: variant.name.trim(),
        price: variant.price,
        badge: emptyToNull(variant.badge),
        images: variant.images,
        trackStock: variant.trackStock,
        stockQuantity: variant.stockQuantity,
        sortOrder: variant.sortOrder || index,
      };

      if (variant.id) {
        const owned = await tx.productVariant.findFirst({
          where: { id: variant.id, productId: product.id },
        });
        if (!owned) throw new ApiError("Variant not found", 400);
        await tx.productVariant.update({ where: { id: variant.id }, data: variantData });
      } else {
        await tx.productVariant.create({
          data: { ...variantData, productId: product.id },
        });
      }
    }

    return tx.product.findUniqueOrThrow({
      where: { id: product.id },
      include: productInclude,
    });
  });
}

export async function deleteProduct(productId: string) {
  const orders = await prisma.orderItem.count({ where: { productId } });
  if (orders > 0) {
    throw new ApiError(
      "This product has been ordered. Unpublish it instead of deleting it.",
      409,
    );
  }
  await prisma.product.delete({ where: { id: productId } });
}

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
  image: string;
  imageAlt: string;
  sortOrder: number;
};

export async function saveCategory(input: CategoryInput, categoryId?: string) {
  const slug = normalizeSlug(input.slug, input.name);
  const slugOwner = await prisma.category.findUnique({ where: { slug } });
  if (slugOwner && slugOwner.id !== categoryId) {
    throw new ApiError("A collection with this slug already exists", 409);
  }

  const data = {
    name: input.name.trim(),
    slug,
    description: input.description.trim(),
    image: input.image.trim(),
    imageAlt: input.imageAlt.trim(),
    sortOrder: input.sortOrder,
  };

  if (categoryId) {
    return prisma.category.update({ where: { id: categoryId }, data });
  }
  return prisma.category.create({ data });
}

export async function deleteCategory(categoryId: string) {
  const products = await prisma.product.count({ where: { categoryId } });
  if (products > 0) {
    throw new ApiError("Move or delete the products in this collection first", 409);
  }
  await prisma.category.delete({ where: { id: categoryId } });
}
