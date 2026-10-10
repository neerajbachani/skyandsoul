import Image from "next/image";
import Link from "next/link";
import { CLOUDINARY } from "@/lib/catalog-images";

const STEPS = [
  { num: "01", title: "Pick Frame", desc: "Cloud Nest, Little Curve, or Roots" },
  { num: "02", title: "Choose Mascot", desc: "Hand-crocheted animal companions" },
  { num: "03", title: "Add Name", desc: "Customized keepsake plaque" },
  { num: "04", title: "Live Preview", desc: "See your design come alive" },
  { num: "05", title: "Heirloom Delivery", desc: "Gift-wrapped with care notes" },
];

export function CollectionsCustomizerBanner() {
  return (
    <section
      id="frame-it-your-way"
      className="scroll-mt-20 border-y border-chocolate/10 bg-[#EDF3F8]/70 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Side: Story & Steps */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-earth/20 bg-white/80 px-3.5 py-1">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-earth">
                ✦ Bespoke Studio Experience
              </span>
            </div>

            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-chocolate sm:text-4xl lg:text-5xl">
              Frame It Your Way
            </h2>

            <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-chocolate/80">
              Personalize a one-of-a-kind nursery keepsake in five gentle steps.
              Combine handcrafted wooden framing with charming crochet companions
              and your child’s name for a gift that will be treasured for a lifetime.
            </p>

            {/* 5 Steps Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="rounded-sm border border-chocolate/10 bg-white/70 p-3.5 backdrop-blur-sm sm:p-4"
                >
                  <span className="font-sans text-[11px] font-semibold tracking-wider text-sage">
                    {step.num}
                  </span>
                  <h3 className="mt-1 font-serif text-base font-medium text-chocolate">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 font-sans text-xs text-chocolate/65">
                    {step.desc}
                  </p>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-sm border border-dashed border-earth/30 bg-earth/5 p-3.5 sm:p-4">
                <span className="font-sans text-[10px] uppercase tracking-wider text-earth">
                  Custom Request?
                </span>
                <p className="mt-1 font-serif text-sm font-medium text-chocolate">
                  Custom colors & themes welcome
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/collections/frame-it-your-way"
                className="inline-flex items-center gap-2 bg-chocolate px-7 py-3.5 font-sans text-xs font-medium uppercase tracking-[0.14em] text-white transition-all hover:bg-earth active:scale-[0.98]"
              >
                <span>Launch Bespoke Studio</span>
                <span aria-hidden="true">→</span>
              </Link>
              <span className="font-sans text-xs text-chocolate/60">
                Live preview in your browser · No design skills needed
              </span>
            </div>
          </div>

          {/* Right Side: Visual Showcase */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-sm border border-chocolate/10 bg-white shadow-lg lg:max-w-none">
              <Image
                src={CLOUDINARY.categoryFrameItYourWay}
                alt="Personalized cloud nursery frame with crochet animals and a name plaque"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/30 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 rounded-sm border border-white/20 bg-white/95 p-3.5 shadow-sm backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-sage">
                      Custom Keepsake
                    </p>
                    <p className="font-serif text-base font-medium text-chocolate">
                      Cloud Nest Personalized Frame
                    </p>
                  </div>
                  <span className="font-sans text-xs font-medium text-earth">
                    Made to Order
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
