import type { Metadata } from "next";
import Link from "next/link";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import {
  HELP_DESK_FAQS,
  PRODUCT_CARE_FAQS,
} from "@/lib/catalog-content";

export const metadata: Metadata = {
  title: "Help Desk",
  description:
    "Order, shipping, delivery, and gifting questions for Sky n Soul handmade products.",
};

export default function FaqPage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Help Desk"
      intro="Answers to the questions we hear most often about orders, delivery, and gifting."
    >
      <section>
        <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          Orders & Delivery
        </h2>
        <div className="mt-6 space-y-8">
          {HELP_DESK_FAQS.map((item) => (
            <div key={item.q}>
              <h3 className="font-serif text-2xl font-medium text-chocolate">
                {item.q}
              </h3>
              <p className="mt-3">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-chocolate/10 pt-10">
        <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          Products & Care
        </h2>
        <div className="mt-6 space-y-8">
          {PRODUCT_CARE_FAQS.map((item) => (
            <div key={item.q}>
              <h3 className="font-serif text-2xl font-medium text-chocolate">
                {item.q}
              </h3>
              <p className="mt-3">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-chocolate/10 pt-10">
        <h2 className="font-serif text-2xl font-medium text-chocolate">
          Still need help?
        </h2>
        <p className="mt-3">
          <Link
            href="/contact"
            className="text-earth underline underline-offset-4"
          >
            Speak to us
          </Link>{" "}
          — we are here Monday to Saturday, 9am to 6pm.
        </p>
      </section>
    </ContentPageLayout>
  );
}
