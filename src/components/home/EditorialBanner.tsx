import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CLOUDINARY } from "@/lib/catalog-images";

export function EditorialBanner() {
  return (
    <section className="bg-sky">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[480px]">
          <Image
            src={CLOUDINARY.categoryFrameItYourWay}
            alt="Personalized cloud nursery frame with crochet animals"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-5 py-16 sm:px-12 lg:px-16 lg:py-20">
          <div className="max-w-md">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
              Gifting
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium leading-snug text-chocolate sm:text-4xl">
              The Perfect Gift for New Beginnings
            </h2>
            <p className="mt-5 font-serif text-lg leading-relaxed text-chocolate/80">
              Heirloom blankets, crochet companions, and Frame It Your Way keepsakes —
              ready to welcome the ones we love.
            </p>
            <div className="mt-8">
              <Button href="/collections/blankets" showArrow>
                Shop Blankets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
