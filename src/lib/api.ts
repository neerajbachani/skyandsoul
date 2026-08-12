import type {
  ApiSuccess,
  CategorySummary,
  CategoryWithProducts,
  ProductDetail,
  ProductsResponse,
} from "@/lib/types";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${path} (${res.status})`);
  }

  const json = (await res.json()) as ApiSuccess<T>;
  return json.data;
}

export async function fetchCategories() {
  return apiGet<CategorySummary[]>("/api/categories");
}

export async function fetchCategory(slug: string, page = 1, limit = 24) {
  return apiGet<CategoryWithProducts>(
    `/api/categories/${slug}?page=${page}&limit=${limit}`,
  );
}

export async function fetchProducts(params: {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
} = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.featured) query.set("featured", "true");
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  return apiGet<ProductsResponse>(`/api/products${qs ? `?${qs}` : ""}`);
}

export async function fetchProduct(slug: string) {
  return apiGet<ProductDetail>(`/api/products/${slug}`);
}
