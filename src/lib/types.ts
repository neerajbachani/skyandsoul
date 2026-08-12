import type { Category, Product } from "@prisma/client";

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  network: "instagram" | "pinterest" | "email";
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  detail: string;
};

export type ValueProp = {
  id: string;
  title: string;
  description: string;
};

export type CategorySummary = Category & {
  _count?: { products: number };
  productCount?: number;
};

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "slug" | "name">;
};

export type ProductDetail = ProductWithCategory & {
  related?: ProductWithCategory[];
};

export type CategoryWithProducts = Category & {
  products: Product[];
  pagination?: PaginationMeta;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

export type ProductsResponse = {
  products: ProductWithCategory[];
  pagination: PaginationMeta;
  filters: {
    search: string | null;
    category: string | null;
    featured: boolean;
  };
};

export type ApiSuccess<T> = {
  status: number;
  data: T;
  message: string;
};

/** @deprecated Homepage card shape — prefer ProductWithCategory */
export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  href: string;
  image: string;
  imageAlt: string;
  category: string;
  giftReady?: boolean;
};

/** @deprecated Homepage category card — prefer CategorySummary */
export type CategoryCardData = {
  id: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
};
