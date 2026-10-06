import type { Metadata } from "next";
import { CustomersAdmin } from "@/components/admin/CustomersAdmin";

export const metadata: Metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  return <CustomersAdmin />;
}
