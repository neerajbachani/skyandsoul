import { Reveal } from "@/components/motion/reveal";
import { VALUE_PROPS } from "@/lib/constants";

const LOOP_COPIES = 4;

function PropTrack({ duplicate = false }: { duplicate?: boolean }) {
  const items = Array.from({ length: LOOP_COPIES }, () => VALUE_PROPS).flat();

  return (
    <ul
      className={`flex gap-4 pr-4 sm:gap-5 sm:pr-5${duplicate ? " motion-reduce:hidden" : " motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-5 motion-reduce:pr-5 sm:motion-reduce:px-8"}`}
      aria-hidden={duplicate || undefined}
    >
      {items.map((prop, index) => {
        const sequence = index % VALUE_PROPS.length;
        const repeat = Math.floor(index / VALUE_PROPS.length) > 0;
        const decorative = duplicate || repeat;

        return (
          <li
            key={`${prop.id}-${index}`}
            aria-hidden={decorative || undefined}
            className={`flex w-[min(82vw,26rem)] shrink-0 gap-5 rounded-[23px] border border-chocolate/10 bg-canvas px-6 py-7 sm:px-8 sm:py-8${repeat ? " motion-reduce:hidden" : ""}`}
          >
            <span className="pt-1.5 font-sans text-[11px] font-medium tracking-[0.16em] text-sage">
              {String(sequence + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-serif text-2xl font-medium text-chocolate sm:text-3xl">
                {prop.title}
              </h3>
              <p className="mt-2 max-w-[32ch] font-serif text-lg leading-relaxed text-chocolate/75">
                {prop.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ValueProps() {
  return (
    <section className="overflow-hidden bg-white py-12 sm:py-20" aria-label="How we make">
      

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-visible motion-reduce:[mask-image:none]">
        <div className="flex w-max animate-marquee [animation-duration:70s] hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          <PropTrack />
          <PropTrack duplicate />
        </div>
      </div>
    </section>
  );
}
