import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { FRAME_DESIGNS } from "@/lib/catalog-content";
import { FRAME_IT_STEPS } from "@/lib/constants";

type FrameItLandingProps = {
  category: {
    name: string;
    description: string;
    image: string;
    imageAlt: string;
  };
};

export function FrameItLanding({ category }: FrameItLandingProps) {
  return (
    <>
      <section className="relative min-h-[50vh] overflow-hidden bg-sky/40">
        <Image
          src={category.image}
          alt={category.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-canvas/75" />
        <div className="relative mx-auto flex min-h-[50vh] max-w-7xl items-end px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections" },
                { label: category.name },
              ]}
            />
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              Personalize
            </p>
            <h1 className="mt-4 font-serif text-4xl font-medium text-chocolate sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-5 font-serif text-lg leading-relaxed text-chocolate/80">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              How it works
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate">
              Five gentle steps to a keepsake
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {FRAME_IT_STEPS.map((step) => (
              <div
                key={step.step}
                className="border border-chocolate/10 bg-canvas px-5 py-6"
              >
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                  Step {step.step}
                </p>
                <h3 className="mt-3 font-serif text-xl font-medium text-chocolate">
                  {step.title}
                </h3>
                <p className="mt-3 font-serif text-base leading-relaxed text-chocolate/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
                Preview
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate">
                Frame design collection
              </h2>
            </div>
            <p className="max-w-md font-serif text-base text-chocolate/70">
              Choose from our signature frame styles — each one ready to pair with a
              crochet companion and a name plaque.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {FRAME_DESIGNS.map((frame) => (
              <Link
                key={frame.slug}
                href={`/products/${frame.slug}`}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden bg-sky/20">
                  <Image
                    src={frame.image}
                    alt={frame.imageAlt}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-serif text-base font-medium text-chocolate group-hover:text-earth">
                  {frame.name}
                </p>
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
                  {frame.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-medium text-chocolate">
            Speak to Us
          </h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-chocolate/80">
            Tell us your frame, toy, and name choices — we will hold your design notes
            and guide you through the order.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact" variant="filled">
              Contact to Reserve
            </Button>
            <Link
              href="/collections/toys"
              className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px]"
            >
              Browse toys to pair
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
