import Image from "next/image";

type CollectionHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export function CollectionHero({
  eyebrow = "Collection",
  title,
  description,
  image,
  imageAlt,
}: CollectionHeroProps) {
  return (
    <section className="border-b border-chocolate/10 bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium text-balance text-chocolate sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-chocolate/75">
            {description}
          </p>
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-sky/20">
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
