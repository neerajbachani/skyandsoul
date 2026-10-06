import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  return <ProductForm productId={id} />;
}
