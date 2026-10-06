import type { Metadata } from "next";
import { HomepageAdmin } from "@/components/admin/HomepageAdmin";

export const metadata: Metadata = { title: "Homepage" };

export default function AdminHomepagePage() {
  return <HomepageAdmin />;
}
