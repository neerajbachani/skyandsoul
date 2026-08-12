import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about materials, care, shipping, and Sky n Soul handmade products.",
};

const FAQS = [
  {
    q: "What are the blankets made of?",
    a: "Our crochet baby blankets are handcrafted with premium cotton yarn and include a soft backing lining for everyday comfort.",
  },
  {
    q: "What age are the blankets for?",
    a: "Blankets are designed for babies aged 0–3 years — soft enough for newborns and cozy through early childhood.",
  },
  {
    q: "How do I wash a blanket?",
    a: "Hand wash only with mild detergent, lay flat to air dry, and avoid hanging, bleaching, or tumble drying.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes — free shipping on orders above ₹999. First orders also receive a flat 10% discount.",
  },
  {
    q: "What is Frame It Your Way?",
    a: "A five-step personalization experience: choose a frame design, select a toy, add a name, preview, and purchase. Interactive checkout opens in Phase B.",
  },
  {
    q: "Can I order without online checkout?",
    a: "Yes. Use Contact to Order on any product page and we will help you reserve a piece while cart and payments are being built.",
  },
];

export default function FaqPage() {
  return (
    <ContentPageLayout
      eyebrow="Customer Care"
      title="Frequently Asked Questions"
      intro="A few quiet answers for the details that matter before you welcome a piece home."
    >
      {FAQS.map((item) => (
        <section key={item.q}>
          <h2 className="font-serif text-2xl font-medium text-chocolate">{item.q}</h2>
          <p className="mt-3">{item.a}</p>
        </section>
      ))}
    </ContentPageLayout>
  );
}
