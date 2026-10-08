import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

export const metadata: Metadata = {
  title: "Shipping, Returns & Cancellations",
  description:
    "Shipping timelines, free shipping above ₹999, and return and cancellation policies for Sky n Soul orders.",
};

export default function ShippingPage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Shipping, Returns & Cancellations"
      intro="We pack every heirloom piece with care so it arrives ready to become part of your story."
    >
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">Shipping</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Free shipping on orders above ₹999.</li>
          <li>Flat 10% off on your first order.</li>
          <li>Orders typically ship within 3–5 business days.</li>
          <li>Delivery timelines vary by location; we will share tracking once your parcel is on its way.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">Returns</h2>
        <p className="mt-4">
          All sales are final. We do not accept returns or exchanges on any Sky n Soul orders.
        </p>
      </section>
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">Cancellations</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            To cancel an order, contact our team within 24 hours of placing it through our contact
            page. We cannot cancel orders after 24 hours.
          </li>
          <li>
            Customized orders — including personalized frames, names, and made-to-order pieces —
            cannot be cancelled at any time once placed.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">Need help?</h2>
        <p className="mt-4">
          Reach out through our contact page and we will happily help with shipping questions,
          gift timing, or special requests.
        </p>
      </section>
    </ContentPageLayout>
  );
}
