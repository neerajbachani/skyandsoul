import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

export const metadata: Metadata = {
  title: "Gift Wrapping",
  description: "Gift-ready packaging for Sky n Soul heirloom pieces.",
};

export default function GiftWrappingPage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Gift Wrapping"
      intro="Every Sky n Soul piece is packaged with intention — soft, simple, and ready to celebrate."
    >
      <p>
        Our gift-ready packaging is designed to feel like opening a little nest: clean wrapping,
        careful protection for handmade textures, and space for a short handwritten note when you
        request one.
      </p>
      <p>
        Mention gift wrapping on the contact form when you place an inquiry, and we will confirm
        options for blankets, toys, frames, and little extras.
      </p>
      <p>
        Full gift-message checkout options will arrive with Phase B. Until then, we are happy to
        prepare your order for gifting by hand.
      </p>
    </ContentPageLayout>
  );
}
