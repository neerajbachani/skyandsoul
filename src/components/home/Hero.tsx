import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { HERO } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden bg-sky/40 lg:min-h-[78vh]">
      <Image
        src={HERO.image}
        alt={HERO.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/90 via-canvas/55 to-transparent" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 py-20 sm:px-8 lg:min-h-[78vh]">
        <div className="max-w-xl">
          <h1 className="font-serif text-5xl font-medium leading-[1.1] text-chocolate sm:text-6xl lg:text-7xl">
            {HERO.headline}
          </h1>
          <p className="mt-6 font-serif text-xl italic leading-relaxed text-earth sm:text-2xl">
            {HERO.subheadline}
          </p>
          <div className="mt-10">
            <Button href={HERO.ctaHref} showArrow>
              {HERO.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
