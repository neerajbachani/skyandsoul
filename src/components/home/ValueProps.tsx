import { Reveal } from "@/components/motion/reveal";
import { VALUE_PROPS } from "@/lib/constants";

export function ValueProps() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-10 sm:mb-14">
          <p
            data-reveal
            className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage"
          >
            How we make
          </p>
          <h2
            data-reveal
            className="mt-3 max-w-xl font-serif text-3xl font-medium leading-tight text-chocolate sm:text-4xl"
          >
            Pieces meant to be kept
          </h2>
        </Reveal>
        <Reveal className="divide-y divide-chocolate/10 border-y border-chocolate/10">
          {VALUE_PROPS.map((prop, index) => (
            <div
              key={prop.id}
              data-reveal
              className="grid gap-2 py-7 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-baseline sm:gap-16 sm:py-8"
            >
              <h3 className="font-serif text-2xl font-medium text-chocolate">
                <span className="mr-3 font-sans text-[11px] font-medium tracking-[0.16em] text-sage">
                  0{index + 1}
                </span>
                {prop.title}
              </h3>
              <p className="max-w-[46ch] font-serif text-lg leading-relaxed text-chocolate/75">
                {prop.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
