import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import {
  BLANKET_CARE,
  FRAME_CARE,
  HANDMADE_NOTE,
  KEYCHAIN_CARE,
  TOY_CARE,
  TOY_THREAD_CARE,
} from "@/lib/catalog-content";

export const metadata: Metadata = {
  title: "Care Guide",
  description:
    "How to care for Sky n Soul crochet blankets, toys, keychains, and handmade keepsakes.",
};

export default function CareGuidePage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Care Guide"
      intro="A little gentleness goes a long way. Follow these steps to keep your handmade pieces beautiful for years."
    >
      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">
          Crochet Blankets
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {BLANKET_CARE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">
          Crochet Toys (Cotton Yarn)
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {TOY_CARE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">
          Crochet Toys (Thread)
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {TOY_THREAD_CARE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">
          Keychains & Tea Coasters
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {KEYCHAIN_CARE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 font-serif italic text-chocolate/70">
          Handcrafted with love — a little care keeps it beautiful for longer.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-medium text-chocolate">Frames</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {FRAME_CARE.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="border-t border-chocolate/10 pt-8">
        <p className="font-serif italic leading-relaxed text-chocolate/70">
          {HANDMADE_NOTE}
        </p>
      </section>
    </ContentPageLayout>
  );
}
