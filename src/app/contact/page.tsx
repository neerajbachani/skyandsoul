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
      <div className="space-y-4">
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
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
            Contact details
          </p>
          <ul className="mt-3 space-y-2">
            {SITE.phones.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone}`}
                  className="font-serif text-lg text-chocolate/80 underline-offset-4 hover:text-earth hover:underline"
                >
                  {phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ContactForm />
    </ContentPageLayout>
  );
}
