import type { Metadata } from "next";
import { PolaroidStackSlider } from "@/components/PolaroidStackSlider";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Polaroid stack",
  description: "Scroll-driven stack of polaroid photographs.",
};

const placeholders = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    alt: "Sunlit mountain valley",
    caption: "Valley light",
    meta: {
      eyebrow: "01 · Landscape",
      title: "Valley Light",
      description: "Golden morning rays filtering across the silent mountain pass.",
      detailTitle: "35mm Analog Print",
      detailDescription: "Archival matte paper with gentle natural grain and luminous contrast.",
      tag: "Open Horizon",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=960&q=80",
    alt: "Ridge above a sea of clouds",
    caption: "Above the clouds",
    meta: {
      eyebrow: "02 · Elevation",
      title: "Above the Clouds",
      description: "Standing above a rolling sea of mist as dawn breaks through the peaks.",
      detailTitle: "Highland Series",
      detailDescription: "Crisp mountain air captured at sunrise in the southern Alps.",
      tag: "Quiet Heights",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=960&q=80",
    alt: "Sunbeams through a green forest",
    caption: "Morning trees",
    meta: {
      eyebrow: "03 · Woodland",
      title: "Morning Trees",
      description: "Sunbeams piercing through ancient mossy pines in deep tranquility.",
      detailTitle: "Forest Study",
      detailDescription: "Rich emerald tones and natural contrast under towering canopies.",
      tag: "Ancient Woods",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=960&q=80",
    alt: "Fog settling over green hills",
    caption: "Low fog",
    meta: {
      eyebrow: "04 · Atmosphere",
      title: "Low Fog",
      description: "Gentle mist wrapping around green rolling hills in soft gradients.",
      detailTitle: "Hills at Dawn",
      detailDescription: "Subtle textures and minimalist composition in early autumn.",
      tag: "Misty Morning",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=960&q=80",
    alt: "Mountain lake surrounded by pines",
    caption: "Still water",
    meta: {
      eyebrow: "05 · Reflection",
      title: "Still Water",
      description: "Mirror-clear alpine lake flanked by towering evergreens and silent peaks.",
      detailTitle: "Glacial Waters",
      detailDescription: "Serene mountain stillness frozen in crisp monochrome clarity.",
      tag: "Pure Reflection",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=960&q=80",
    alt: "Green hillside under a bright sky",
    caption: "Open hill",
    meta: {
      eyebrow: "06 · Meadows",
      title: "Open Hill",
      description: "Vibrant green crest reaching toward endless bright skies and drifting clouds.",
      detailTitle: "Summer Meadows",
      detailDescription: "Warm daylight and expansive vistas captured in natural color.",
      tag: "Wild Green",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=960&q=80",
    alt: "Waterfall in a mossy forest",
    caption: "Waterfall",
    meta: {
      eyebrow: "07 · Cascade",
      title: "Mossy Waterfall",
      description: "Rushing clear stream cascading through lush temperate rainforest boulders.",
      detailTitle: "Flowing Waters",
      detailDescription: "Long-exposure movement and deep velvet greens along the gorge.",
      tag: "Living Water",
    },
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=960&q=80",
    alt: "Lake and peaks at dusk",
    caption: "Dusk lake",
    meta: {
      eyebrow: "08 · Twilight",
      title: "Dusk Lake",
      description: "Alpine peaks glowing in twilight hues above glassy still waters.",
      detailTitle: "Twilight Study",
      detailDescription: "Palette of lavender, gold, and slate reflected on quiet waves.",
      tag: "Golden Hour",
    },
  },
];

export default function PolaroidDemoPage() {
  return (
    <SiteShell>
      <section className="overflow-hidden bg-sky/30 py-16 sm:py-24">
        <div className="mx-auto max-w-xl px-5 text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Demo
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate sm:text-5xl">
            Polaroid stack
          </h1>
          <p className="mt-4 font-serif text-lg leading-relaxed text-chocolate/75">
            Eight placeholder prints. Scroll to flip cards, or use the controls below.
          </p>
        </div>
        <PolaroidStackSlider className="mt-8" images={placeholders} />
      </section>
    </SiteShell>
  );
}
