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
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=960&q=80",
    alt: "Ridge above a sea of clouds",
    caption: "Above the clouds",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=960&q=80",
    alt: "Sunbeams through a green forest",
    caption: "Morning trees",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=960&q=80",
    alt: "Fog settling over green hills",
    caption: "Low fog",
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=960&q=80",
    alt: "Mountain lake surrounded by pines",
    caption: "Still water",
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=960&q=80",
    alt: "Green hillside under a bright sky",
    caption: "Open hill",
  },
  {
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=960&q=80",
    alt: "Waterfall in a mossy forest",
    caption: "Waterfall",
  },
  {
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=960&q=80",
    alt: "Lake and peaks at dusk",
    caption: "Dusk lake",
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
            Eight placeholder prints. Scroll over the stack, drag sideways, or use the arrow keys.
          </p>
        </div>
        <PolaroidStackSlider className="mt-8" images={placeholders} />
      </section>
    </SiteShell>
  );
}
