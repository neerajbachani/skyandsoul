import type { Metadata } from "next";
import { AddressesManager } from "@/components/account/AddressesManager";

export const metadata: Metadata = {
  title: "Addresses",
  description: "Saved shipping addresses for your Sky n Soul orders.",
};

export default function AddressesPage() {
  return <AddressesManager />;
}
