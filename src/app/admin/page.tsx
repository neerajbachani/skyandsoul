import type { Metadata } from "next";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const metadata: Metadata = { title: "Studio" };

export default function AdminHomePage() {
  return <DashboardClient />;
}
