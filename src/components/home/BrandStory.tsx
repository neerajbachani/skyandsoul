import { BRAND_STORY } from "@/lib/constants";

export function BrandStory() {
  return (
    <section className="bg-canvas px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-3xl font-medium leading-snug text-chocolate sm:text-4xl">
          “{BRAND_STORY.quote}”
        </p>
        <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-chocolate/80 sm:text-xl">
          {BRAND_STORY.body}
        </p>
      </div>
    </section>
  );
}
