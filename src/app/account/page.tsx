import type { Metadata } from "next";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = {
  title: "Your account",
  description: "Update your Sky n Soul profile and password.",
};

export default function AccountPage() {
  return <ProfileForm />;
}
