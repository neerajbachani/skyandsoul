import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Sky n Soul team for orders, gifts, and custom keepsakes.",
};

export default function ContactPage() {
  const fullAddress = `${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.pincode}`;

  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Speak to Us"
      intro="Tell us what you are looking for — a blanket, a toy, a Frame It Your Way idea, or a gift note."
    >
      <div className="space-y-6">
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
            Address
          </p>
          <p className="mt-2 font-serif text-lg leading-relaxed text-chocolate/80">
            {fullAddress}
          </p>
        </div>

        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
            Hours
          </p>
          <p className="mt-2 font-serif text-lg text-chocolate/80">{SITE.hours}</p>
        </div>

        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
            Email
          </p>
          <p className="mt-2">
            <a
              href={`mailto:${SITE.email}`}
              className="font-serif text-lg text-chocolate/80 underline-offset-4 hover:text-earth hover:underline"
            >
              {SITE.email}
            </a>
          </p>
        </div>

        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
            Phone
          </p>
          <ul className="mt-2 space-y-2">
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

      <div className="mt-8">
        <Button href="/faq" showArrow variant="text">
          Visit Help Desk
        </Button>
      </div>
    </ContentPageLayout>
  );
}
