import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Sky n Soul team for orders, gifts, and custom keepsakes.",
};

export default function ContactPage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Contact Us"
      intro="Tell us what you are looking for — a blanket, a toy, a Frame It Your Way idea, or a gift note."
    >
      <p>
        Prefer email? Write to{" "}
        <a
          href={`mailto:${SITE.email}`}
          className="text-earth underline underline-offset-4"
        >
          {SITE.email}
        </a>
        .
      </p>
      <ContactForm />
    </ContentPageLayout>
  );
}
