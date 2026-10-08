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

const contactDetailValue =
  "font-serif text-lg font-medium leading-relaxed tracking-[0.01em] text-chocolate sm:text-xl";

export default function ContactPage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Speak to Us"
      intro="Tell us what you are looking for — a blanket, a toy, a Frame It Your Way idea, or a gift note."
      introClassName="font-sans text-lg sm:text-xl text-chocolate/90"
      bodyClassName="space-y-10 font-sans text-base leading-relaxed text-chocolate sm:text-lg sm:leading-7"
    >
      <div className="space-y-8">
        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-earth">
            Address
          </p>
          <p className={`mt-3 ${contactDetailValue}`}>
            {SITE.address.line1}
            <br />
            {SITE.address.city}
            <br />
            {SITE.address.pincode}
          </p>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-earth">
            Hours
          </p>
          <p className={`mt-3 ${contactDetailValue}`}>{SITE.hours}</p>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-earth">
            Email
          </p>
          <p className={`mt-3 ${contactDetailValue}`}>
            <a
              href={`mailto:${SITE.email}`}
              className="underline decoration-chocolate/35 underline-offset-[6px] transition-colors hover:text-earth hover:decoration-earth"
            >
              {SITE.email}
            </a>
          </p>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-earth">
            Phone
          </p>
          <ul className={`mt-3 space-y-3 ${contactDetailValue}`}>
            {SITE.phones.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone}`}
                  className="underline decoration-chocolate/35 underline-offset-[6px] transition-colors hover:text-earth hover:decoration-earth"
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
