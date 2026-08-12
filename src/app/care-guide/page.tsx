import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

export const metadata: Metadata = {
  title: "Care Guide",
  description:
    "How to care for Sky n Soul crochet blankets and handmade keepsakes.",
};

export default function CareGuidePage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Care Guide"
      intro="A little gentleness goes a long way. Follow these steps to keep your handmade pieces soft for years."
    >
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">
          Crochet Blankets
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Hand wash only using a mild detergent.</li>
          <li>Do not hang the blanket after washing.</li>
          <li>Lay flat on a clean surface to air dry.</li>
          <li>Do not bleach or tumble dry.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">
          Crochet Toys
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>Spot clean with mild soap and a soft cloth.</li>
          <li>Air dry flat — avoid wringing or twisting.</li>
          <li>Do not bleach or tumble dry.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">Frames</h2>
        <p className="mt-4">
          Wipe wooden frames with a soft dry cloth and keep away from prolonged moisture so the
          finish stays warm and natural.
        </p>
      </section>
    </ContentPageLayout>
  );
}
