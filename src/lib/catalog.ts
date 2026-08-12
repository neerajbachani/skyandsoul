import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { PaginationMeta } from "@/lib/types";

export { formatInr, productHref, collectionHref } from "@/lib/money";

export function buildPagination(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage: hasNextPage ? page + 1 : null,
    previousPage: hasPreviousPage ? page - 1 : null,
  };
}

export async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return categories.map((category) => ({
    ...category,
    productCount: category._count.products,
  }));
}

export async function getCategoryBySlug(
  slug: string,
  page = 1,
  limit = 24,
) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return null;

  const where = { categoryId: category.id };
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    ...category,
    products,
    pagination: buildPagination(page, limit, total),
  };
}

type ProductListParams = {
  search?: string | null;
  category?: string | null;
  featured?: boolean;
  page?: number;
  limit?: number;
};

export async function listProducts({
  search,
  category,
  featured = false,
  page = 1,
  limit = 12,
}: ProductListParams = {}) {
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tagline: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (featured) {
    where.isFeatured = true;
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, slug: true, name: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: buildPagination(page, limit, total),
    filters: {
      search: search ?? null,
      category: category ?? null,
      featured,
    },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { id: true, slug: true, name: true },
      },
    },
  });

  if (!product) return null;

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: {
      category: {
        select: { id: true, slug: true, name: true },
      },
    },
    orderBy: { sortOrder: "asc" },
    take: 4,
  });

  return { ...product, related };
}
