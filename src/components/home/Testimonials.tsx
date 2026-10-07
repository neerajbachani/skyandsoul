import { Reveal } from "@/components/motion/reveal";
import { TESTIMONIALS } from "@/lib/constants";

const PLACEMENT = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-20",
  "lg:col-span-5 lg:col-start-8",
] as const;

export function Testimonials() {
  return (
    <section className="bg-canvas px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 max-w-xl sm:mb-16">
          <p
            data-reveal
            className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage"
          >
            Kind Words
          </p>
          <h2
            data-reveal
            className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl"
          >
            Loved by Growing Families
          </h2>
        </Reveal>
        <Reveal className="grid items-start gap-5 lg:grid-cols-12 lg:gap-6">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={item.id}
              data-reveal
              className={`rounded-[23px] border border-transparent bg-chocolate/[0.04] p-1.5 ring-1 ring-chocolate/10 ${PLACEMENT[index] ?? ""}`}
            >
              <blockquote className="rounded-[17px] border border-transparent bg-white px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_18px_40px_-28px_rgba(75,50,34,0.55)] sm:px-7 sm:py-7">
                <p
                  className={`font-serif leading-relaxed text-chocolate ${
                    index === 0 ? "text-2xl sm:text-[1.7rem]" : "text-xl"
                  }`}
                >
                  “{item.quote}”
                </p>
                <footer className="mt-5 border-t border-chocolate/10 pt-4">
                  <cite className="not-italic">
                    <span className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth">
                      {item.author}
                    </span>
                    <span className="mt-1 block font-sans text-xs text-chocolate/55">
                      {item.detail}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
